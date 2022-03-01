import type { FastifyPluginCallback as Plugin } from 'fastify';
import bcrypt from 'bcrypt';

import type { Credentials, RefreshToken } from '~/types';
import { AuthenticationError } from '~/utils/errors';
import { validateBody } from '~/utils/middleware';
import { credentialSchema, refreshTokenSchema } from '~/schemas/session';

const sessionRouter: Plugin = (app, opts, done) => {
  app.post('/', {
    preValidation: [validateBody(credentialSchema)],

    async handler(req, rep) {
      const { username, password } = req.body as Credentials;

      const user = await app.prisma.users.findUnique({
        where: { username },
      });

      if (user && (await bcrypt.compare(password, user.password))) {
        const session = await app.generateSession(user.userID);

        rep.send(session);
        return;
      }

      rep.send(
        new AuthenticationError('Username and password do not match.'),
      );
    },
  });

  app.post('/refresh', {
    preValidation: [validateBody(refreshTokenSchema)],

    async handler(req, rep) {
      const { refreshToken } = req.body as RefreshToken;

      try {
        const session = await app.prisma.sessions.delete({
          where: { refreshToken },
        });

        const expired = session.expiration < new Date();
        if (expired) {
          rep.send(new AuthenticationError('Expired refresh token'));
          return;
        }

        const newSession = await app.generateSession(session.userID);

        rep.send(newSession);
      } catch (error: any) {
        if (error.code === 'P2002' || error.code === 'P2025') {
          rep.send(new AuthenticationError('Invalid refresh token'));
        } else {
          throw error;
        }
      }
    },
  });

  app.delete('/', {
    preValidation: [validateBody(refreshTokenSchema)],

    async handler(req, rep) {
      const { refreshToken } = req.body as RefreshToken;

      try {
        await app.prisma.sessions.delete({ where: { refreshToken } });
      } finally {
        rep.code(204).send();
      }
    },
  });

  done();
};

export default sessionRouter;
