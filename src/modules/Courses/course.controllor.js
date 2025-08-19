import express from "express";
import * as services from "./services/course.services.js";
import verifyToken, { validationAdmin } from "../../middlwares/auth.middlewares.js";
import { cloudFileUpload } from "../../utiles/cloudinary.js";
import { validate } from "../../middlwares/validation.middleware.js";
import {
  courseSchema,
  delPhotoCourseSchema,
  updateCourseSchema,
} from "../../validators/course.validator.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: Course management APIs
 */

/**
 * @swagger
 * /courses/add:
 *   post:
 *     summary: Add a new course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Course'
 *     responses:
 *       201:
 *         description: Course created successfully
 */
router.post("/add", verifyToken, validationAdmin, validate(courseSchema), services.addcourse);

/**
 * @swagger
 * /courses/{id}/Pdf:
 *   post:
 *     summary: Upload course PDF
 *     tags: [Courses]
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
 *               pdf:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: PDF uploaded successfully
 */
router.post("/:id/Pdf", verifyToken, validationAdmin, validate(delPhotoCourseSchema), cloudFileUpload.single("pdf"), services.uploadpdf);

/**
 * @swagger
 * /courses/{id}/video:
 *   post:
 *     summary: Upload course video
 *     tags: [Courses]
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
 *               video:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Video uploaded successfully
 */
router.post("/:id/video", verifyToken, validationAdmin, validate(delPhotoCourseSchema), cloudFileUpload.single("video"), services.uploadvideo);

/**
 * @swagger
 * /courses/{id}/addinstructor:
 *   post:
 *     summary: Assign an instructor to a course
 *     tags: [Courses]
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
 *         description: Instructor assigned successfully
 */
router.post("/:id/addinstructor", verifyToken, validationAdmin, services.addinstructor);

/**
 * @swagger
 * /courses/{id}/update:
 *   put:
 *     summary: Update course details
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CourseUpdate'
 *     responses:
 *       200:
 *         description: Course updated successfully
 */
router.put("/:id/update", verifyToken, validationAdmin, validate(updateCourseSchema), services.updatecourse);

/**
 * @swagger
 * /courses/{id}/removeinstructor:
 *   delete:
 *     summary: Remove an instructor from a course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Instructor removed successfully
 */
router.delete("/:id/removeinstructor", verifyToken, validationAdmin, services.removeinstructor);

/**
 * @swagger
 * /courses/{id}/delete:
 *   delete:
 *     summary: Delete a course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Course deleted successfully
 */
router.delete("/:id/delete", verifyToken, validationAdmin, validate(delPhotoCourseSchema), services.deleteCourse);

/**
 * @swagger
 * /courses/search/{id}:
 *   get:
 *     summary: Search course by ID
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course data retrieved successfully
 */
router.get("/search{/:id}", verifyToken, services.courseData);

/**
 * @swagger
 * /courses/category/{id}:
 *   get:
 *     summary: Get courses by category
 *     tags: [Courses]
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
 *         description: Courses retrieved successfully
 */
router.get("/category/:id", verifyToken, services.courses_category);

/**
 * @swagger
 * /courses/subscriber_number:
 *   get:
 *     summary: Get total number of subscribers
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Number of subscribers retrieved successfully
 */
router.get("/subscriber_number", verifyToken, validationAdmin, services.subscriber_number);

/**
 * @swagger
 * /courses/bestCourses:
 *   get:
 *     summary: Get best courses
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Best courses retrieved successfully
 */
router.get("/bestCourses", verifyToken, services.bestCourses);

export default router;
