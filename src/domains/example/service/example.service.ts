import { Service } from "typedi";
import { ChargingStation } from "../../../common/entity/user/stations.entity";
import { ChargingStationRepository } from "../repository/example.repository";
import { AddChargingStation, UpdateChargingStation } from "../model/exampleInDto";

@Service()
export class ChargingStationService {
  constructor(private chargingStationRepository: ChargingStationRepository) {}

  async getAllChargingStations(filters?: {
    name?: string;
    status?: string;
    connectorType?: string;
    minPowerOutput?: number;
    maxPowerOutput?: number;
  }): Promise<ChargingStation[]> {
    return this.chargingStationRepository.getAll(filters);
  }

  async getChargingStationById(id: number): Promise<ChargingStation | null> {
    return this.chargingStationRepository.getById(id);
  }

  async createChargingStation(data: AddChargingStation): Promise<ChargingStation> {
    return this.chargingStationRepository.add(data);
  }

  async updateChargingStation(id: number, data: UpdateChargingStation): Promise<ChargingStation | null> {
    return this.chargingStationRepository.update(id, data);
  }

  async deleteChargingStation(id: number): Promise<boolean> {
    return this.chargingStationRepository.delete(id);
  }
}