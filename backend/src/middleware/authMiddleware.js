import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // НЯМА токен → работим като анонимен user
  if (!authHeader) {
    req.user = { 
      id: req.headers["x-user-id"] || null,
      anonymous: true
    };
    return next();
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: decoded.id,
      anonymous: false,
    };

    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};
