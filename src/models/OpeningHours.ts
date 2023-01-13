import { Model, DataTypes } from "sequelize";
import { sequelize } from "../instances/mysql";

export interface OpeningHoursInterface extends Model {
  id: string;
  id_restaurant: string;
  weekday: number;
  opening_time: string;
  closing_time: string;
}

export const OpeningHours = sequelize.define<OpeningHoursInterface>('OpeningHours', {
  id:{
    primaryKey: true,
    type: DataTypes.STRING
  },
  id_restaurant:{
    type: DataTypes.STRING
  },
  weekday:{
    type: DataTypes.INTEGER
  },
  opening_time:{
    type: DataTypes.STRING
  },
  closing_time:{
    type: DataTypes.STRING
  },
}, {
  tableName: "opening_hours",
  timestamps: false
})