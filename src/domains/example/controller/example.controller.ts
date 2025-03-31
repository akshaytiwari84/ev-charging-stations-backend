import { Service } from "typedi";
import { Request, Response } from "express";
import { ChargingStation } from "../../../common/entity/user/stations.entity";
import { ChargingStationService } from "../service/example.service";
import { AddChargingStation, UpdateChargingStation } from "../model/exampleInDto";

@Service()
export class ChargingStationController {
  constructor(private chargingStationService: ChargingStationService) {}

  async getAllChargingStations(req: Request, res: Response): Promise<Response> {
    try {
      // Extract filter parameters from query string
      const filters = {
        name: req.query.name as string,
        status: req.query.status as string,
        connectorType: req.query.connectorType as string,
        minPowerOutput: req.query.minPowerOutput ? parseFloat(req.query.minPowerOutput as string) : undefined,
        maxPowerOutput: req.query.maxPowerOutput ? parseFloat(req.query.maxPowerOutput as string) : undefined
      };
      
      // Remove undefined filters
      Object.keys(filters).forEach(key => {
        if (filters[key as keyof typeof filters] === undefined) {
          delete filters[key as keyof typeof filters];
        }
      });
      
      const result = await this.chargingStationService.getAllChargingStations(
        Object.keys(filters).length > 0 ? filters : undefined
      );
      
      return res.json(result);
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: `Failed to fetch charging stations: ${error.message}` });
    }
  }

  async getChargingStationById(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id, 10);
      const result = await this.chargingStationService.getChargingStationById(id);
      
      if (!result) {
        return res.status(404).json({ message: `Charging station with ID ${id} not found` });
      }
      
      return res.json(result);
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: `Failed to fetch charging station: ${error.message}` });
    }
  }

  async createChargingStation(req: Request, res: Response): Promise<Response> {
    try {
      const newStation = await this.chargingStationService.createChargingStation(
        req.body as AddChargingStation
      );
      return res.status(201).json(newStation);
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: `Failed to add charging station: ${error.message}` });
    }
  }

  async updateChargingStation(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id, 10);
      const updatedStation = await this.chargingStationService.updateChargingStation(
        id,
        req.body as UpdateChargingStation
      );
      
      if (!updatedStation) {
        return res.status(404).json({ message: `Charging station with ID ${id} not found` });
      }
      
      return res.json(updatedStation);
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: `Failed to update charging station: ${error.message}` });
    }
  }

  async deleteChargingStation(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id, 10);
      const deleted = await this.chargingStationService.deleteChargingStation(id);
      
      if (!deleted) {
        return res.status(404).json({ message: `Charging station with ID ${id} not found` });
      }
      
      return res.status(204).send();
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: `Failed to delete charging station: ${error.message}` });
    }
  }
}