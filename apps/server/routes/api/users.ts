import type { FastifyPluginCallback as Plugin } from 'fastify';
import bcrypt from 'bcrypt';

import type { Username, Credentials } from '~/types';
import {
  NotFoundError,
  ConflictError,
  AuthenticationError,
} from '~/utils/errors';
import { validateBody, authenticate } from '~/utils/middleware';
import { credentialSchema } from '~/schemas/session';

const SALT_ROUNDS = 10;

const userRouter: Plugin = (app, opts, done) => {
  app.post('/', {
    preValidation: [validateBody(credentialSchema)],

    async handler(req, rep) {
      const { username, password } = req.body as Credentials;

      try {
        const { userID } = await app.prisma.users.create({
          data: {
            username,
            password: await bcrypt.hash(password, SALT_ROUNDS),
          },
        });

        const session = await app.generateSession(userID);

        rep.send(session);
      } catch (error: any) {
        if (error.code === 'P2002') {
          rep.send(new ConflictError('That username is already taken'));
        } else {
          throw error;
        }
      }
    },
  });

  app.get('/:username', {
    async handler(req, rep) {
      const { username } = req.params as Username;

      const user = await app.prisma.users.findUnique({
        where: { username },
        select: { username: true, password: false },
      });

      if (!user) {
        rep.send(new NotFoundError('User not found'));
        return;
      }

      rep.send(user);
    },
  });

  app.get('/me', {
    preValidation: [authenticate],

    async handler(req, rep) {
      const { sub: userID } = req.accessToken;

      const user = await app.prisma.users.findUnique({
        where: { userID },
        select: { username: true, password: false },
      });

      if (!user) {
        rep.send(new NotFoundError('User not found'));
        return;
      }

      rep.send(user);
    },
  });

  app.delete('/:username', {
    preValidation: [authenticate],

    async handler(req, rep) {
      const { username } = req.params as Username;
      const { sub: userID } = req.accessToken;

      try {
        const user = await app.prisma.users.findUnique({ where: { userID } });

        if (!user) {
          rep.send(new NotFoundError('User not found'));
          return;
        }

        if (username !== user.username) {
          rep.send(new AuthenticationError('Unauthorized to delete this user'));
          return;
        }

        await app.prisma.users.delete({ where: { userID } });
      } finally {
        rep.code(204).send();
      }
    },
  });

  done();
};

export default userRouter;
