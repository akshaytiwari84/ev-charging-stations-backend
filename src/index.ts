import express, { Application, Request, Response } from "express";
import Container, { Service } from "typedi";
import bodyParser from "body-parser";
import "reflect-metadata";
import { AuthRoutes } from "./domains/auth/routes/auth.routes";
import { Connection } from "./common/utils/connection";
import * as dotenv from "dotenv";
import cors from "cors";

import { HealthCheckRoutes } from "./domains/healthCheck/routes/healthCheck.routes";
import { ChargingStationRoutes } from "./domains/example/routes/example.routes";



dotenv.config();

@Service()
class Server {
  app: Application;
  port: number;

  constructor(
    private chargingStationsRoutes: ChargingStationRoutes,
    private authRoutes: AuthRoutes,





    private connection: Connection,
    private healthCheckRoutes: HealthCheckRoutes
  ) {
    this.init();
    // this.addAllRoutes();

    this.port = process.env.PORT ? parseInt(process.env.PORT, 10) :  3000;
    
  }
  async init() {
    this.app = express();
    this.app.use(cors());

    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    // this.app.use("/healthCheck", this.healthCheckRoutes.getRoutes());
 


    this.app.use("/auth", this.authRoutes.getRoutes());
    this.app.use("/healthCheck", this.healthCheckRoutes.getRoutes());
    this.app.use("/charging-stations", this.chargingStationsRoutes.getRoutes());


    try {
      console.log('Initializing database connection...');
      await this.connection.init(); 
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Failed to initialize database:', error);
      // process.exit(1);  // Exit if database connection fails
    }
  }
  async listenServer() {
    try {
      // Make sure database is initialized before starting server
      await this.init();  
      this.app.listen(this.port, (): void => {
        console.log(`Connected successfully on port ${this.port}`);
      });
    } catch (error: any) {
      console.error(`Error occurred: ${error.message}`);
      // process.exit(1);
    }
  }


 
}

Container.get(Server).listenServer();
