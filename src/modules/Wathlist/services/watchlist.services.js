import asyncHandler from "express-async-handler";
import watchlist from "../../../DB/models/courser_liked.model.js";

export const aaddTowWtchlist = asyncHandler(async (req, res) => {
  const studentId = req.user.id;
  const courseId = req.params.id;
  if (!studentId || !courseId) throw new Error(`Ids required`, { cause: 400 });
  await watchlist.create({ studentId, courseId });
  return res.status(201).json({ Message: `added to watchlist` });
});

export const removeFromWatchlist = asyncHandler(async (req, res) => {
  const studentId = req.user.id;
  const courseId = req.params.id;
  await watchlist.destroy({ where: { studentId, courseId } });
  res.status(200).json({ message: "Removed from watchlist" });
});

export const getUserWatchlist = asyncHandler(async (req, res) => {
  const studentId = req.user.id;
  const items = await watchlist.findAll({
    where: { studentId },
    include: ["course"],
  });
  res.status(200).json(items);
});
