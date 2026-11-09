import jwt from "jsonwebtoken";

export function verifyToken(req, res, next) {
  // Get the Authorization header
  const authHeader = req.headers.authorization;

  // Check whether the Bearer token exists
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Authentication required"
    });
  }

  // Extract the token
  const token = authHeader.split(" ")[1];

  try {
    // Verify the token using our secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the verified user information
    req.user = decoded;

    // Allow the request to continue
    next();

  } catch (error) {
    return res.status(401).json({
      error: "Invalid or expired token"
    });
  }
}