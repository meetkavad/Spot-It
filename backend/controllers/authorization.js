require("dotenv").config();
const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Access denied" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log("Token expired or invalid");
      return res.status(403).json({ message: "Token expired or invalid" });
    }
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
