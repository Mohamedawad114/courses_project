import asyncHandler from "express-async-handler";
import course from "../../../DB/models/courses.model.js";
import review from "../../../DB/models/reviews_course.model.js";
import user from "../../../DB/models/Students.model.js";

export const addReview = asyncHandler(async (req, res) => {
  const studentId = req.user.id;
  const courseId = req.params.id;
  const Course = await course.findByPk(courseId);
  if (!Course) throw new Error("course not found", { cause:404 });
  const { evalution, comment } = req.body;
  if (!evalution && !comment)
    throw new Error("At least one of evalution or comment is required", {
      cause: { status: 400 },
    });
  const created = await review.create({
    evalution,
    comment,
    studentId,
    courseId,
  });

  if (created) return res.status(201).json({ message: `review shared` });
});

export const updateReview = asyncHandler(async (req, res) => {
  const studentId = req.user.id;
  const reviewId = req.params.id;
  const Review = await review.findByPk(reviewId);
  if (!Review) throw new Error("Review not found", { cause: 404  });
  if (Review.studentId != studentId)
    throw new Error("you are not authorized", { cause: 401  });
  const { evalution, comment } = req.body;
  if (evalution) Review.evalution = evalution;
  if (comment) Review.comment = comment;
  await Review.save();
  return res.status(200).json({ message: `review updated` });
});

export const deleteReview = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const reviewId = req.params.id;
  const Review = await review.findByPk(reviewId);
  if (!Review)throw new Error("Review not found", { cause: 404 });;
  if (Review.studentId != userId && req.user.role != "Admin")
    throw new Error("you are not authorized", { cause: 401 });
  await Review.destroy();
  return res.status(200).json({ message: `review deleted` });
});

export const all_reviews = asyncHandler(async (req, res) => {
  const page = req.query.page || 1;
  const limit = 8;
  const offset = (page - 1) * limit;
  const Reviews = await review.findAll({
    offset,
    limit,
    attributes: ["id", "evalution", "comment", "createdAt"],
    order: [["evalution", "DESC"]],
    include: [
      { model: course, attributes: ["name", "description"] },
      { model: user, attributes: ["fullName"] },
    ],
  });
  return res.status(200).json({ Reviews });
});
export const course_reviews = asyncHandler(async (req, res) => {
  const page = req.query.page || 1;
  const id=req.params.id
  const limit = 8;
  const offset = (page - 1) * limit;
  const Reviews = await review.findAll({
    where:{courseId:id},
    offset,
    limit,
    attributes: ["id", "evalution", "comment", "createdAt"],
    order: [["evalution", "DESC"]],
    include: [
      { model: course, attributes: ["name", "description"] },
      { model: user, attributes: ["fullName"] },
    ],
  });
  return res.status(200).json({ Reviews });
});

export const list = asyncHandler(async (req, res) => {
  const page = req.query.page || 1;
  const limit = 8;
  const offset = (page - 1) * limit;
  const Reviews = await review.findAll({
    offset,
    limit,
    order: [["evalution", "DESC"]],
    include: [
      { model: course, attributes: ["name"] },
      { model: user, attributes: ["fullName", "id"] },
    ],
  });
  return res.status(200).json({ Reviews });
});
