import type { FastifyPluginCallback as Plugin } from 'fastify';

import type { ProductTypeID, ProductTypeRequest } from '~/types';
import { productTypeSchema } from '~/schemas/product';
import {
  validateParamIds,
  validateBody,
  authenticate,
} from '~/utils/middleware';
import { NotFoundError } from '~/utils/errors';

const productTypeRouter: Plugin = (app, opts, done) => {
  app.get('/product-types', {
    preValidation: [authenticate()],

    async handler(req, res) {
      const { sub: userID } = req.accessToken;

      const productTypes = await app.prisma.productTypes.findMany({
        where: { userID },
      });

      res.send(productTypes);
    },
  });

  app.get('/product-types/:productTypeID', {
    preValidation: [validateParamIds, authenticate()],

    async handler(req, res) {
      const { sub: userID } = req.accessToken;
      const { productTypeID } = req.params as ProductTypeID;

      const productType = await app.prisma.productTypes.findUnique({
        where: { productTypeID },
      });

      if (!productType || productType.userID !== userID) {
        res.send(new NotFoundError('Product type does not exist.'));
        return;
      }

      res.send(productType);
    },
  });

  app.post('/product-types', {
    preValidation: [validateBody(productTypeSchema), authenticate()],

    async handler(req, res) {
      const { sub: userID } = req.accessToken;
      const { productType } = req.body as ProductTypeRequest;

      const createdProductType = await app.prisma.productTypes.create({
        data: { productType, userID },
      });

      res.code(201).send(createdProductType);
    },
  });

  app.put('/product-types/:productTypeID', {
    preValidation: [
      validateParamIds,
      validateBody(productTypeSchema),
      authenticate(),
    ],

    async handler(req, res) {
      const { sub: userID } = req.accessToken;
      const { productTypeID } = req.params as ProductTypeID;
      const { productType: newProductType } = req.body as ProductTypeRequest;

      const productType = await app.prisma.productTypes.findUnique({
        where: { productTypeID },
      });

      if (!productType || productType.userID !== userID) {
        res.send(new NotFoundError('Product type does not exist.'));
        return;
      }

      const updatedProductType = await app.prisma.productTypes.update({
        where: { productTypeID },
        data: { productType: newProductType },
      });

      res.code(201).send(updatedProductType);
    },
  });

  app.delete('/product-types/:productTypeID', {
    preValidation: [validateParamIds, authenticate()],

    async handler(req, res) {
      const { sub: userID } = req.accessToken;
      const { productTypeID } = req.params as ProductTypeID;

      const productType = await app.prisma.productTypes.findUnique({
        where: { productTypeID },
      });

      if (!productType || productType.userID !== userID) {
        res.send(new NotFoundError('Product type does not exist.'));
        return;
      }

      await app.prisma.productTypes.delete({ where: { productTypeID } });

      res.code(204).send();
    },
  });

  done();
};

export default productTypeRouter;
