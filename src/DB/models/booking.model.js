import { sequelize_config } from "../db.connection.js";
import { DataTypes } from "sequelize";
import user from "./Students.model.js";
import instructor from "./insructors.model.js";
import course from "./courses.model.js";

const Booking = sequelize_config.define(
  "Booking",
  {
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: user,
        key: "id",
      },
      onUpdate: "CASCADE",
    },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: course,
        key: "id",
      },
    },
    instructorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: instructor,
        key: "id",
      },
    },
    course_type: {
      type: DataTypes.ENUM("online", "offline"),
      allowNull: false,
    },
    pay_photo: {
      type: DataTypes.JSONB,
      defaultValue: {
        url: null,
        public_id: null,
      },
    },
    process: {
      type: DataTypes.ENUM("pending", "confirm", "cancel"),
      defaultValue: "pending",
    },
  },
  {
    paranoid: true,
    timestamps: true,
  }
);
export default Booking;
