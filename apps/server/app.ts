import fastify, { FastifyServerOptions } from 'fastify';
import autoLoad from 'fastify-autoload';
import fastifyCors from 'fastify-cors';
import { join } from 'path';

const createApp = (options: FastifyServerOptions) => {
  const app = fastify(options);

  app.register(fastifyCors);

  app.register(autoLoad as any, {
    dir: join(__dirname, 'plugins'),
  });

  return app;
};

export default createApp;
