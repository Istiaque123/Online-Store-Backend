import * as Joi from 'joi';

export const RegisterSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(4).required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
    role: Joi.string().valid('admin', 'user').optional()
    }
);
