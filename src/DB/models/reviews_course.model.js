import { sequelize_config } from "../db.connection.js";
import { DataTypes } from "sequelize";
import user from "./Students.model.js";
import course from "./courses.model.js";

const review = sequelize_config.define(
  "review",
  {
    evalution: {
      type: DataTypes.INTEGER,
      validate: {
        max: 10,
        min: 0,
      },
    },
    comment: {
      type: DataTypes.TEXT,
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: user,
        key: "id",
      },
    },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: course,
        key: "id",
      },
    },
  },
  {
    timestamps: true,
  }
);
export default review;
