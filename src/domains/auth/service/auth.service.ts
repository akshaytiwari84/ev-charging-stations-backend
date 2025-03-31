import { User } from '../../../common/entity/user/user.entity';
import { AuthRepository } from '../repository/auth.repository';
import { Service } from "typedi";

@Service()
export class AuthService {
  constructor(public authRepository: AuthRepository) {}

  async register(params: Partial<User>): Promise<User> {
    return this.authRepository.register(params);
  }

  async updateUser(id: number, params: Partial<User>): Promise<boolean> {
    return this.authRepository.updateUser(id, params);
  }

  async getUserByFields(fields: Partial<User>): Promise<User | null> {
    return this.authRepository.getUserByFields(fields);
  }
}