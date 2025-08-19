import { sequelize_config } from "../db.connection.js";
import { DataTypes } from "sequelize";
import course from "./courses.model.js";

const instructor=sequelize_config.define(
    "instructor",{
        fullName:{
            type:DataTypes.STRING,
            allowNull:false,
            validate:{
                len:[4,25]
            }
        },
        email:{
            type:DataTypes.STRING,
            allowNull:false,
            validate:{
                isEmail:true,
            }
        },
        phone:{
            type:DataTypes.STRING,
            allowNull:false
        },
        age:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        Bio:{
            type:DataTypes.TEXT,
            allowNull:false
        },
        Image:{
            type:DataTypes.JSONB,
            defaultValue:{
                url:null,
                public_id:null
            }
        },
    },
    {
        paranoid:true,
        timestamps:true,
        indexes:[{
            fields:["email"],
            name:"valid_email",
            unique:true,
        }]
    }
)
export default instructor