import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";
import { Service } from "typedi";

type ValidationType = 'body' | 'params' | 'query';

@Service()
export class ValidateMiddleware {
  constructor() {}

  validate(schema: ObjectSchema, type: ValidationType = 'body') {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        let dataToValidate: any;
        
        switch (type) {
          case 'params':
            dataToValidate = req.params;
            break;
          case 'query':
            dataToValidate = req.query;
            break;
          case 'body':
          default:
            dataToValidate = req.body;
            break;
        }
        
        const { error } = schema.validate(dataToValidate);
        
        if (error) {
          return res.status(400).json({ error: error.details[0].message });
        }
        
        next();
      } catch (error: any) {
        return res
          .status(500)
          .json({ message: `Internal server error: ${error.message}` });
      }
    };
  }
}