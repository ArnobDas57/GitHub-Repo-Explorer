import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    username?: string;
  };
}

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Unauthorized: No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      res.status(500).json({ message: "JWT secret not configured" });
      return;
    }

    const decoded = jwt.verify(token, jwtSecret) as {
      id: string;
      username?: string;
    };

    (req as AuthenticatedRequest).user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: "Forbidden: Invalid token" });
    return;
  }
};
