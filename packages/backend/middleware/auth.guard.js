import jwt from "jsonwebtoken";

export default function authGuard(req, res, next) {
  try {
    const authHeader = req.get("authorization") || "";
    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Verify token
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // Gán userId từ payload
    req.userId = payload.sub || payload.userId || payload.id;

    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}