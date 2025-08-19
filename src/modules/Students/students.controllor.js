import * as student_serv from "./services/student.services.js";
import { validate } from "../../middlwares/validation.middleware.js";
import express from "express";
import verifyToken, { validationAdmin } from "../../middlwares/auth.middlewares.js";
import { cloudFileUpload } from "../../utiles/cloudinary.js";
import {
  loginSchema,
  resetPasswordSchema,
  signupSchema,
  UpdatePasswordSchema,
  UpdateUserSchema,
} from "../../validators/user.validator.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Students
 *   description: Students management & authentication
 */

/**
 * @swagger
 * /students/signup:
 *   post:
 *     summary: Register a new student
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Signup'
 *     responses:
 *       201:
 *         description: Student created successfully
 */
router.post("/signup", validate(signupSchema), student_serv.signup);

/**
 * @swagger
 * /students/signupWithgmail:
 *   post:
 *     summary: Register or login with Google
 *     tags: [Students]
 *     responses:
 *       200:
 *         description: Success
 */
router.post("/signupWithgmail", student_serv.signWithGoogle);

/**
 * @swagger
 * /students/confirmEmail:
 *   post:
 *     summary: Confirm student email with OTP
 *     tags: [Students]
 *     responses:
 *       200:
 *         description: Email confirmed
 */
router.post("/confirmEmail", student_serv.confirmEmail);

/**
 * @swagger
 * /students/resendOTP:
 *   get:
 *     summary: Resend OTP code for email confirmation
 *     tags: [Students]
 *     responses:
 *       200:
 *         description: OTP resent
 */
router.get("/resendOTP", student_serv.resendOTP);

/**
 * @swagger
 * /students/login:
 *   post:
 *     summary: Login student
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post("/login", validate(loginSchema), student_serv.loginuser);

/**
 * @swagger
 * /students/photo:
 *   post:
 *     summary: Upload profile photo
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
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
router.post("/photo", verifyToken, cloudFileUpload.single("image"), student_serv.uploadphoto);

/**
 * @swagger
 * /students/refresh:
 *   get:
 *     summary: Refresh access token
 *     tags: [Students]
 *     responses:
 *       200:
 *         description: New token returned
 */
router.get("/refresh", student_serv.refreshToken);

/**
 * @swagger
 * /students/profile:
 *   get:
 *     summary: Get student profile
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Student profile data
 */
router.get("/profile", verifyToken, student_serv.profile);

/**
 * @swagger
 * /students/resetPasswordReq:
 *   get:
 *     summary: Request password reset
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OTP sent for password reset
 */
router.get("/resetPasswordReq", verifyToken, student_serv.resetPasswordreq);

/**
 * @swagger
 * /students/update:
 *   put:
 *     summary: Update student information
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUser'
 *     responses:
 *       200:
 *         description: Student updated successfully
 */
router.put("/update", verifyToken, validate(UpdateUserSchema), student_serv.updateuser);

/**
 * @swagger
 * /students/updatepassword:
 *   put:
 *     summary: Update student password
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePassword'
 *     responses:
 *       200:
 *         description: Password updated successfully
 */
router.put("/updatepassword", verifyToken, validate(UpdatePasswordSchema), student_serv.updatePassword);

/**
 * @swagger
 * /students/restPassword:
 *   put:
 *     summary: Confirm password reset
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPassword'
 *     responses:
 *       200:
 *         description: Password reset successfully
 */
router.put("/restPassword", verifyToken, validate(resetPasswordSchema), student_serv.resetPasswordconfrim);

/**
 * @swagger
 * /students/logout:
 *   delete:
 *     summary: Logout student
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.delete("/logout", verifyToken, student_serv.logout);

/**
 * @swagger
 * /students/search/{id}:
 *   get:
 *     summary: Search for a student (admin only)
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Student ID
 *     responses:
 *       200:
 *         description: Student found
 *       403:
 *         description: Forbidden
 */
router.get("/search/:id", verifyToken, validationAdmin, student_serv.gertuser);

/**
 * @swagger
 * /students:
 *   get:
 *     summary: Get list of all students (admin only)
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of students
 *       403:
 *         description: Forbidden
 */
router.get("/", verifyToken, validationAdmin, student_serv.list);

export default router;
