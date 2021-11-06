const express = require("express");
const router = express.Router();

const {
  validateSignup,
  validateLogin,
  validateSubscriptionUpdate,
} = require("./validation.users");

const {
  registrationController,
  loginController,
  logoutController,
  currentController,
  updateController,
  uploadAvatarController,
  verifyUser,
  repeatEmailForVerifyUser,
} = require("../../controllers/users.controller");
const guard = require("../../helpers/guard");
const loginLimit = require("../../helpers/rate-limit-login");
const upload = require("../../helpers/uploads");
const wrapError = require("../../helpers/errorHandler");

router.post("/signup", validateSignup, registrationController);
router.post("/login", loginLimit, validateLogin, loginController);
router.post("/logout", guard, logoutController);
router.get("/current", guard, currentController);
router.patch("/", guard, validateSubscriptionUpdate, updateController);
router.patch(
  "/avatars",
  guard,
  upload.single("avatar"),
  uploadAvatarController
);

router.get("/verify/:token", wrapError(verifyUser));
router.post("/verify", repeatEmailForVerifyUser);
module.exports = router;