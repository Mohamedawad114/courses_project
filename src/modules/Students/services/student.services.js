import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import user from "../../../DB/models/Students.model.js";
import Booking from "../../../DB/models/booking.model.js";
import encryption from "../../../utiles/encryption.js";
import {
  createAndSendOTP,
  createAndSendOTP_Password,
} from "../../../utiles/send-email.js";
import redis from "../../../utiles/redis.js";
import { v4 as uuidV4 } from "uuid";
import { OAuth2Client } from "google-auth-library";
import {
  deleteFile,
  deleteUSer_files,
  uploadfile,
} from "../../../utiles/cloudinary.js";

export const signup = asyncHandler(async (req, res) => {
  const {
    fullName,
    email,
    phone,
    role,
    password,
    college,
    previous_knowledge,
  } = req.body;
  if (!fullName || !email || !phone || !password || !college)
    throw new Error("This inputs required", { cause: 400 });
  const validated_email = await user.findOne({ where: { email } });
  if (validated_email)
    throw new Error("email is already existed", { cause: 409 });
  const salt = await bcrypt.genSalt(parseInt(process.env.SALT));
  const hashPassword = await bcrypt.hash(password, salt);
  const created = await user.create({
    fullName,
    email,
    phone: encryption(phone),
    role,
    password: hashPassword,
    college,
    previous_knowledge,
    otps: { confirmation: "" },
  });
  if (created) {
    await createAndSendOTP(created, email);
    return res.status(201).json({ message: `signup done` });
  }
});

export const confirmEmail = asyncHandler(async (req, res) => {
  const { email, OTP } = req.body;
  if (!OTP || !email) throw new Error("inputs required", { cause: 400 });
  const User = await user.findOne({ where: { email, isConfirmed: false } });
  if (!User)
    throw new Error("email is already confirmed or not found", { cause: 400 });
  const savedOTP = await redis.get(`otp_${email}`);
  if (!savedOTP) throw new Error("expire OTP", { cause: 400 });
  const isMatch = await bcrypt.compare(OTP, User.otps?.confirmation);
  if (!isMatch) throw new Error("Invalid OTP", { cause: 400 });
  User.otps = { confirmation: undefined };
  User.isConfirmed = true;
  await redis.del(`otp_${email}`);
  await User.save();
  return res.status(200).json({ message: `email confirmed` });
});

export const resendOTP = asyncHandler(async (req, res) => {
  const email = req.query.email;
  const User = await user.findOne({ where: { email } });
  if (!User) throw new Error("user not found", { cause: 404 });
  createAndSendOTP(User, User.email);
  return res.status(200).send(`OTP sent`);
});

async function verifyloginGoogle(idToken) {
  const client = new OAuth2Client();
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.CLIENTID,
  });
  return ticket.getPayload();
}
const generateTokens = async (res, userId) => {
  const jti = uuidV4();
  await redis.set(jti, userId.toString(), "EX", 60 * 60 * 24 * 365);
  const accessToken = jwt.sign({ id: userId }, process.env.SECRET_KEY, {
    expiresIn: "30m",
  });
  const refreshToken = jwt.sign({ id: userId, jti }, process.env.SECRET_KEY, {
    expiresIn: "1y",
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 1000 * 60 * 60 * 24 * 365,
  });

  return accessToken;
};

export const signWithGoogle = asyncHandler(async (req, res) => {
  const { idToken } = req.body;
  const payload = await verifyloginGoogle(idToken);
  const { name, email, email_verified, picture } = payload;
  if (!email_verified) throw new Error("Email not verified", { cause: 400 });
  const User = await user.findOne({ where: { email } });
  if (User) {
    if (User.provider === "google") {
      const accessToken = await generateTokens(res, User.id);
      return res
        .status(200)
        .json({ message: "Login successfully", accessToken });
    }
    throw new Error(
      "Conflict: Email already registered with another provider",
      { cause: 409 }
    );
  }
  const createdUser = await user.create({
    fullName: name,
    password: null,
    email,
    college: null,
    previous_knowledge: null,
    phone: null,
    image: { public_id: "", url: picture },
    provider: "google",
  });

  const accessToken = await generateTokens(res, createdUser.id);
  return res.status(201).json({ accessToken });
});

export const loginuser = asyncHandler(async (req, res) => {
  const key = process.env.SECRET_KEY;
  const { password, email } = req.body;
  const valid_email = await user.findOne({ where: { email } });
  if (!valid_email) throw new Error("email not found", { cause: 404 });
  const passMatch = await bcrypt.compare(password, valid_email.password);
  if (!passMatch) throw new Error("invalid password", { cause: 400 });
  const jti = uuidV4();
  await redis.set(jti, valid_email.id.toString(), "EX", 60 * 60 * 24 * 365);
  const accessToken = jwt.sign(
    { id: valid_email.id, role: valid_email.role },
    key,
    { expiresIn: "30m" }
  );
  const refreshToken = jwt.sign(
    { id: valid_email.id, role: valid_email.role, jti },
    key,
    { expiresIn: "1y" }
  );

  res
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 365 * 1000,
    })
    .json({ message: `login seccussfully`, accessToken });
});

