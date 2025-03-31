import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './user.entity';

export enum StationStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

export enum ConnectorType {
  TYPE1 = 'type1',
  TYPE2 = 'type2',
  CCS = 'ccs',
  CHADEMO = 'chademo',
  TESLA = 'tesla'
}

@Table({
  tableName: 'charging_stations'
})
export class ChargingStation extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  name!: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: false
  })
  latitude!: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false
  })
  longitude!: number;

  @Column({
    type: DataType.ENUM(...Object.values(StationStatus)),
    allowNull: false,
    defaultValue: StationStatus.ACTIVE
  })
  status!: StationStatus;

  @Column({
    type: DataType.FLOAT,
    allowNull: false
  })
  powerOutput!: number;

  @Column({
    type: DataType.ENUM(...Object.values(ConnectorType)),
    allowNull: false
  })
  connectorType!: ConnectorType;

  @ForeignKey(() => User)
  @Column
  userId!: number;

  @BelongsTo(() => User)
  user!: User;
}