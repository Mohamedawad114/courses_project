import Joi from "joi";

export const courseSchema = {
  body: Joi.object({
    name: Joi.string().required().trim(),
    description: Joi.string().trim().min(4).max(255),
    period: Joi.string()
      .required()
      .regex(/^(\d+[YMDW])(,\s*\d+[YMDW])*$/)
      .messages({
        "string.pattern.base": "Period must be like '6M, 1Y, 20D'",
      }),
    type: Joi.string().valid("online", "offline", "twice").required(),
    price: Joi.number().required(),
    categoryId: Joi.number().required().min(1),
    roadmap: Joi.string().required().trim(),
  }),
};

export const updateCourseSchema = {
  body: Joi.object({
    name: Joi.string().trim(),
    description: Joi.string().trim().min(4),
    period: Joi.string()
      .regex(/^(\d+[YMDW])(,\s*\d+[YMDW])*$/)
      .messages({
        "string.pattern.base": "Period must be like '6M, 1Y, 20D'",
      }),
    type: Joi.string().valid("online", "offline", "twice"),
    price: Joi.number(),
    categoryId: Joi.number().min(1),
    roadmap: Joi.string().trim(),
  }),
  params: Joi.object({
    id: Joi.number().min(1).required(),
  }),
};

export const delPhotoCourseSchema = {
  params: Joi.object({
    id: Joi.number().min(1).required(),
  }),
};
