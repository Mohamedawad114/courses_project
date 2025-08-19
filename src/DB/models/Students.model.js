import { sequelize_config } from "../db.connection.js";
import { DataTypes } from "sequelize";
const user = sequelize_config.define(
  "student",
  {
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [4, 100],
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    role: {
      type: DataTypes.ENUM("user", "Admin"),
      defaultValue: "user",
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: { len: [6, 64] },
    },
    college: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    previous_knowledge: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    otps: {
      type: DataTypes.JSONB,
      defaultValue: {
        confirmation: undefined,
        reset: undefined,
      },
    },
    isConfirmed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    image: {
      type: DataTypes.JSONB,
      defaultValue: {
        public_id: null,
        url: null,
      },
    },
    provider: {
      type: DataTypes.ENUM("google", "system"),
      defaultValue: "system",
    },
    courses_booked:{
      type:DataTypes.ARRAY(DataTypes.INTEGER),
      defaultValue:[]
    }
  },
  {
    timestamps: true,
    indexes: [
      {
        name: "unique_email",
        unique: true,
        fields: ["email"],
      },
    ],
    validate: {
      checkSystemFields() {
        if (
          this.provider === "system" &&
          (!this.password || !this.phone || !this.college)
        ) {
          throw new Error("All input required");
        }
      },
    },
  }
);
user.beforeCreate((user) => {
  if (user.provider == "google") {
    user.isConfirmed = true;
  }
});
export default user;
