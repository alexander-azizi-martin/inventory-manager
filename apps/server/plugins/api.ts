import type { FastifyPluginCallback as Plugin } from 'fastify';

const apiPlugin: Plugin = async (app, opts, done) => {
  app.get('/', (req, res) => {
    res.send({
      api: 'Hello world.',
    });
  });

  done();
};

export default apiPlugin;

export const autoPrefix = '/api';
