import asyncHandler from "express-async-handler";
import instructor from "../../../DB/models/insructors.model.js";
import encryption from "../../../utiles/encryption.js";
import decrypt from "../../../utiles/decryption.js";
import {
  deleteUSer_files,
  uploadfile,
  deleteFile,
} from "../../../utiles/cloudinary.js";
import course from "../../../DB/models/courses.model.js";
import { Op } from "sequelize";

export const addinstructor = asyncHandler(async (req, res) => {
  const { fullName, email, phone, age, Bio } = req.body;
  if (!fullName || !email || !phone || !age || !Bio) {
    throw new Error(`All inputs required`, { cause: 400 });
  }
  const checkEmail = await instructor.findOne({ where: { email: email } });
  if (checkEmail) {
    throw new Error(`email is already exist`, { cause: 409 });
  }
  const created = await instructor.create({
    fullName,
    email,
    phone: encryption(phone),
    age,
    Bio,
  });
  if (!created) {
    throw new Error(`failed to add instructor`, { cause: 500 });
  }
  res.status(201).json({ message: `instructor added` });
});

export const updateinstructor = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const Instructor = await instructor.findByPk(id);
  if (!Instructor) {
    throw new Error(`instructor not found`, { cause: 404 });
  }

  const { fullName, email, phone, age, Bio } = req.body;
  if (email) {
    const checkEmail = await instructor.findOne({ where: { email: email } });
    if (checkEmail) {
      throw new Error(`email is already exist`, { cause: 409 });
    }
    Instructor.email = email;
  }
  if (Bio) Instructor.Bio = Bio;
  if (age) Instructor.age = age;
  if (fullName) Instructor.fullName = fullName;
  if (phone) Instructor.phone = encryption(phone);
  await Instructor.save();
  res.status(200).json({ message: `instructor updated` });
});

export const uploadphoto = asyncHandler(async (req, res) => {
  const file = req.file;
  const id = req.params.id;
  const Instructor = await instructor.findByPk(id);
  if (!Instructor) {
    throw new Error(`instructor not found`, { cause: 404 });
  }
  if (!file) {
    throw new Error(`image required`, { cause: 400 });
  }
  const { public_id, secure_url } = await uploadfile({
    file,
    path: `instructors/${id}`,
  });
  if (Instructor.Image?.public_id) {
    await deleteFile(Instructor.Image.public_id);
  }
  Instructor.Image = { public_id, url: secure_url };
  await Instructor.save();
  res.status(200).json({ message: `photo uploaded` });
});

export const deleteinstructor = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const Instructor = await instructor.findByPk(id);
  if (!Instructor) {
    throw new Error(`instructor not found`, { cause: 404 });
  }
  const deleted = await instructor.destroy({ where: { id } });
  if (!deleted) {
    throw new Error(`failed to delete instructor`, { cause: 500 });
  }
  await deleteUSer_files({ path: `instructors/${id}` });
  res.status(200).json({ message: `instructor deleted` });
});

export const getInstructor = asyncHandler(async (req, res) => {
  const name = req.query.name;
  if (!name) {
    throw new Error(`name is required`, { cause: 400 });
  }
  const Instructor = await instructor.findAll({
    where: {
      fullName: {
        [Op.iLike]: `%${name}%`,
      },
    },
  });
  res.status(200).json({ Instructor });
});

export const getInstructors = asyncHandler(async (req, res) => {
  const Instructors = await instructor.findAll({
    attributes: { exclude: ["phone"] },
    include: { model: course, as: "courses", attributes: ["name"] },
  });
  res.status(200).json({ Instructors });
});
export const list = asyncHandler(async (req, res) => {
  let Instructors = await instructor.findAll({});
  Instructors = Instructors.map((Ins) => ({
    ...Ins.toJSON(),
    phone: decrypt(Ins.phone),
  }));

  res.status(200).json({ Instructors });
});
