import * as services from "./services/Booking.services.js";
import { validate } from "../../middlwares/validation.middleware.js";
import verifyToken, {
  validationAdmin,
} from "../../middlwares/auth.middlewares.js";
import { Router } from "express";
import {
  bookingSchema,
  replyBookingSchema,
} from "../../validators/Booking.validator.js";
import { cloudFileUpload } from "../../utiles/cloudinary.js";
const router = Router();

router.post("/Book", verifyToken, validate(bookingSchema), services.setBooking);
router.post(
  "/:id/photo",
  verifyToken,
  cloudFileUpload.single("image"),
  services.photoBooking
);
router.get("/pending", verifyToken, validationAdmin, services.bookingsPending);
router.post(
  "/:id/reply",
  verifyToken,
  validationAdmin,
  validate(replyBookingSchema),
  services.replyBookings
);
router.get("/usersBookings", verifyToken, services.userBookings);
router.get("/", verifyToken, validationAdmin,services.bookings);

export default router;
