import Joi from 'joi'


export  const instructorSchema = {
    body:Joi.object({
    fullName: Joi.string().required().trim().min(8).messages({
      "string.base": "full name must be a string",
      "string.min": "full name should be at least 8 characters",
      "any.required": "full name is required",
    }),
    email: Joi.string().email(
        {tlds:{allow:["com","org","net"]}}
    ).required().trim().lowercase().messages({
      "string.email": "Invalid email format",
      "any.required": "Email is required",
    }),
    phone: Joi.string()
      .max(11)
      .regex(/^01[0125]\d{8}$/)
      .required()
      .messages({
        "any.required": "phone is required",
      }),
    age: Joi.number().required().min(23),
    Bio: Joi.string().required().min(25).max(255).trim(),
  })
}


export  const updateInstructorSchema = {
body:Joi.object({
    fullName: Joi.string().trim().min(8).messages({
      "string.base": "full name must be a string",
      "string.min": "full name should be at least 8 characters",
    }),
    email: Joi.string().email(
          {tlds:{allow:["com","org","net"]}}
    ).trim().lowercase().messages({
      "string.email": "Invalid email format",
    }),
    phone: Joi.string()
      .max(11)
      .regex(/^01[0125]\d{8}$/),
    Bio: Joi.string().min(25).trim(),
  }),
  params: Joi.object({
    id: Joi.number().min(1).required(),
})
}
export  const delPhotoInstructorSchema = {
  params: Joi.object({
    id: Joi.number().min(1).required(),
})
}
