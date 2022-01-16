import Joi from 'joi';

export const productSchema = Joi.object({
  title: Joi.string().max(50).required(),
  description: Joi.string(),
  status: Joi.string().valid('ACTIVE', 'DRAFT', 'ARCHIVED'),
  price: Joi.number().positive(),
  cost: Joi.number().positive(),
  vendor: Joi.string().max(50).required(),
  productType: Joi.string().max(50).required(),
  barcode: Joi.string(),
  stockKeepingUnit: Joi.string(),
  quantity: Joi.number().integer(),
  tags: Joi.array().items(Joi.string()).required(),
});

export const tagSchema = Joi.object({
  tag: Joi.string().required(),
});
