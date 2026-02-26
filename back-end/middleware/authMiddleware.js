// middleware/authMiddleware.js
import jwt from "jsonwebtoken";

// Change 'module.exports =' to 'export default'
export default (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token)
    return res.status(401).json({ message: "No token, authorization denied" });

  try {
    // Note: Make sure "secret_key_123" matches exactly what you used to SIGN the token in auth.js
    const decoded = jwt.verify(token, "secret_key_123");
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};
