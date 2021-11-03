const { HttpCode } = require("../config/constants");

const guard = (role) => (req, res, next) => {
  const roleUser = req.user.gender;

  if (roleUser !== role) {
    return res.status(HttpCode.FORBIDDEN).json({
      status: "error",
      code: HttpCode.FORBIDDEN,
      message: "Access is denied",
    });
  }

  return next();
};

module.exports = guard;