import { Service } from "typedi";
import jwt from "jsonwebtoken";
import { User } from "../../../common/entity/user/user.entity";

@Service()
export class AuthToken {
  
  private readonly secretKey: string = "JWTsign" ;
  constructor() {}

  generateToken(id: number, role: string,email:string): string {
    const token = jwt.sign({ id, role ,email}, this.secretKey, {
      expiresIn: "1d",
    });
    return token;
  }

  validateToken(token: string): boolean {
    try {
      jwt.verify(token, this.secretKey);
      return true;
    } catch (error) {
      return false;
    }
  }
}
