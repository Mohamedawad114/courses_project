
import express from "express";
import * as services from "./services/review.services.js";
import verifyToken, {
  validationAdmin,
} from "../../middlwares/auth.middlewares.js";

const router = express.Router();

/**
 * @swagger
 * /reviews/share/{id}:
 *   post:
 *     summary: Add a review to a course
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Course ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Review added successfully
 *       401:
 *         description: Unauthorized
 */
router.post("/share/:id", verifyToken, services.addReview);

/**
 * @swagger
 * /reviews/{id}/update:
 *   put:
 *     summary: Update a review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Review ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Review updated
 *       404:
 *         description: Review not found
 */
router.put("/:id/update", verifyToken, services.updateReview);

/**
 * @swagger
 * /reviews/{id}/delete:
 *   delete:
 *     summary: Delete a review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Review ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review deleted
 *       404:
 *         description: Review not found
 */
router.delete("/:id/delete", verifyToken, services.deleteReview);

/**
 * @swagger
 * /reviews/all:
 *   get:
 *     summary: Get all reviews (user only)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of reviews
 */
router.get("/all", verifyToken, services.all_reviews);

/**
 * @swagger
 * /reviews/{id}:
 *   get:
 *     summary: Get all reviews for a course
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Course ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course reviews
 *       404:
 *         description: Course not found
 */
router.get("/:id", verifyToken, services.course_reviews);

/**
 * @swagger
 * /reviews:
 *   get:
 *     summary: Get all reviews (admin only)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin list of reviews
 *       403:
 *         description: Forbidden
 */
router.get("/", verifyToken, validationAdmin, services.list);

export default router;
