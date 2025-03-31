import { ValidateMiddleware } from "../../../common/middleware/validator.middleware";
import { Service } from "typedi";
import { AuthController } from "../controller/auth.controller";
import { Router } from "express";
import { 
  loginSchema, 
  registerSchema 
} from "../validator/auth.validator";

@Service()
export class AuthRoutes {
  public router: Router;
  constructor(
    private authController: AuthController,
    private validateMiddleware: ValidateMiddleware
  ) {
    this.router = Router();
    this.addRoutes();
  }

  public getRoutes(): Router {
    return this.router;
  }
  
  private addRoutes(): void {
    // Login route
    this.router.post(
      "/login",
      this.validateMiddleware.validate(loginSchema),
      this.authController.login.bind(this.authController)
    );
    
    // Register route
    this.router.post(
      "/register",
      this.validateMiddleware.validate(registerSchema),
      this.authController.register.bind(this.authController)
    );
  }
}