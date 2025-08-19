import { Router } from "express";
import * as services from "./services/watchlist.services.js";
import verifyToken from "../../middlwares/auth.middlewares.js";
const router = Router();

router.post("/:id", verifyToken, services.aaddTowWtchlist);
router.get("/", verifyToken, services.getUserWatchlist);
router.delete("/:id", verifyToken, services.removeFromWatchlist);

export default router;
