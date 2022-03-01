import type { FastifyPluginCallback as Plugin } from 'fastify';
import jwt from 'jwt-simple';
import ms from 'ms';

import type { Session } from '~/types';
import userRouter from '~/routes/api/users';
import sessionRouter from '~/routes/api/sessions';
import productRouter from '~/routes/api/products';
import tagRouter from '~/routes/api/tags';
import vendorRouter from '~/routes/api/vendors';
import productTypeRouter from '~/routes/api/productTypes';
import filterRouter from '~/routes/api/filters';
import { NotFoundError, ConflictError } from '~/utils/errors';

declare module 'fastify' {
  interface FastifyInstance {
    generateSession: (userId: string) => Promise<Session>;
  }
}

const apiPlugin: Plugin = async (app, opts, done) => {
  app.decorate('generateSession', async (userID: string) => {
    const { refreshToken } = await app.prisma.sessions.create({
      data: { userID },
    });

    const accessToken = jwt.encode(
      {
        sub: userID,
        iat: Date.now(),
        exp: Date.now() + ms('5 minutes'),
      },
      process.env.SECRET as string,
    );

    return { refreshToken, accessToken };
  });

  app
    .register(userRouter, { prefix: 'users' })
    .register(sessionRouter, { prefix: 'sessions' })
    .register(productRouter, { prefix: 'products' })
    .register(tagRouter, { prefix: 'tags' })
    .register(vendorRouter, { prefix: 'vendors' })
    .register(productTypeRouter, { prefix: 'product-types' })
    .register(filterRouter, { prefix: 'filters' });

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
