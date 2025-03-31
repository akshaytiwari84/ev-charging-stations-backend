import { Service } from "typedi";
import { User } from "../../../common/entity/user/user.entity";
import { Op } from "sequelize";

@Service()
export class AuthRepository {
  constructor() {}

  async register(data: Partial<User>): Promise<User> {
    try {
      const user: User = await User.create({ ...data });
      return user;
    } catch (error) {
      throw error;
    }
  }

  async getUserByFields(fields: Partial<User>): Promise<User | null> {
    try {
      const user = await User.findOne({
        where: { ...fields },
      });
      return user;
    } catch (error) {
      throw error;
    }
  }

  async updateUser(id: number, data: Partial<User>): Promise<boolean> {
    try {
      await User.update({ ...data }, { where: { id } });
      return true;
    } catch (error) {
      throw error;
    }
  }
}