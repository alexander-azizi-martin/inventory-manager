import type { FastifyPluginCallback as Plugin } from 'fastify';

import type { ProductTypeID, ProductTypeRequest } from '~/types';
import { productTypeSchema } from '~/schemas/product';
import { validateParamIds, validateBody } from '~/utils/middleware';
import { NotFoundError } from '~/utils/errors';

const productTypeRouter: Plugin = (app, opts, done) => {
  app.get('/product-types', {
    async handler(req, res) {
      const productTypes = await app.prisma.productTypes.findMany();

      res.send(productTypes);
    },
  });

  app.get('/product-types/:productTypeID', {
    preValidation: [validateParamIds],

    async handler(req, res) {
      const { productTypeID } = req.params as ProductTypeID;

      const productType = await app.prisma.productTypes.findUnique({
        where: { productTypeID },
      });

      if (!productType) {
        res.send(new NotFoundError('Product type does not exist.'));
      } else {
        res.send(productType);
      }
    },
  });

  app.post('/product-types', {
    preValidation: [validateBody(productTypeSchema)],

    async handler(req, res) {
      const { productType } = req.body as ProductTypeRequest;

      const createdProductType = await app.prisma.productTypes.create({
        data: { productType },
      });

      res.code(201).send(createdProductType);
    },
  });

  app.put('/product-types/:productTypeID', {
    preValidation: [validateParamIds, validateBody(productTypeSchema)],

    async handler(req, res) {
      const { productTypeID } = req.params as ProductTypeID;
      const { productType } = req.body as ProductTypeRequest;

      const updatedProductType = await app.prisma.productTypes.update({
        where: { productTypeID },
        data: { productType },
      });

      res.code(201).send(updatedProductType);
    },
  });

  app.delete('/product-types/:productTypeID', {
    preValidation: [validateParamIds],

    async handler(req, res) {
      const { productTypeID } = req.params as ProductTypeID;

      await app.prisma.productTypes.delete({ where: { productTypeID } });

      res.code(204).send();
    },
  });

  done();
};

export default productTypeRouter;
