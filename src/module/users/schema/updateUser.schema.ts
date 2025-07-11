import * as Joi from 'joi';

export const UpdateUserSchema = Joi.object({
    name: Joi.string().optional(),
    address: Joi.string().optional(),
    place: Joi.string().optional(),
});

