const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    // Extract token from Authorization header
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(401).send({ message: "Access Denied: No token provided." });

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach the decoded user information to the request object
    next(); // Pass control to the next middleware or route handler
  } catch (error) {
    res.status(400).send({ message: "Invalid token." });
  }
};

module.exports = authMiddleware;
