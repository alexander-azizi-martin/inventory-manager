import type { preHandlerHookHandler as Middleware } from 'fastify';
import type { Schema } from 'joi';
import * as uuid from 'uuid';
import jwt from 'jsonwebtoken';

import type { AccessToken, Params, AuthenticateOptions } from '~/types';
import { UserInputError, AuthenticationError } from '~/utils/errors';

declare module 'fastify' {
  interface FastifyRequest {
    accessToken: AccessToken;
  }
}

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
    res.send(new UserInputError('IDs provided are not valid.'));
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

export const authenticate: Middleware = (request, reply, next) => {
  const { authorization } = request.headers;
  request.accessToken = null as any;

  if (authorization) {
    const [schema, token] = authorization.split(' ');

    if (schema.toLowerCase() === 'bearer' && token) {
      try {
        const decodedToken = jwt.verify(token, process.env.SECRET as string, {
          ignoreExpiration: true,
        }) as AccessToken;

        if (Date.now() <= decodedToken.exp) {
          request.accessToken = decodedToken;
          next();
          return;
        } else {
          reply.send(new AuthenticationError('Access token is expired'));
          return;
        }
      } catch (error: any) {
        reply.send(new AuthenticationError('Access token is malformed'));
        return;
      }
    }
  }

  if (!request.accessToken) {
    reply.send(new AuthenticationError('Access token is missing'));
    return;
  }

  next();
};
