import express from "express";
import * as services from "./services/review.services.js";
import verifyToken, {
  validationAdmin,
} from "../../middlwares/auth.middlewares.js";
const router = express.Router();

router.post("/share/:id", verifyToken, services.addReview);
router.put("/:id/update", verifyToken, services.updateReview);
router.delete("/:id/delete", verifyToken, services.deleteReview);
router.get("/all", verifyToken, services.all_reviews);
router.get("/:id", verifyToken, services.course_reviews);
router.get("/", verifyToken, validationAdmin, services.list);

export default router;
