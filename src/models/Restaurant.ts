import { Model, DataTypes } from "sequelize";
import { sequelize } from "../instances/mysql";

export interface RestaurantInterface extends Model {
  id: string;
  name: string;
  document: string;
  type: string;
  address: string;
  city: string;
}

export const Restaurant = sequelize.define<RestaurantInterface>("Restaurant", {
  id:{
    primaryKey: true,
    type: DataTypes.STRING
  },
  name:{
    type: DataTypes.STRING
  },
  document:{
    type: DataTypes.STRING
  },
  type:{
    type: DataTypes.STRING
  },
  address:{
    type: DataTypes.STRING
  },
  city:{
    type: DataTypes.STRING
  },
}, {
  tableName: "restaurants",
  timestamps: false
})