import * as Joi from 'joi';

export const CreateUserSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    user_id: Joi.string().uuid().required(),
    address: Joi.string().required(),
    place: Joi.string().required(),
    }
);