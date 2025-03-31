// authInDto.ts
import { UserRole } from "../../../common/entity/user/user.entity";

export interface LoginInDto {
  email: string;
  password: string;
}

export interface RegisterInDto {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

// authOutDto.ts
