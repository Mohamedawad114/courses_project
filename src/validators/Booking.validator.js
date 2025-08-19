import Joi from "joi";

export const bookingSchema = {
  body: Joi.object({
    courseId: Joi.number().required().min(1),
    instructorId: Joi.number().required().min(1),
    course_type: Joi.string().valid("online", "offline").required().trim(),
  }),
};
export const replyBookingSchema = {
  body: Joi.object({
    reply: Joi.string().valid("confirm", "cancel").required(),
  }),
  params: Joi.object({
    id: Joi.number().min(1).required(),
  }),
};
