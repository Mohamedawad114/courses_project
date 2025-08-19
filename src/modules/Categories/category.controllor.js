import express from "express";
import * as services from "./services/category.services.js";
import verifyToken, { validationAdmin } from "../../middlwares/auth.middlewares.js";
import { cloudFileUpload } from "../../utiles/cloudinary.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category management APIs
 */

/**
 * @swagger
 * /category/add:
 *   post:
 *     summary: Add a new category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Category created successfully
 *       401:
 *         description: Unauthorized
 */
router.post("/add", verifyToken, validationAdmin, services.addCategory);

/**
 * @swagger
 * /category/photo/{id}:
 *   post:
 *     summary: Upload category photo
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Category ID
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
  "/photo/:id",
  verifyToken,
  validationAdmin,
  cloudFileUpload.single("image"),
  services.photoCategory
);

/**
 * @swagger
 * /category/update/{id}:
 *   put:
 *     summary: Update category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Category updated successfully
 */
router.put(
  "/update/:id",
  verifyToken,
  validationAdmin,
  services.updateCategory
);

/**
 * @swagger
 * /category/delete/{id}:
 *   delete:
 *     summary: Delete category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category deleted successfully
 */
router.delete(
  "/delete/:id",
  verifyToken,
  validationAdmin,
  services.deleteCategory
);

/**
 * @swagger
 * /category/all:
 *   get:
 *     summary: Get all categories (public)
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: List of categories
 */
router.get("/all", services.allCategories);

/**
 * @swagger
 * /category/list:
 *   get:
 *     summary: Get category list (Admin only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of categories (Admin view)
 */
router.get("/list", verifyToken, validationAdmin, services.list);

/**
 * @swagger
 * /category/search/{id}:
 *   get:
 *     summary: Search category by ID
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: false
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category details
 */
router.get("/search{/:id}", verifyToken, services.searchCategory);

export default router;
