import Joi from 'joi';

const stringFiftySchema = Joi.string().max(50).required();

export const productSchema = Joi.object({
  title: stringFiftySchema,

  description: Joi.string().allow(''),

  status: Joi.string().valid('ACTIVE', 'DRAFT', 'ARCHIVE'),

  price: Joi.number().min(0),

  cost: Joi.number().min(0),

  vendor: stringFiftySchema,

  productType: stringFiftySchema,

  barcode: Joi.string().allow(''),

  stockKeepingUnit: Joi.string().allow(''),

  quantity: Joi.number().integer(),

  tags: Joi.array().items(stringFiftySchema).required(),
});

export const tagSchema = Joi.object({
  tag: stringFiftySchema,
});

export const vendorSchema = Joi.object({
  vendor: stringFiftySchema,
});

export const productTypeSchema = Joi.object({
  productType: stringFiftySchema,
});
