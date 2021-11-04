const jwt = require("jsonwebtoken");
const Users = require("../repository/users.repository");
const { HttpCode } = require("../config/constants");
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
    const newUser = await Users.create({ name, email, password, gender });
    return res.status(HttpCode.CREATED).json({
      status: "success",
      code: HttpCode.CREATED,
      data: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        gender: newUser.gender,
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
    console.log("validPassword", isValidPassword);
    if (isValidPassword) {
      const id = user._id;
      const payload = { id };
      const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "2h" });
      await Users.updateToken(id, token);
      return res.status(HttpCode.OK).json({
        status: "success",
        code: HttpCode.OK,
        date: {
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

module.exports = {
  registrationController,
  loginController,
  logoutController,
  currentController,
  updateController,
};