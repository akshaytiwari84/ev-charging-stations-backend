
import { ConnectorType, StationStatus } from "../../../common/entity/user/stations.entity";

export interface AddChargingStation {
    name: string;
    latitude: number;
    longitude: number;
    status: StationStatus;
    powerOutput: number;
    connectorType: ConnectorType;
    userId: number;
}

export interface UpdateChargingStation {
    name?: string;
    latitude?: number;
    longitude?: number;
    status?: StationStatus;
    powerOutput?: number;
    connectorType?: ConnectorType;
    userId?: number;
}

export interface ChargingStationResponse {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    status: StationStatus;
    powerOutput: number;
    connectorType: ConnectorType;
    userId: number;
    createdAt: Date;
    updatedAt: Date;
}