export const uploadphoto = asyncHandler(async (req, res) => {
  const file = req.file;
  const id = req.user.id;
  const User = await user.findByPk(id);
  if (!User) throw new Error("user not found", { cause: 404 });
  if (!file) throw new Error("image required", { cause: 400 });
  const { public_id, secure_url } = await uploadfile({
    file,
    path: `students/${id}`,
  });
  if (User.image?.public_id) await deleteFile(User.image.public_id);
  User.image = { public_id, url: secure_url };
  await User.save();
  return res.status(200).json({ message: `photo uploaded` });
});

export const refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) throw new Error("Unauthorized", { cause: 401 });
  jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
    if (err) throw new Error("Forbidden", { cause: 403 });
    const isexisted = await redis.get(decoded.jti);
    if (!isexisted) throw new Error("Forbidden", { cause: 403 });
    const accessToken = jwt.sign(
      { id: decoded.id, role: decoded.role },
      process.env.SECRET_KEY,
      { expiresIn: "30m" }
    );
    return res.json({ accessToken });
  });
});

export const profile = asyncHandler(async (req, res) => {
  const id = req.user.id;
  const userProfile = await user.findByPk(id, {
    attributes: { exclude: ["password"] },
  });
  if (!userProfile) throw new Error("User not found", { cause: 404 });
  if (userProfile.phone) userProfile.phone = decrypt(userProfile.phone);
  return res.status(200).json({ userProfile });
});

export const updateuser = asyncHandler(async (req, res) => {
  const id = req.user.id;
  const { fullName, email, phone, previous_knowledge } = req.body;
  const User = await user.findByPk(id);
  if (!User) throw new Error("user not found", { cause: 404 });
  if (fullName) User.fullName = fullName;
  if (email) {
    if (await user.findOne({ where: { email } }))
      throw new Error("email is already existed", { cause: 409 });
    User.email = email;
  }
  if (previous_knowledge) User.previous_knowledge = previous_knowledge;
  if (phone) User.phone = encryption(phone);
  await User.save();
  return res.status(200).json({ message: `profile updated` });
});

export const updatePassword = asyncHandler(async (req, res) => {
  const id = req.user.id;
  const User = await user.findByPk(id);
  if (!User) throw new Error("user not found", { cause: 404 });
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword)
    throw new Error("all input required", { cause: 400 });
  const isMatch = await bcrypt.compare(oldPassword, User.password);
  if (!isMatch) throw new Error("Invalid old Password", { cause: 400 });
  User.password = await bcrypt.hash(newPassword, parseInt(process.env.SALT));
  await User.save();
  return res.status(200).json({ message: `password updated` });
});

export const resetPasswordreq = asyncHandler(async (req, res) => {
  const User = await user.findByPk(req.user.id);
  if (!User) throw new Error("User not found", { cause: 404 });
  createAndSendOTP_Password(User, User.email);
  return res.status(200).json({ message: `OTP is sent` });
});

export const resetPasswordconfrim = asyncHandler(async (req, res) => {
  const User = await user.findByPk(req.user.id);
  const { OTP, newPassword } = req.body;
  if (!OTP || !newPassword)
    throw new Error("Both OTP and new passwords are required", { cause: 400 });
  const savedOTP = await redis.get(`otp_${User.email}`);
  if (!savedOTP) {
    createAndSendOTP_Password(User, User.email);
    throw new Error("expire OTP, A new OTP has been sent.", { cause: 400 });
  }

  const isMatch = await bcrypt.compare(OTP, User.otps?.reset);
  if (!isMatch) throw new Error("Invalid OTP", { cause: 400 });
  const salt = await bcrypt.genSalt(parseInt(process.env.SALT));
  User.password = await bcrypt.hash(newPassword, salt);
  User.otps = { reset: undefined };
  await redis.del(`otp_${User.email}`);
  await User.save();

  return res.status(200).json({ message: `password updated` });
});

export const logout = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.sendStatus(204);
  jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
    if (!err && decoded.jti) await redis.del(decoded.jti);
    res.clearCookie("refreshToken").sendStatus(204);
  });
});

export const gertuser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const name = req.query.name;
  if (name) {
    const Usersearch = await user.findAll({
      where: { fullName: name },
      order: ["createdAt", "DESC"],
      attributes: { exclude: ["password", "phone"] },
    });
    if (!Usersearch || !Usersearch.length)
      throw new Error("User not found", { cause: 404 });
    return res.status(200).json({ Usersearch });
  }
  const Usersearch = await user.findByPk(id, {
    attributes: { exclude: ["password", "phone"] },
  });
  if (!Usersearch) throw new Error("User not found", { cause: 404 });
  return res.status(200).json({ Usersearch });
});

export const list = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 8;
  const offset = (page - 1) * limit;
  const users = await user.findAll({
    limit,
    offset,
    attributes: { exclude: ["password", "phone"] },
    order: ["createdAt", "DESC"],
  });
  if (!users.length) return res.status(200).json({ message: `not users yet` });
  return res.status(200).json({ users });
});
