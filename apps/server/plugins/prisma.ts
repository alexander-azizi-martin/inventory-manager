import type { FastifyPluginCallback as Plugin } from 'fastify';
import { PrismaClient } from '@prisma/client';

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

const prismaPlugin: Plugin = (app, opts, done) => {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

  app.addHook('onReady', async () => {
    await prisma.$connect();
  });

  app.addHook('onClose', async () => {
    await prisma.$disconnect();
  });

  app.decorate('prisma', prisma);

  done();
};

(prismaPlugin as any)[Symbol.for('skip-override')] = true;
export default prismaPlugin;
