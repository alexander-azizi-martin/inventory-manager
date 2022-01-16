import type { FastifyPluginCallback as Plugin } from 'fastify';

import type { ProductRequest, ProductID } from '~/types';
import tagRouter from '~/routes/api/products/tags';
import { productSchema } from '~/schemas/product';
import { validateParamIds, validateBody } from '~/utils/middleware';
import { NotFoundError } from '~/utils/errors';

const productRouter: Plugin = (app, opts, done) => {
  app.register(tagRouter);

  app.get('/', {
    async handler(req, res) {
      const products = await app.prisma.products.findMany({
        include: { tags: true },
      });

      res.send(products);
    },
  });

  app.post('/', {
    preValidation: [validateBody(productSchema)],

    async handler(req, res) {
      const {
        tags,
        vendor,
        productType,
        ...product
      } = req.body as ProductRequest;

      const createdProduct = await app.prisma.products.create({
        data: {
          ...product,
          tags: {
            connectOrCreate: tags.map((tag) => ({
              create: { tag },
              where: { tag },
            })),
          },
          vendor: {
            connectOrCreate: {
              create: { vendor },
              where: { vendor },
            },
          },
          productType: {
            connectOrCreate: {
              create: { productType },
              where: { productType },
            },
          },
        },
        include: { tags: true },
      });

      res.code(201).send(createdProduct);
    },
  });

  app.get('/:productID', {
    preValidation: [validateParamIds],

    async handler(req, res) {
      const { productID } = req.params as ProductID;

      const product = await app.prisma.products.findUnique({
        where: { productID },
        include: { tags: true },
      });

      if (!product) {
        res.send(new NotFoundError('Product does not exist.'));
      } else {
        res.send(product);
      }
    },
  });

  app.put('/:productID', {
    preValidation: [validateParamIds, validateBody(productSchema)],

    async handler(req, res) {
      const { productID } = req.params as ProductID;
      const {
        tags,
        vendor,
        productType,
        ...product
      } = req.body as ProductRequest;

      const updatedProduct = await app.prisma.products.update({
        where: { productID },
        data: {
          ...product,
          tags: {
            connectOrCreate: tags.map((tag) => ({
              create: { tag },
              where: { tag },
            })),
          },
          vendor: {
            connectOrCreate: {
              create: { vendor },
              where: { vendor },
            },
          },
          productType: {
            connectOrCreate: {
              create: { productType },
              where: { productType },
            },
          },
        },
        include: { tags: true },
      });

      res.code(201).send(updatedProduct);
    },
  });

  app.delete('/:productID', {
    preValidation: [validateParamIds],

    async handler(req, res) {
      const { productID } = req.params as ProductID;

      await app.prisma.products.delete({ where: { productID } });

      res.code(204).send();
    },
  });

  done();
};

export default productRouter;
