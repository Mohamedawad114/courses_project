import * as student_serv from "./services/student.services.js";
import { validate } from "../../middlwares/validation.middleware.js";
import express from "express";
import verifyToken, {
  validationAdmin,
} from "../../middlwares/auth.middlewares.js";
import { cloudFileUpload } from "../../utiles/cloudinary.js";
import {
  loginSchema,
  resetPasswordSchema,
  signupSchema,
  UpdatePasswordSchema,
  UpdateUserSchema,
} from "../../validators/user.validator.js";
const router = express.Router();

router.post("/signup", validate(signupSchema), student_serv.signup);
router.post("/signupWithgmail", student_serv.signWithGoogle);
router.post("/confirmEmail", student_serv.confirmEmail);
router.get("/resendOTP", student_serv.resendOTP);
router.post("/login", validate(loginSchema), student_serv.loginuser);
router.post(
  "/photo",
  verifyToken,
  cloudFileUpload.single("image"),
  student_serv.uploadphoto
);
router.get("/refresh", student_serv.refreshToken);
router.get("/profile", verifyToken, student_serv.profile);
router.get("/resetPasswordReq", verifyToken, student_serv.resetPasswordreq);
router.put(
  "/update",
  verifyToken,
  validate(UpdateUserSchema),
  student_serv.updateuser
);
router.put(
  "/updatepassword",
  verifyToken,
  validate(UpdatePasswordSchema),
  student_serv.updatePassword
);
router.put(
  "/restPassword",
  verifyToken,
  validate(resetPasswordSchema),
  student_serv.resetPasswordconfrim
);
router.delete("/logout", verifyToken, student_serv.logout);

//admins
router.get(
  "/search{/:id}",
  verifyToken,
  validationAdmin,
  student_serv.gertuser
);
router.get("/", verifyToken, validationAdmin, student_serv.list);

export default router;
