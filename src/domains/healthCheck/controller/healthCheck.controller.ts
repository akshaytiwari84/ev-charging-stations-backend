import { Request, Response } from "express";
import { Service } from "typedi";

@Service() 
export class HealthCheckController {
    constructor() {}

    public healthCheck (req: Request, res: Response): Response {
        return res.status(200).json({ status: 200, data: {status: "active"}, message: "Server is running", timestamp: Date.now() });
    }
}