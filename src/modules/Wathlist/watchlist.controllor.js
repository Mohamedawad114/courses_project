import { Router } from "express";
import * as services from "./services/watchlist.services.js";
import verifyToken from "../../middlwares/auth.middlewares.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Watchlist
 *   description: Manage user's watchlist
 */

/**
 * @swagger
 * /watchlist/{id}:
 *   post:
 *     summary: Add an item to the watchlist
 *     tags: [Watchlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the item to add
 *     responses:
 *       201:
 *         description: Item added to watchlist
 *       401:
 *         description: Unauthorized
 */
router.post("/:id", verifyToken, services.aaddTowWtchlist);

/**
 * @swagger
 * /watchlist:
 *   get:
 *     summary: Get the user's watchlist
 *     tags: [Watchlist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of items in the watchlist
 *       401:
 *         description: Unauthorized
 */
router.get("/", verifyToken, services.getUserWatchlist);

/**
 * @swagger
 * /watchlist/{id}:
 *   delete:
 *     summary: Remove an item from the watchlist
 *     tags: [Watchlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the item to remove
 *     responses:
 *       200:
 *         description: Item removed from watchlist
 *       401:
 *         description: Unauthorized
 */
router.delete("/:id", verifyToken, services.removeFromWatchlist);

export default router;
