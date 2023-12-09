const jwt = require("jsonwebtoken");
const authConfig = require("../configs/auth.config");

verifyToken = async (req, res, next) => {
  try {
    const token = req.headers["x-access-token"];

    // Check if token is present
    if (!token) {
      return res.status(403).send({ code: 403, msg: "No token provided" });
    }

    // Verify token
    const decoded = await jwt.verify(token, authConfig.secret);

    // Extract user ID from decoded token
    req.userId = decoded.id;

    // Continue to next middleware
    next();
  } catch (error) {
    // Handle JWT verification errors
    if (error.name === "TokenExpiredError") {
      return res.status(401).send({ code: 401, msg: "Token expired" });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).send({ code: 401, msg: "Invalid token" });
    } else {
      console.error(error);
      return res.status(400).send({ code: 400, msg: "Service exception, please contact admin" });
    }
  }
};


module.exports = {
  verifyToken
};
