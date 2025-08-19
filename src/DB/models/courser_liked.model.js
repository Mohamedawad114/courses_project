import { sequelize_config } from "../db.connection.js";
import { DataTypes } from "sequelize";
import course from "./courses.model.js";
import user from "./Students.model.js";

const watchlist = sequelize_config.define(
  "watchlist",
  {
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: course,
        key: "id",
      },
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: user,
        key: "id",
      },
    },
  },
  {
    timestamps: true,
  }
);
export default watchlist;
