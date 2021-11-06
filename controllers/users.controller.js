const jwt = require("jsonwebtoken");
const fs = require("fs/promises");
const path = require("path");
const mkdirp = require("mkdirp");
const Users = require("../repository/users.repository");
const UploadService = require("../services/file-upload");
const { HttpCode } = require("../config/constants");
const EmailService = require("../services/email/service");
const {
  CreateSenderNodemailer,
  CreateSenderSendgrid,
} = require("../services/email/sender");

const { CustomError } = require("../helpers/customError");

require("dotenv").config();
const SECRET_KEY = process.env.JWT_SECRET_KEY;

const registrationController = async (req, res, next) => {
  const { name, email, password, gender } = req.body;
  const user = await Users.findByEmail(email);
  if (user) {
    return res.status(HttpCode.CONFLICT).json({
      status: "error",
      code: HttpCode.CONFLICT,
      message: "Email in use",
    });
  }
  try {
    // TODO send email for verify users

    const newUser = await Users.create({ name, email, password, gender });
    const emailService = new EmailService(
      process.env.NODE_ENV,
      new CreateSenderSendgrid()
    );
    const statusEmail = await emailService.sendVerifyEmail(
      newUser.email,
      newUser.name,
      newUser.verifyToken
    );
    return res.status(HttpCode.CREATED).json({
      status: "success",
      code: HttpCode.CREATED,
      data: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        gender: newUser.gender,
        avatar: newUser.avatar,
        successEmail: statusEmail,
      },
    });
  } catch (e) {
    next(e);
  }
};

const loginController = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await Users.findByEmail(email);
  if (user) {
    const isValidPassword = await user.isValidPassword(password);

    if (isValidPassword && user.isVerified) {
      const id = user._id;
      const payload = { id };
      const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "2h" });
      await Users.updateToken(id, token);
      return res.status(HttpCode.OK).json({
        status: "success",
        code: HttpCode.OK,
        data: {
          token,
          user: {
            email: user.email,
            subscription: user.subscription,
            id: user.id,
            gender: user.gender,
          },
        },
      });
    }
  }
  return res.status(HttpCode.UNAUTHORIZED).json({
    status: "error",
    code: HttpCode.UNAUTHORIZED,
    message: "Invalid credentials",
  });
};

const logoutController = async (req, res, next) => {
  const id = req.user._id;
  await Users.updateToken(id, null);
  return res.status(HttpCode.NO_CONTENT).json({ test: "test" });
};

const currentController = async (req, res, next) => {
  const userId = req.user._id;
  const user = await Users.findById(userId);
  if (user) {
    return res.status(HttpCode.OK).json({
      status: "success",
      code: HttpCode.OK,
      message: "Current user data",
      data: { user },
    });
  }
  throw new CustomError(404, "Not Found");
};

const updateController = async (req, res, next) => {
  const userId = req.user._id;
  const user = await Users.updateSubscription(userId, req.body);
  return res.status(HttpCode.OK).json({
    status: "success",
    code: HttpCode.OK,
    data: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const uploadAvatarController = async (req, res, next) => {
  const userId = String(req.user._id);
  const file = req.file;
  const AVATAR_OF_USERS = process.env.AVATAR_OF_USERS;
  const destination = path.join(AVATAR_OF_USERS, userId);
  await mkdirp(destination);
  const uploadService = new UploadService(destination);
  const avatarUrl = await uploadService.save(file, userId);
  await Users.updateAvatar(userId, avatarUrl);
  try {
    await fs.unlink(file.path);
  } catch (e) {
    console.log(e.message);
  }
  return res.status(HttpCode.OK).json({
    status: "success",
    code: HttpCode.OK,
    data: { avatar: avatarUrl },
  });
};

const verifyUser = async (req, res, next) => {
  const user = await Users.findUserByVerifyToken(req.params.token);
  if (user) {
    await Users.updateTokenVerify(user._id, true, null);
    return res.status(HttpCode.OK).json({
      status: "success",
      code: HttpCode.OK,
      data: {
        message: "Verification successful",
      },
    });
  }
  return res.status(HttpCode.NOT_FOUND).json({
    status: "error",
    code: HttpCode.NOT_FOUND,
    message: "Invalid token. User not found",
  });
};

const repeatEmailForVerifyUser = async (req, res, next) => {
  const { email } = req.body;
  const user = await Users.findByEmail(email);
  if (user) {
    const { email, name, verifyToken } = user;
    const emailService = new EmailService(
      process.env.NODE_ENV,
      new CreateSenderNodemailer()
    );
    const statusEmail = await emailService.sendVerifyEmail(
      email,
      name,
      verifyToken
    );
  }
  return res.status(HttpCode.OK).json({
    status: "success",
    code: HttpCode.OK,
    data: {
      message: "Success",
    },
  });
};

module.exports = {
  registrationController,
  loginController,
  logoutController,
  currentController,
  updateController,
  uploadAvatarController,
  verifyUser,
  repeatEmailForVerifyUser,
};