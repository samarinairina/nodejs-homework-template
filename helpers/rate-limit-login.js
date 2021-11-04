const rateLimit = require("express-rate-limit");
const { HttpCode } = require("../config/constants");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50,
  handler: (req, res, next) => {
    return res.status(HttpCode.TOO_MANY_REQUESTS).json({
      status: "error",
      code: HttpCode.TOO_MANY_REQUESTS,
      message: "Too Many Requests",
    });
  }, // limit each IP to 100 requests per windowMs
});
module.exports = limiter;