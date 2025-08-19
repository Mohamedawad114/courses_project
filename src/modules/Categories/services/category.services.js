import asyncHandler from "express-async-handler";
import category from "../../../DB/models/categories.model.js";
import { sequelize_config } from "../../../DB/db.connection.js";
import {
  deleteFile,
  deleteUSer_files,
  uploadfile,
} from "../../../utiles/cloudinary.js";
import course from "../../../DB/models/courses.model.js";

export const addCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  if (!name || !description)
    throw new Error("all input required", { cause: 400 });
  const created = await category.create({ name, description });
  if (created) return res.status(201).json({ Message: `category created` });
});

export const photoCategory = asyncHandler(async (req, res) => {
  const categoryId = req.params.id;
  const file = req.file;
  const Category = await category.findByPk(categoryId);
  if (!Category) throw new Error("category not found", { cause: 404 });
  if (!file) throw new Error("image required", { cause: 400 });
  const { public_id, secure_url } = await uploadfile({
    file,
    path: `categories/${categoryId}`,
  });
  if (Category.image?.public_id) {
    await deleteFile(Category.image.public_id);
  }
  Category.image = { public_id: public_id, url: secure_url };
  await Category.save();
  return res.status(200).json({ message: `photo uploaded` });
});

export const updateCategory = asyncHandler(async (req, res) => {
  const categoryId = req.params.id;
  const { name, description } = req.body;
  const Category = await category.findByPk(categoryId);
  if (!Category) throw new Error("category not found", { cause: 404 });
  if (name) Category.name = name;
  if (description) Category.description = description;
  await Category.save();
  return res.status(200).json({ Message: `category updated` });
});
export const deleteCategory = asyncHandler(async (req, res) => {
  const categoryId = req.params.id;
  const Category = await category.findByPk(categoryId);
  if (!Category) throw new Error("category not found", { cause: 404 });
  const transaction = await sequelize_config.transaction();
  req.transaction = transaction;
  const deleted = await category.destroy({ where: { id: categoryId } }, { transaction });
  await course.destroy({ where: { categoryId } }, { transaction });
  if (deleted) {
    await deleteUSer_files({ path: `categories/${categoryId}` });
    await transaction.commit();
    return res.status(200).json({ Message: `category deleted` });
  }
});

export const allCategories = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page);
  const limit = 6;
  const offset = (page - 1) * limit;
  const Categories = await category.findAll({
    offset: offset,
    limit: limit,
    order: [["createdAt", "DESC"]],
  });
  return res.status(200).json({ Categories });
});

export const list = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page);
  const limit = 6;
  const offset = (page - 1) * limit;
  const categories = await category.findAll({
    offset: offset,
    limit: limit,
    order: [["createdAt", "DESC"]],
    paranoid: false,
  });
  return res.status(200).json({ categories });
});

export const searchCategory = asyncHandler(async (req, res) => {
  const search = {};
  const name = req.query.name;
  const id = req.params.id;

  if (name) search.name = name;
  if (id) search.id = id;
  const Category = await category.findOne({ where: search });
  if (!Category) throw new Error("category not found", { cause: 404 });
  return res.status(200).json({ Category });
});
