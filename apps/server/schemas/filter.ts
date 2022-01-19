import Joi from 'joi';

export const filterSchema = Joi.object({
  title: Joi.string().max(50),
  status: Joi.string().valid('ACTIVE', 'DRAFT', 'ARCHIVE'),
  productType: Joi.string().max(50),
  vendor: Joi.string().max(50),
  tag: Joi.string().max(50),
}).min(1);
