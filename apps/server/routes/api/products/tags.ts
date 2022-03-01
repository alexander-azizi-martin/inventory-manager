import type { FastifyPluginCallback as Plugin } from 'fastify';

import type { ProductID, TagID, TagRequest } from '~/types';
import { tagSchema } from '~/schemas/product';
import {
  validateParamIds,
  validateBody,
  authenticate,
} from '~/utils/middleware';
import { NotFoundError } from '~/utils/errors';

const tagRouter: Plugin = (app, opts, done) => {
  app.get('/tags', {
    preValidation: [authenticate()],

    async handler(req, res) {
      const { sub: userID } = req.accessToken;

      const tags = await app.prisma.tags.findMany({ where: { userID } });

      res.send(tags);
    },
  });

  app.get('/:productID/tags', {
    preValidation: [validateParamIds, authenticate()],

    async handler(req, res) {
      const { sub: userID } = req.accessToken;
      const { productID } = req.params as ProductID;

      const product = await app.prisma.products.findUnique({
        where: { productID },
        include: {
          Tags: true,
        },
      });

      if (!product || product.userID !== userID) {
        res.send(res.send(new NotFoundError('Product does not exist.')));
        return;
      }

      res.send(product?.Tags || []);
    },
  });

  app.get('/tags/:tagID', {
    preValidation: [validateParamIds, authenticate()],

    async handler(req, res) {
      const { sub: userID } = req.accessToken;
      const { tagID } = req.params as TagID;

      const tag = await app.prisma.tags.findUnique({ where: { tagID } });

      if (!tag || tag.userID !== userID) {
        res.send(new NotFoundError('Tag does not exist.'));
        return;
      }

      res.send(tag);
    },
  });

  app.post('/tags', {
    preValidation: [validateBody(tagSchema), authenticate()],

    async handler(req, res) {
      const { sub: userID } = req.accessToken;
      const { tag } = req.body as TagRequest;

      const createdTag = await app.prisma.tags.create({
        data: { tag, userID },
      });

      res.send(createdTag);
    },
  });

  app.put('/tags/:tagID', {
    preValidation: [validateParamIds, validateBody(tagSchema), authenticate()],

    async handler(req, res) {
      const { sub: userID } = req.accessToken;
      const { tagID } = req.params as TagID;
      const { tag: newTag } = req.body as TagRequest;

      const tag = await app.prisma.tags.findUnique({
        where: { tagID },
      });

      if (!tag || tag.userID !== userID) {
        res.send(new NotFoundError('Tag does not exist.'));
        return;
      }

      const updatedTag = await app.prisma.tags.update({
        where: { tagID },
        data: { tag: newTag },
      });

      res.send(updatedTag);
    },
  });

  app.delete('/tags/:tagID', {
    preValidation: [validateParamIds, authenticate()],

    async handler(req, res) {
      const { sub: userID } = req.accessToken;
      const { tagID } = req.params as TagID;

      const tag = await app.prisma.tags.findUnique({
        where: { tagID },
      });

      if (!tag || tag.userID !== userID) {
        res.send(new NotFoundError('Tag does not exist.'));
        return;
      }

      await app.prisma.tags.delete({ where: { tagID } });

      res.code(204).send();
    },
  });

  done();
};

export default tagRouter;
