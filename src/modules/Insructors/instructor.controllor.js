import express from "express";
import * as services from "./services/instructor.services.js";
import verifyToken, { validationAdmin } from "../../middlwares/auth.middlewares.js";
import { validate } from "../../middlwares/validation.middleware.js";
import { cloudFileUpload } from "../../utiles/cloudinary.js";
import {
  delPhotoInstructorSchema,
  instructorSchema,
  updateInstructorSchema,
} from "../../validators/instructor.validator.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Instructors
 *   description: Instructors management
 */

/**
 * @swagger
 * /instructors/add:
 *   post:
 *     summary: Add new instructor
 *     tags: [Instructors]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Instructor'
 *     responses:
 *       201:
 *         description: Instructor created successfully
 */
router.post(
  "/add",
  verifyToken,
  validationAdmin,
  validate(instructorSchema),
  services.addinstructor
);

/**
 * @swagger
 * /instructors/{id}/photo:
 *   post:
 *     summary: Upload instructor photo
 *     tags: [Instructors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
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
router.post(
  "/:id/photo",
  verifyToken,
  validationAdmin,
  validate(delPhotoInstructorSchema),
  cloudFileUpload.single("image"),
  services.uploadphoto
);

/**
 * @swagger
 * /instructors/{id}/update:
 *   put:
 *     summary: Update instructor info
 *     tags: [Instructors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateInstructor'
 *     responses:
 *       200:
 *         description: Instructor updated successfully
 */
router.put(
  "/:id/update",
  verifyToken,
  validationAdmin,
  validate(updateInstructorSchema),
  services.updateinstructor
);

/**
 * @swagger
 * /instructors/{id}/delete:
 *   delete:
 *     summary: Delete instructor
 *     tags: [Instructors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Instructor deleted successfully
 */
router.delete(
  "/:id/delete",
  verifyToken,
  validationAdmin,
  validate(delPhotoInstructorSchema),
  services.deleteinstructor
);

/**
 * @swagger
 * /instructors/search:
 *   get:
 *     summary: Search instructors
 *     tags: [Instructors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of matched instructors
 */
router.get("/search", verifyToken, services.getInstructor);

/**
 * @swagger
 * /instructors/all:
 *   get:
 *     summary: Get all instructors
 *     tags: [Instructors]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of instructors
 */
router.get("/all", verifyToken, services.getInstructors);

/**
 * @swagger
 * /instructors:
 *   get:
 *     summary: Admin list instructors
 *     tags: [Instructors]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Full list of instructors (admin only)
 */
router.get("/", verifyToken, validationAdmin, services.list);

export default router;
