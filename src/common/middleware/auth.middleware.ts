import { NextFunction, Request, Response } from "express";
import { Service } from "typedi";
import { AuthToken } from "../../domains/auth/utils/auth.token";

@Service()
export class AuthMiddleware {
  constructor(public authToken: AuthToken) {}

  validateRoute = (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.header("Authorization")?.replace("Bearer ", "") || "";
      if (token === "") {
        return res.status(403).json({ message: "Access not allowed" });
      }

      const isValid = this.authToken.validateToken(token);

      if (!isValid) {
        return res.status(401).json({ message: "Invalid or expired token" });
      }

      next();
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: `Internal server error: ${error.message}` });
    }
  };
}
