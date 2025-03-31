import { UserRole } from "../../../common/entity/user/user.entity";

export interface LoginOutDto {
  id: number;
  name: string;
  role: UserRole;
  token: string;
}