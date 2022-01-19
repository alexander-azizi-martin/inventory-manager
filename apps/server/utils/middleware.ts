import type { preHandlerHookHandler as Middleware } from 'fastify';
import type { Schema } from 'joi';
import * as uuid from 'uuid';

import type { Params } from '~/types';
import { UserInputError } from '~/utils/errors';

export const validateParamIds: Middleware = (req, res, next) => {
  const validIDs = Object.entries(req.params as Params).every(([param, id]) => {
    if (param.endsWith('ID')) {
      return uuid.validate(id);
    }

    return true;
  });

  if (validIDs) {
    next();
  } else {
    res.send(new UserInputError('IDs provided is not valid.'));
  }
};

export const validateBody: (schema: Schema) => Middleware = (schema) => (
  req,
  res,
  next,
) => {
  const { value, error } = schema.validate(req.body, {
    allowUnknown: false,
    convert: true,
  });

  if (!error) {
    req.body = value;

    next();
  } else {
    res.send(new UserInputError(error.message));
  }
};
