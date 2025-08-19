import * as services from "./services/Booking.services.js";
import { validate } from "../../middlwares/validation.middleware.js";
import verifyToken, { validationAdmin } from "../../middlwares/auth.middlewares.js";
import { Router } from "express";
import { bookingSchema, replyBookingSchema } from "../../validators/Booking.validator.js";
import { cloudFileUpload } from "../../utiles/cloudinary.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Booking
 *   description: Booking management APIs
 */

/**
 * @swagger
 * /booking/Book:
 *   post:
 *     summary: Create a new booking
 *     tags: [Booking]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Booking'
 *     responses:
 *       201:
 *         description: Booking created successfully
 */
router.post("/Book", verifyToken, validate(bookingSchema), services.setBooking);

/**
 * @swagger
 * /booking/{id}/photo:
 *   post:
 *     summary: Upload a photo for a booking
 *     tags: [Booking]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Photo uploaded successfully
 */
router.post("/:id/photo", verifyToken, cloudFileUpload.single("image"), services.photoBooking);

/**
 * @swagger
 * /booking/pending:
 *   get:
 *     summary: Get all pending bookings (Admin only)
 *     tags: [Booking]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of pending bookings
 */
router.get("/pending", verifyToken, validationAdmin, services.bookingsPending);

/**
 * @swagger
 * /booking/{id}/reply:
 *   post:
 *     summary: Reply to a booking request
 *     tags: [Booking]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookingReply'
 *     responses:
 *       200:
 *         description: Booking reply saved
 */
router.post("/:id/reply", verifyToken, validationAdmin, validate(replyBookingSchema), services.replyBookings);

/**
 * @swagger
 * /booking/usersBookings:
 *   get:
 *     summary: Get all bookings for the logged-in user
 *     tags: [Booking]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's bookings
 */
router.get("/usersBookings", verifyToken, services.userBookings);

/**
 * @swagger
 * /booking:
 *   get:
 *     summary: Get all bookings (Admin only)
 *     tags: [Booking]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all bookings
 */
router.get("/", verifyToken, validationAdmin, services.bookings);

export default router;
