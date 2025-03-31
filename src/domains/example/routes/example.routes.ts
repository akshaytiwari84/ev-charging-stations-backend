import { Router } from "express";
import { Service } from "typedi";
import { AuthMiddleware } from "../../../common/middleware/auth.middleware";
import { ValidateMiddleware } from "../../../common/middleware/validator.middleware";
import { ChargingStationController } from "../controller/example.controller";
import { addChargingStationSchema, idParamSchema, stationQuerySchema, updateChargingStationSchema } from "../validator/example.validator";
import { RoleBasedAccessMiddleware } from "../../../common/middleware/rolecheck.middleware";
import { UserRole } from "../../../common/entity/user/user.entity";

@Service()
export class ChargingStationRoutes {
  public router: Router;
  constructor(
    private chargingStationController: ChargingStationController,
    private authMiddleware: AuthMiddleware,
    private validateMiddleware: ValidateMiddleware,
    private roleBasedAccessMiddleware: RoleBasedAccessMiddleware

  ) {
    this.router = Router();
    this.addRoutes();
  }

  public getRoutes(): Router {
    return this.router;
  }

  private addRoutes(): void {
    // Get all charging stations with optional name filter
    this.router.get(
      "/",
      this.validateMiddleware.validate(stationQuerySchema, "query"), 

      this.authMiddleware.validateRoute,
      this.chargingStationController.getAllChargingStations.bind(this.chargingStationController)
    );
    
    // Get a specific charging station by ID
    this.router.get(
      "/:id",
      this.validateMiddleware.validate(idParamSchema, "params"),
      this.authMiddleware.validateRoute,
      this.chargingStationController.getChargingStationById.bind(this.chargingStationController)
    );
    
    // Create a new charging station
    this.router.post(
      "/",
      this.validateMiddleware.validate(addChargingStationSchema),
      this.authMiddleware.validateRoute,
      this.roleBasedAccessMiddleware.checkRoleAccess([UserRole?.ADMIN,UserRole.SUPERADMIN]),

      this.chargingStationController.createChargingStation.bind(this.chargingStationController),
    );
    
    // Update an existing charging station
    this.router.put(
      "/:id",
      this.validateMiddleware.validate(idParamSchema, "params"),
      this.validateMiddleware.validate(updateChargingStationSchema),
      this.authMiddleware.validateRoute,
      this.roleBasedAccessMiddleware.checkRoleAccess([UserRole?.ADMIN,UserRole.SUPERADMIN]),

      this.chargingStationController.updateChargingStation.bind(this.chargingStationController)
    );
    
    // Delete a charging station
    this.router.delete(
      "/:id",
      this.validateMiddleware.validate(idParamSchema, "params"),
      this.authMiddleware.validateRoute,
      this.roleBasedAccessMiddleware.checkRoleAccess([UserRole?.ADMIN,UserRole.SUPERADMIN]),

      this.chargingStationController.deleteChargingStation.bind(this.chargingStationController)
    );
  }
}