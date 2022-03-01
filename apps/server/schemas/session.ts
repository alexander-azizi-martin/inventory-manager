import Joi from 'joi';

export const usernameSchema = Joi
  .string()
  .label('Username')
  .pattern(/^[\w-]+$/)
  .message('Letters, numbers, dashes, and underscores only')
  .min(3)
  .message('Username must be between 3 and 20 characters')
  .max(20)
  .message('Username must be between 3 and 20 characters')
  .required();

export const credentialSchema = Joi.object({
  username: usernameSchema,
  password: Joi.string().required(),
});

export const refreshTokenSchema = Joi.object({
  refreshToken: Joi
    .string()
    .uuid({ version: 'uuidv4' })
    .message('Refresh token is malformed')
    .required(),
});
