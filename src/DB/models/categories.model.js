import { sequelize_config } from "../db.connection.js";
import { DataTypes } from "sequelize";

const category = sequelize_config.define(
  "category",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [4, 50],
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    number_courses: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    image: {
      type: DataTypes.JSONB,
      defaultValue: {
        public_id: null,
        url: null,
      },
    },
  },
  {
    timestamps: true,
    paranoid: true,
  }
);
export default category;
