const { rateLimit } = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  limit: 100, 
  standardHeaders: "draft-8", 
  legacyHeaders: false, 
  handler: (req, res) => {
    res.status(429).json({
      status: "failure",
      message: "Too many requests, please try again later.",
    });
  },
});

module.exports = limiter;
