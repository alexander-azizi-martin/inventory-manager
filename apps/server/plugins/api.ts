import type { FastifyPluginCallback as Plugin } from 'fastify';

import products from '~/routes/api/products';
import { NotFoundError, ConflictError } from '~/utils/errors';

const apiPlugin: Plugin = async (app, opts, done) => {
  app.register(products, { prefix: 'products' });

  app.setErrorHandler((error, req, res) => {
    if (error.code === 'P2025') {
      res.send(new NotFoundError('Recourse does not exist.'));
    } else if (error.code === 'P2002') {
      res.send(new ConflictError('Recourse already exist.'));
    } else {
      throw error;
    }
  });

  done();
};

export default apiPlugin;

export const autoPrefix = '/api';
