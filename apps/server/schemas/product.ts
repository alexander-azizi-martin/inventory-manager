import Joi from 'joi';

export const productSchema = Joi.object({
  title: Joi.string().max(50).required(),
  description: Joi.string().allow(''),
  status: Joi.string().valid('ACTIVE', 'DRAFT', 'ARCHIVE'),
  price: Joi.number().min(0),
  cost: Joi.number().min(0),
  vendor: Joi.string().max(50).required(),
  productType: Joi.string().max(50).required(),
  barcode: Joi.string().allow(''),
  stockKeepingUnit: Joi.string().allow(''),
  quantity: Joi.number().integer(),
  tags: Joi.array().items(Joi.string().max(50)).required(),
});

export const tagSchema = Joi.object({
  tag: Joi.string().required().max(50),
});

export const vendorSchema = Joi.object({
  vendor: Joi.string().required().max(50),
});

export const productTypeSchema = Joi.object({
  productType: Joi.string().required().max(50),
});
