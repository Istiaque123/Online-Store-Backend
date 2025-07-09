import * as Joi from 'joi';

export const RefreshTokenSchema = Joi.object({
    refreshToken: Joi.string().required()
});