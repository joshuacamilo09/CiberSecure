import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  PORT: Joi.number().default(3000),
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'production')
    .default('development'),

  DATABASE_URL: Joi.string().required(),

  GEMINI_API_KEY: Joi.string().required(),
  GEMINI_MODEL: Joi.string().default('gemini-2.5-flash'),

  UPLOAD_DIR: Joi.string().default('uploads'),
  MAX_FILE_SIZE_MB: Joi.number().default(10),

  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().default('7d'),
});
