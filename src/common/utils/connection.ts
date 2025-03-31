import { Sequelize } from "sequelize-typescript";
import { User } from "../entity/user/user.entity";
import { Service } from "typedi";
import { Example1 } from "../../domains/example/entity/example.entity";
import { Dialect } from "sequelize";
import * as fs from 'fs';
import * as path from 'path';
import { ChargingStation } from "../entity/user/stations.entity";


@Service()
export class Connection {
  connection: Sequelize;

  constructor() {
    // Move validation logic into the constructor
    this.validateEnvironmentConfig();
    
    const sslConfig = this.getSSLConfiguration();
    
    const config = {
      dialect: "postgres" as Dialect,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      models: [User, Example1,ChargingStation],
      dialectOptions: {
        ssl: sslConfig
      },
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
      retry: {
        max: 3
      }
    };
    
    this.connection = new Sequelize(config);
  }

  private validateEnvironmentConfig(): void {
    const requiredEnvVars = [
      'DB_HOST',
      'DB_PORT',
      'DB_USERNAME',
      'DB_PASSWORD',
      'DB_NAME'
    ];

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      console.warn(`Warning: Missing recommended environment variables: ${missingVars.join(', ')}`);
      console.warn('Using default values instead');
    }
  }

  private getSSLConfiguration(): any {
    // Force SSL configuration based on environment
    const useSSL = process.env.DB_SSL === 'true';;
    
    if (!useSSL) {
      return false;
    }

    const sslConfig: any = {
      // Always set to false for development to allow self-signed certificates
      rejectUnauthorized: process.env.NODE_ENV === 'production' 
        && process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false'
    };

    // Optional: Add CA certificate if provided
    if (process.env.DB_SSL_CA_PATH) {
      try {
        const caPath = path.resolve(process.env.DB_SSL_CA_PATH);
        
        // Check if file exists before reading
        if (fs.existsSync(caPath)) {
          sslConfig.ca = [fs.readFileSync(caPath)];
        } else {
          console.warn(`SSL CA file not found at: ${caPath}`);
        }
      } catch (error) {
        console.warn('Error reading SSL CA file:', error);
      }
    }

    console.log('SSL Configuration:', sslConfig);
    return sslConfig;
  }

  async init(): Promise<void> {
    try {
      // First test the connection
      await this.connection.authenticate();
      console.log('Database connection test successful');

      // Sync database schema
      await this.connection.sync();
      console.log('Database schema synchronized successfully');

    } catch (error: any) {
      // More detailed error handling
      let errorMessage = 'Database connection failed: ';
      
      if (error.original) {
        switch (error.original.code) {
          case 'ECONNREFUSED':
            errorMessage += 'Connection refused. Please check if PostgreSQL is running and the connection settings are correct.';
            break;
          case 'ENOTFOUND':
            errorMessage += 'Host not found. Please check your DB_HOST setting.';
            break;
          case '28P01':
            errorMessage += 'Invalid credentials. Please check your DB_USERNAME and DB_PASSWORD.';
            break;
          case '3D000':
            errorMessage += 'Database does not exist. Please check your DB_NAME setting.';
            break;
          default:
            errorMessage += error.message;
        }
      } else if (error.message.includes('self-signed certificate')) {
        // Specific handling for self-signed certificates
        errorMessage += 'Self-signed certificate detected. ';
        errorMessage += 'For development, set DB_SSL=true and DB_SSL_REJECT_UNAUTHORIZED=false';
      } else {
        errorMessage += error.message;
      }

      // Log the full error for debugging
      console.error('Full connection error:', error);

      throw new Error(errorMessage);
    }
  }

  async close(): Promise<void> {
    await this.connection.close();
  }
}
