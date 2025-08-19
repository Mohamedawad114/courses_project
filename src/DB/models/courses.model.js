import { sequelize_config } from "../db.connection.js";
import { DataTypes } from "sequelize";
import category from "./categories.model.js";

const course = sequelize_config.define(
  "course",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      validate: {
        len: [4, 225],
      },
    },
    period: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    roadmap: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.JSONB,
      defaultValue: {
        url: null,
        public_id: null,
      },
    },
    video: {
      type: DataTypes.JSONB,
      defaultValue: {
        url: null,
        public_id: null,
      },
    },
    categoryId: {
      type: DataTypes.INTEGER,
      references: {
        model: category,
        key: "id",
      },
    },
    subscriber_number: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("online", "offline", "twice"),
      allowNull: false,
    },
  },
  {
    timestamps: true,
    paranoid: true,
  }
);
export default course;
