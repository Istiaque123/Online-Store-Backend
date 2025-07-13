import * as Joi from 'joi';

export const VerifyOtpSchema = Joi.object({
    identifier: Joi.string().required(),
    otp: Joi.string().required()
});