import Joi from 'joi'



  export const signupSchema ={
   body : Joi.object({
    fullName: Joi.string().required().trim().min(4).messages({
      "string.base": "full name must be a string",
      "string.min": "full name should be at least 4 characters",
      "any.required": "full name is required",
    }),
    email: Joi.string().email(
        {
            tlds:{allow:["com","org","net"]}
        }
    ).required().trim().lowercase().messages({
      "string.email": "Invalid email format",
      "any.required": "Email is required",
    }),
    password: Joi.string().min(6).required().pattern(/^(?=.[a-z])(?=.[A-Z])(?=.\d)(?=.[@$!%?.&-])[A-Za-z\d@$!%?.&-]{6,}$/).messages({
      "string.min": "Password should be at least 6 characters",
      "any.required": "Password is required",
    }),
    phone: Joi.string()
      .max(11)
      .regex(/^01[0125]\d{8}$/)
      .required()
      .messages({
        "any.required": "phone is required",
      }),
    role: Joi.string().valid("user", "Admin").default("user"),
    previous_knowledge: Joi.string().trim().default(""),
    college: Joi.string().trim().required(),
  })
}

export  const loginSchema = {
    body:Joi.object({
    email: Joi.string().required().email( {
            tlds:{allow:["com","org","net"]}
        }).trim().lowercase(),
    password: Joi.string().required().min(6).pattern(/^(?=.[a-z])(?=.[A-Z])(?=.\d)(?=.[@$!%?.&-])[A-Za-z\d@$!%?.&-]{6,}$/)
}),
}


 export const UpdateUserSchema ={
body:Joi.object({
    fullName: Joi.string().trim().min(6).messages({
      "string.base": "full name must be a string",
      "string.min": "full name should be at least 6 characters",
    }),
    email: Joi.string().email(  {
            tlds:{allow:["com","org","net"]}
        }).trim().lowercase().messages({
      "string.email": "Invalid email format",
    }),
    phone: Joi.string()
      .max(11)
      .regex(/^01[0125]\d{8}$/),
    previous_knowledge: Joi.string().trim(),
  })
}


export  const UpdatePasswordSchema ={
body:Joi.object({
oldPaswworrd:Joi.string().min(6).required().pattern(/^(?=.[a-z])(?=.[A-Z])(?=.\d)(?=.[@$!%?.&-])[A-Za-z\d@$!%?.&-]{6,}$/).required().messages({
    "string.min": "Password should be at least 6 characters",
    "any.required": "Password is required",
  }),
newPaswworrd:Joi.string().min(6).required().pattern(/^(?=.[a-z])(?=.[A-Z])(?=.\d)(?=.[@$!%?.&-])[A-Za-z\d@$!%?.&-]{6,}$/).required().messages({
    "string.min": "Password should be at least 6 characters",
    "any.required": "Password is required",
  })
})
}
export  const resetPasswordSchema ={
body:Joi.object({
OTP:Joi.string().alphanum().required().length(6),
newPaswworrd:Joi.string().min(6).required().pattern(/^(?=.[a-z])(?=.[A-Z])(?=.\d)(?=.[@$!%?.&-])[A-Za-z\d@$!%?.&-]{6,}$/).required().messages({
    "string.min": "Password should be at least 6 characters",
    "any.required": "Password is required",
  })
})
}