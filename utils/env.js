require("dotenv").config();

exports.env = {
  mongoUri: process.env.MONGO_URL,
  jwtSecret: process.env.JWT_SECRET,
  nodeEnv: process.env.NODE_ENV,
  port: process.env.PORT || 5000,
};
