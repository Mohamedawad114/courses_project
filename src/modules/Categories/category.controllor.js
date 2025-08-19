import exrpess from "express";
import * as services from "./services/category.services.js";
import verifyToken from "../../middlwares/auth.middlewares.js";
import { validationAdmin } from "../../middlwares/auth.middlewares.js";
import { cloudFileUpload } from "../../utiles/cloudinary.js";
const router = exrpess.Router();

router.post("/add", verifyToken, validationAdmin, services.addCategory);
router.post(
  "/photo/:id",
  verifyToken,
  validationAdmin,
  cloudFileUpload.single("image"),
  services.photoCategory
);
router.put(
  "/update/:id",
  verifyToken,
  validationAdmin,
  services.updateCategory
);
router.delete(
  "/delete/:id",
  verifyToken,
  validationAdmin,
  services.deleteCategory
);
router.get("/all", services.allCategories);
router.get("/list",verifyToken,validationAdmin ,services.list);
router.get("/search{/:id}", verifyToken, services.searchCategory);

export default router;
