import type { FastifyPluginCallback as Plugin } from 'fastify';

import type { ProductID, TagID, TagRequest } from '~/types';
import { tagSchema } from '~/schemas/product';
import { validateParamIds, validateBody } from '~/utils/middleware';
import { NotFoundError } from '~/utils/errors';

const tagRouter: Plugin = (app, opts, done) => {
  app.get('/tags', {
    async handler(req, res) {
      const tags = await app.prisma.tags.findMany();

      res.send(tags);
    },
  });

  app.get('/:productID/tags', {
    preValidation: [validateParamIds],

    async handler(req, res) {
      const { productID } = req.params as ProductID;

      const product = await app.prisma.products.findUnique({
        where: { productID },
        include: {
          tags: true,
        },
      });

      if (!product) {
        res.send(res.send(new NotFoundError('Product does not exist.')));
      } else {
        res.send(product?.tags || []);
      }
    },
  });

  app.get('/tags/:tagID', {
    preValidation: [validateParamIds],

    async handler(req, res) {
      const { tagID } = req.params as TagID;

      const tag = await app.prisma.tags.findUnique({ where: { tagID } });

      if (!tag) {
        res.send(new NotFoundError('Tag does not exist.'));
      } else {
        res.send(tag);
      }
    },
  });

  app.post('/tags', {
    preValidation: [validateBody(tagSchema)],

    async handler(req, res) {
      const { tag } = req.body as TagRequest;

      const createdTag = await app.prisma.tags.create({
        data: { tag },
      });

      res.send(createdTag);
    },
  });

  app.put('/tags/:tagID', {
    preValidation: [validateParamIds, validateBody(tagSchema)],

    async handler(req, res) {
      const { tagID } = req.params as TagID;
      const { tag } = req.body as TagRequest;

      const updatedTag = await app.prisma.tags.update({
        where: { tagID },
        data: { tag },
      });

      res.send(updatedTag);
    },
  });

  app.delete('/tags/:tagID', {
    preValidation: [validateParamIds],

    async handler(req, res) {
      const { tagID } = req.params as TagID;

      await app.prisma.tags.delete({ where: { tagID } });

      res.code(204).send();
    },
  });

  done();
};

export default tagRouter;
