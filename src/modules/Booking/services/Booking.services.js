import asyncHandler from "express-async-handler";
import Booking from "../../../DB/models/booking.model.js";
import course from "../../../DB/models/courses.model.js";
import user from "../../../DB/models/Students.model.js";
import instructor from "../../../DB/models/insructors.model.js";
import { bookingCancel, bookingDone } from "../../../utiles/send-email.js";
import { uploadfile } from "../../../utiles/cloudinary.js";

export const setBooking = asyncHandler(async (req, res) => {
  const { courseId, instructorId, course_type } = req.body;
  if (!courseId || !instructorId || !course_type)
    throw new Error("all input required", { cause: 400 });
  const created = await Booking.create({
    courseId,
    instructorId,
    course_type,
    studentId: req.user.id,
  });
  if (created) return res.status(201).json({ Message: `Booking in process` });
});
export const photoBooking = asyncHandler(async (req, res) => {
  const BookingId = req.params.id;
  const file = req.file;
  const booking = await Booking.findByPk(BookingId);
  if (!booking) throw new Error("booking not found", { cause: 404 });
  if (!file) throw new Error("image required", { cause: 400 });
  const { public_id, secure_url } = await uploadfile({
    file,
    path: `Bookings/${req.user.id}/${BookingId}`,
  });
  booking.pay_photo = { public_id: public_id, url: secure_url };
  await booking.save();
  return res.status(200).json({ message: `photo uploaded` });
});
//all booking ,
export const bookingsPending = asyncHandler(async (req, res) => {
  const bookings = await Booking.findAll({
    where: { process: "pending" },
    include: [
      { model: course, attributes: ["name"] },
      { model: user, attributes: ["fullName"] },
    ],
  });
  return res.status(200).json({ bookings });
});

export const replyBookings = asyncHandler(async (req, res) => {
  const bookingId = req.params.id;
  const { reply } = req.body;
  const booking = await Booking.findByPk(bookingId);
  if (!booking) throw new Error("booking not found", { cause: 404 });
  booking.process = reply;
  await booking.save();
  const Course = await course.findByPk(booking.courseId);
  const instructorName = await instructor.findByPk(booking.instructorId, {
    attributes: ["fullName"],
  });
  const student = await user.findByPk(booking.studentId);
  if (reply === "confirm") {
    bookingDone({
      fullName: student.fullName,
      course: Course.name,
      instructor: instructorName.fullName,
      email: student.email,
    });
    Course.subscriber_number += 1;
    await Course.save();
    student.courses_booked.push(bookingId);
    await student.save();
  }
  if (reply === "cancel") {
    bookingCancel({ email: student.email });
  }
  res.status(200).json({ message: `reply send ` });
});
export const bookings = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;
  const bookings = await Booking.findAll({
    where: { process: "confirm" },
    include: [
      { model: user, attributes: ["fullName"] },
      {
        model: course,
        attributes: ["name"],
      },
    ],
    limit: limit,
    offset: offset,
  });
  return res.status(200).json(bookings);
});
export const userBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.findAll({
    where: { process: "confirm", studentId: req.user.id },
    attributes: ["course_type"],
    include: [
      {
        model: course,
        attributes: ["name"],
      },
      {
        model: instructor,
        attributes: ["fullName"],
      },
    ],
  });
  return res.status(200).json(bookings);
});
