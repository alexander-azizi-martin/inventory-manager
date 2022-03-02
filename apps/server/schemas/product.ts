import Joi from 'joi';

const stringFiftySchema = Joi.string().max(50);

export const productSchema = Joi.object({
  title: stringFiftySchema.required(),

  description: Joi.string().allow(''),

  status: Joi.string().valid('ACTIVE', 'DRAFT', 'ARCHIVE'),

  price: Joi.number().min(0),

  cost: Joi.number().min(0),

  vendor: stringFiftySchema.required(),

  productType: stringFiftySchema.required(),

  barcode: Joi.string().allow(''),

  stockKeepingUnit: Joi.string().allow(''),

  quantity: Joi.number().integer(),

  tags: Joi.array().items(stringFiftySchema).required(),
});

export const tagSchema = Joi.object({
  tag: stringFiftySchema.required(),
});

export const vendorSchema = Joi.object({
  vendor: stringFiftySchema.required(),
});

export const productTypeSchema = Joi.object({
  productType: stringFiftySchema,
});
