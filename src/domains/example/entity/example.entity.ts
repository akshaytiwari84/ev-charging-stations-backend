// @/models.ts
import { Table, Model, Column, DataType } from "sequelize-typescript";

@Table({
  timestamps: false,
  tableName: "example1",
})
export class Example1 extends Model {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  })
  id!: number;
  
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  col1!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  col2!: string;
  
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  col3!: string;
}