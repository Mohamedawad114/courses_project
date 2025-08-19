import asyncHandler from "express-async-handler";
import course from "../../../DB/models/courses.model.js";
import category from "../../../DB/models/categories.model.js";
import instructor from "../../../DB/models/insructors.model.js";
import {
  uploadfile,
  deleteFile,
  deleteUSer_files,
  uploadVideo,
} from "../../../utiles/cloudinary.js";

export const addcourse = asyncHandler(async (req, res) => {
  const { name, description, period, roadmap, categoryId, price, type } =
    req.body;
  if (!name || !period || !roadmap || !categoryId || !price || !type)
    throw new Error(`All inputs required`, { cause: 400 });
  const Category = await category.findByPk(categoryId);
  if (!Category) throw new Error(`category not found`, { cause: 404 });
  const created = await course.create({
    name,
    description,
    period,
    roadmap,
    categoryId,
    price,
    type,
  });
  if (!created) throw new Error(`failed to create course`, { cause: 500 });
  Category.number_courses += 1;
  await Category.save();
  res.status(201).json({ Message: `course created` });
});

export const uploadpdf = asyncHandler(async (req, res) => {
  const courseId = req.params.id;
  const file = req.file;
  const Course = await course.findByPk(courseId);
  if (!Course) throw new Error(`Course not found`, { cause: 404 });
  if (!file) throw new Error(`pdf required`, { cause: 400 });

  const { public_id, secure_url } = await uploadfile({
    file,
    path: `courses/${courseId}`,
  });
  if (Course.content?.public_id) await deleteFile(Course.content.public_id);
  Course.content = { public_id, url: secure_url };
  await Course.save();
  res.status(200).json({ message: `pdf uploaded` });
});

export const uploadvideo = asyncHandler(async (req, res) => {
  const courseId = req.params.id;
  const file = req.file;
  const Course = await course.findByPk(courseId);
  if (!Course) throw new Error(`Course not found`, { cause: 404 });
  if (!file) throw new Error(`file required`, { cause: 400 });

  const { public_id, secure_url } = await uploadVideo({
    file,
    path: `courses/${courseId}`,
  });
  if (Course.video?.public_id) await deleteFile(Course.video.public_id);
  Course.video = { public_id, url: secure_url };
  await Course.save();
  res.status(200).json({ message: `video uploaded` });
});

export const addinstructor = asyncHandler(async (req, res) => {
  const courseId = req.params.id;
  const { instructorId } = req.body;
  const Course = await course.findByPk(courseId);
  if (!Course) throw new Error(`course not found`, { cause: 404 });
  const Instructor = await instructor.findByPk(instructorId);
  if (!Instructor) throw new Error(`instructor not found`, { cause: 404 });
  await Course.addInstructor(Instructor);
  res.status(200).json({ message: `Done` });
});

export const updatecourse = asyncHandler(async (req, res) => {
  const courseId = req.params.id;
  const { name, description, period, roadmap, categoryId, price, type } =
    req.body;
  const Course = await course.findByPk(courseId);
  if (!Course) throw new Error(`course not found`, { cause: 404 });

  if (categoryId) {
    const oldCategory = await category.findByPk(Course.categoryId);
    oldCategory.number_courses -= 1;
    await oldCategory.save();
    const Category = await category.findByPk(categoryId);
    if (!Category) throw new Error(`category not found`, { cause: 404 });
    Course.categoryId = categoryId;
    Category.number_courses += 1;
    await Category.save();
  }

  if (name) Course.name = name;
  if (price) Course.price = price;
  if (period) Course.period = period;
  if (roadmap) Course.roadmap = roadmap;
  if (description) Course.description = description;
  if (type) Course.type = type;
  await Course.save();
  res.status(201).json({ Message: `course updated` });
});

export const removeinstructor = asyncHandler(async (req, res) => {
  const courseId = req.params.id;
  const { instructorId } = req.body;
  const Course = await course.findByPk(courseId);
  if (!Course) throw new Error(`course not found`, { cause: 404 });
  const Instructor = await instructor.findByPk(instructorId);
  if (!Instructor) throw new Error(`instructor not found`, { cause: 404 });
  await Course.removeInstructor(Instructor);
  res.status(200).json({ message: `Done` });
});

export const deleteCourse = asyncHandler(async (req, res) => {
  const courseId = req.params.id;
  const Course = await course.findByPk(courseId);
  if (!Course) throw new Error(`course not found`, { cause: 404 });
  const Category = await category.findByPk(Course.categoryId);
  const deleted = await course.destroy({ where: { id: courseId } });
  if (!deleted) throw new Error(`failed to delete course`, { cause: 500 });
  Category.number_courses -= 1;
  await Category.save();
  await deleteUSer_files({ path: `courses/${courseId}` });
  res.status(200).json({ Message: `course deleted` });
});

export const courseData = asyncHandler(async (req, res) => {
  const search = {};
  const name = req.query.name;
  const courseId = req.params.id;
  if (name) search.name = name;
  if (courseId) search.id = courseId;
  const Course = await course.findOne({
    where: search,
    attributes: { exclude: ["subscriber_number"] },
    include: {
      model: instructor,
      attributes: ["fullName", "id"],
      through: { attributes: [] }
    },
  });
  res.status(200).json({ Course });
});

export const courses_category = asyncHandler(async (req, res) => {
  const categoryId = req.params.id;
  const Category = await category.findByPk(categoryId);
  if (!Category) throw new Error(`category not found`, { cause: 404 });
  const page = parseInt(req.query.page) || 1;
  const limit = 6;
  const offset = (page - 1) * limit;
  const courses = await course.findAll({
    where: { categoryId },
    offset,
    limit,
    attributes: { exclude: ["subscriber_number"] },
    order: [["createdAt", "DESC"]],
    include: {
      model: instructor,
      attributes: ["fullName", "id"],
       through: { attributes: [] }
    },
    paranoid: true,
  });
  res.status(200).json({ courses });
});

export const subscriber_number = asyncHandler(async (req, res) => {
  const courses = await course.findAll({
    attributes: ["name", "subscriber_number"],
    order: [["subscriber_number", "DESC"]],
  });
  res.status(200).json({ courses });
});

export const bestCourses = asyncHandler(async (req, res) => {
  const Courses = await course.findAll({
    limit: 5,
    order: [["subscriber_number", "DESC"]],
    attributes: { exclude: ["subscriber_number"] ,
     through: { attributes: [] }
    },
  });
  res.status(200).json({ Courses });
});
