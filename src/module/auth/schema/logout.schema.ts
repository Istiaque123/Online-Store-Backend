import * as Joi from 'joi';

export const LogoutSchema = Joi.object({
    id: Joi.string().uuid().required()
});
