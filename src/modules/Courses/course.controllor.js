import express from "express";
import * as services from "./services/course.services.js";
import verifyToken, {
  validationAdmin,
} from "../../middlwares/auth.middlewares.js";
import { cloudFileUpload } from "../../utiles/cloudinary.js";
import { validate } from "../../middlwares/validation.middleware.js";
import {
  courseSchema,
  delPhotoCourseSchema,
  updateCourseSchema,
} from "../../validators/course.validator.js";

const router = express.Router();

router.post(
  "/add",
  verifyToken,
  validationAdmin,
  validate(courseSchema),
  services.addcourse
);
router.post(
  "/:id/uploadPdf",
  verifyToken,
  validationAdmin,
  validate(delPhotoCourseSchema),
  cloudFileUpload.single("pdf"),
  services.uploadpdf
);
router.post(
  "/:id/video",
  verifyToken,
  validationAdmin,
  validate(delPhotoCourseSchema),
  cloudFileUpload.single("video"),
  services.uploadvideo
);
router.post(
  "/:id/addinstructor",
  verifyToken,
  validationAdmin,
  services.addinstructor
);
router.put(
  "/:id/update",
  verifyToken,
  validationAdmin,
  validate(updateCourseSchema),
  services.updatecourse
);
router.delete(
  "/:id/removeinstructor",
  verifyToken,
  validationAdmin,
  services.removeinstructor
);
router.delete(
  "/:id/delete",
  verifyToken,
  validationAdmin,
  validate(delPhotoCourseSchema),
  services.deleteCourse
);
router.get("/search{/:id}", verifyToken, services.courseData);
router.get("/:id/list", verifyToken, services.courses_category);
router.get(
  "/subscriber_number",
  verifyToken,
  validationAdmin,
  services.subscriber_number
);
router.get("/bestCourses", verifyToken, services.bestCourses);

export default router;
