import { NextFunction, Request, Response } from "express";
import { Service } from "typedi";
import { AuthToken } from "../../domains/auth/utils/auth.token";
import jwt from 'jsonwebtoken';
import { AuthRepository } from "../../domains/auth/repository/auth.repository";
import { UserRole } from "../entity/user/user.entity";

// Extend the Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        role: UserRole;
      };
    }
  }
}

interface TokenPayload {
  id: number;
  email: string;
  role: UserRole;
}

@Service()
export class RoleBasedAccessMiddleware {
  constructor(
    public authToken: AuthToken,
    private authRepository: AuthRepository
  ) {}

  checkRoleAccess = (allowedRoles: UserRole[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        // Get the token from the Authorization header
        const token = req.header("Authorization")?.replace("Bearer ", "") || "";

        // Extensive logging for debugging
        console.log('Raw Token:', token);

        // Check if token exists
        if (token === "") {
          return res.status(403).json({ message: "Access not allowed: No token provided" });
        }

        // Validate the token with detailed error handling
        const decodedToken = this.validateTokenWithType(token);

        // More detailed logging
        console.log('Decoded Token:', decodedToken);

        if (!decodedToken) {
          return res.status(401).json({ 
            message: "Invalid or expired token",
            details: "Token could not be decoded or validated"
          });
        }

        // Added async/await support
        const user = await this.authRepository.getUserByFields({ 
          email: decodedToken.email 
        });
        console.log(user,'userrrrrrrrr')
  
        // Check if user exists
        if (!user) {
          return res.status(403).json({ 
            message: "Access denied: User not found",
            email: decodedToken.email
          });
        }

        // Check if user's role is in the allowed roles
        if (!allowedRoles.includes(decodedToken.role)) {
          return res.status(403).json({ 
            message: "Access denied: Insufficient permissions",
            requiredRoles: allowedRoles,
            userRole: decodedToken.role 
          });
        }

        // Attach user information to the request for further use
        req.user = {
          id: decodedToken.id,
          email: decodedToken.email,
          role: decodedToken.role
        };

        // Proceed to the next middleware or route handler
        next();
      } catch (error: any) {
        console.error('Role Access Middleware Error:', error);
        return res
          .status(500)
          .json({ 
            message: `Internal server error: ${error.message}`,
            stack: error.stack 
          });
      }
    };
  }

  /**
   * Enhanced token validation method with comprehensive error checking
   * @param token 
   * @returns TokenPayload or null
   */
  private validateTokenWithType(token: string): TokenPayload | null {
    try {
      console.log('Validating token:', token);

      // Additional check for token validity
      if (!token) {
        console.error('No token provided');
        return null;
      }

      // Direct JWT verification with error logging
      try {
        const decoded = jwt.verify(
          token, 
          process.env.SECRET_KEY ?process.env.SECRET_KEY:""
        ) as TokenPayload;

        // Perform additional validation checks
        if (!decoded.id || !decoded.email || !decoded.role) {
          console.error('Invalid token payload:', decoded);
          return null;
        }

        console.log('Token successfully decoded:', decoded);
        return decoded;
      } catch (jwtError) {
        console.error('JWT Verification Error:', jwtError);
        
        // Specific error handling
        if (jwtError instanceof jwt.TokenExpiredError) {
          console.error('Token has expired');
        } else if (jwtError instanceof jwt.JsonWebTokenError) {
          console.error('Invalid token signature');
        }

        return null;
      }
    } catch (error) {
      console.error('Unexpected error in token validation:', error);
      return null;
    }
  }
}