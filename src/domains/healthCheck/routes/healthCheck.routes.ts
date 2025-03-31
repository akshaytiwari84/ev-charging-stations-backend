import { Router } from "express";
import { HealthCheckController } from "./../controller/healthCheck.controller";
import { Service } from "typedi";

@Service()
export class HealthCheckRoutes {
  public router: Router;
  constructor(private healthCheckController: HealthCheckController) {
    this.router = Router();
    this.addRoutes();
  }

  public getRoutes(): Router {
    return this.router;
  }

  private addRoutes(): void {
    this.router.get("/",this.healthCheckController.healthCheck.bind(this.healthCheckController));
  }
}
