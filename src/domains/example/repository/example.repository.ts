import { Service } from "typedi";
import { ChargingStation } from "../../../common/entity/user/stations.entity";
import { Op } from "sequelize";
import { AddChargingStation, UpdateChargingStation } from "../model/exampleInDto";

@Service()
export class ChargingStationRepository {
  constructor() {}

  async getAll(filters?: {
    name?: string;
    status?: string;
    connectorType?: string;
    minPowerOutput?: number;
    maxPowerOutput?: number;
  }): Promise<ChargingStation[]> {
    try {
      const where: any = {};
      
      if (filters) {
        // Name filter (partial match)
        if (filters.name) {
          where.name = {
            [Op.like]: `%${filters.name}%`
          };
        }
        
        // Status filter (exact match)
        if (filters.status) {
          where.status = filters.status;
        }
        
        // Connector type filter (exact match)
        if (filters.connectorType) {
          where.connectorType = filters.connectorType;
        }
        
        // Power output range filter
        if (filters.minPowerOutput || filters.maxPowerOutput) {
          where.powerOutput = {};
          
          if (filters.minPowerOutput) {
            where.powerOutput[Op.gte] = filters.minPowerOutput;
          }
          
          if (filters.maxPowerOutput) {
            where.powerOutput[Op.lte] = filters.maxPowerOutput;
          }
        }
      }
      
      return await ChargingStation.findAll({
        where
      });
    } catch (error) {
      throw error;
    }
  }

  async getById(id: number): Promise<ChargingStation | null> {
    try {
      return await ChargingStation.findByPk(id);
    } catch (error) {
      throw error;
    }
  }

  async add(data: AddChargingStation): Promise<ChargingStation> {
    try {
      return await ChargingStation.create({ ...data });
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, data: UpdateChargingStation): Promise<ChargingStation | null> {
    try {
      const station = await ChargingStation.findByPk(id);
      
      if (!station) {
        return null;
      }
      
      await station.update(data);
      return station;
    } catch (error) {
      throw error;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const station = await ChargingStation.findByPk(id);
      
      if (!station) {
        return false;
      }
      
      await station.destroy();
      return true;
    } catch (error) {
      throw error;
    }
  }
}