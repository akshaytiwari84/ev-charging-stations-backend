import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import bcrypt from 'bcrypt';
import { ChargingStation } from './stations.entity';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  SUPERADMIN = 'superadmin'
}

@Table({
  tableName: 'users'
})
export class User extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true
  })
  email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  password!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  name!: string;

  @Column({
    type: DataType.ENUM(...Object.values(UserRole)),
    allowNull: false,
    defaultValue: UserRole.USER
  })
  role!: UserRole;

  @HasMany(() => ChargingStation)
  chargingStations!: ChargingStation[];

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  isSuperAdmin(): boolean {
    return this.role === UserRole.SUPERADMIN;
  }

  isAdmin(): boolean {
    return this.role === UserRole.ADMIN || this.role === UserRole.SUPERADMIN;
  }
}