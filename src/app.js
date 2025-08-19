import express from "express";
import db_connection from "./DB/db.connection.js";
import "./DB/models/models.associations.js";
import user_controllor from "../src/modules/Students/students.controllor.js";
import category_controllor from "../src/modules/Categories/category.controllor.js";
import course_controllor from "../src/modules/Courses/course.controllor.js";
import review_controllor from "../src/modules/Reviews/review.controllor.js";
import instructor_controllor from "../src/modules/Insructors/instructor.controllor.js";
import bookings_controllor from "../src/modules/Booking/Booking.controllor.js";
import watchlist_controllor from "../src/modules/Wathlist/watchlist.controllor.js";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import hpp from "hpp";
import cron from "node-cron";
import env from "dotenv";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { deleteallBookingCancel } from "./utiles/cron-job.js";

const app = express();
app.use(helmet());
env.config();
app.use(hpp());
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  skipSuccessfulRequests: true,
  message: `Too many requests, please try after minute`,
});

app.use("/users/login", limiter);
app.use("/users/confirmEmail", limiter);
await db_connection();

app.use("/users", user_controllor);
app.use("/categories", category_controllor);
app.use("/courses", course_controllor);
app.use("/instructors", instructor_controllor);
app.use("/Bookings", bookings_controllor);
app.use("/reviews", review_controllor);
app.use("/watchlist", watchlist_controllor);

cron.schedule("0 0 1 1 * *", deleteallBookingCancel);
app.use(async (err, req, res, next) => {
  if (req.transaction && !req.transaction.finished) {
    return await req.transaction.rollback();
  }
  res
    .status(err.cause || 500)
    .json({ message: `something wrong`, err: err.message, stack: err.stack });
});

app.use((req, res) => {
  res.status(404).json({ message: `Page Not Found` });
});

export default app;
