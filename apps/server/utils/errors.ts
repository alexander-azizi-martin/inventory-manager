import { FastifyError } from 'fastify';

export class UserInputError extends Error implements FastifyError {
  code: any = undefined;

  statusCode = 400;
}

export class ForbiddenError extends Error implements FastifyError {
  code: any = undefined;

  statusCode = 403;
}

export class NotFoundError extends Error implements FastifyError {
  code: any = undefined;

  statusCode = 404;
}

export class ConflictError extends Error implements FastifyError {
  code: any = undefined;

  statusCode = 409;
}

export class ServerError extends Error implements FastifyError {
  code: any = undefined;

  statusCode = 500;
}
