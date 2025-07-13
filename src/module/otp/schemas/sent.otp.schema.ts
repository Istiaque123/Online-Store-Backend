import * as Joi from 'joi';

export const SentOtpSchema = Joi.object({
    identifier: Joi.string().required(),
    type: Joi.string().valid('email', 'sms').required()
});