import Joi from "joi";
import { ConnectorType, StationStatus } from "../../../common/entity/user/stations.entity";

export const addChargingStationSchema = Joi.object({
  name: Joi.string().required(),
  latitude: Joi.number().required(),
  longitude: Joi.number().required(),
  status: Joi.string()
    .valid(...Object.values(StationStatus))
    .default(StationStatus.ACTIVE),
  powerOutput: Joi.number().required(),
  connectorType: Joi.string()
    .valid(...Object.values(ConnectorType))
    .required(),
  userId: Joi.number().required()
});

export const updateChargingStationSchema = Joi.object({
  name: Joi.string(),
  latitude: Joi.number(),
  longitude: Joi.number(),
  status: Joi.string()
    .valid(...Object.values(StationStatus)),
  powerOutput: Joi.number(),
  connectorType: Joi.string()
    .valid(...Object.values(ConnectorType)),
  userId: Joi.number()
}).min(1); // At least one field must be provided for update

export const idParamSchema = Joi.object({
  id: Joi.number().integer().positive().required()
});
export const stationQuerySchema = Joi.object({
  name: Joi.string().optional(),
  status: Joi.string().valid(...Object.values(StationStatus)).optional(),
  connectorType: Joi.string().valid(...Object.values(ConnectorType)).optional(),
  minPowerOutput: Joi.number().min(0).optional(),
  maxPowerOutput: Joi.number().min(0).optional()
});