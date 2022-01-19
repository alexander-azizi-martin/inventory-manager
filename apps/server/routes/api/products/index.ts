import type { FastifyPluginCallback as Plugin } from 'fastify';

import type { ProductRequest, ProductID } from '~/types';
import tagRouter from '~/routes/api/products/tags';
import vendorRouter from '~/routes/api/products/vendors';
import productTypeRouter from '~/routes/api/products/productTypes';
import { productSchema } from '~/schemas/product';
import { validateParamIds, validateBody } from '~/utils/middleware';
import { NotFoundError } from '~/utils/errors';

const CSV_HEADERS = [
  'title',
  'description',
  'status',
  'price',
  'cost',
  'vendor',
  'productType',
  'barcode',
  'stockKeepingUnit',
  'quantity',
  'tags',
];

const productRouter: Plugin = (app, opts, done) => {
  app.register(tagRouter).register(vendorRouter).register(productTypeRouter);

  app.get('/', {
    async handler(req, res) {
      const products = await app.prisma.products.findMany({
        include: { tags: true, vendor: true, productType: true },
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
        include: { tags: true, vendor: true, productType: true },
      });

      res.code(201).send(createdProduct);
    },
  });

  app.get('/export', {
    async handler(req, res) {
      const products = await app.prisma.products.findMany({
        include: { tags: true, vendor: true, productType: true },
      });

      const rows = products.map((product) => {
        const row = [];

        for (let header of CSV_HEADERS) {
          if (header == 'vendor') {
            row.push((product as any)[header].vendor);
          } else if (header == 'productType') {
            row.push((product as any)[header].productType);
          } else if (header == 'tags') {
            const tags = (product as any)[header].map(({ tag }: any) => tag);

            row.push(`"${tags.join(',')}"`);
          } else {
            row.push((product as any)[header]);
          }
        }

        return row;
      });

      let csvFile = `${CSV_HEADERS.join(',')}\n`;
      for (let row of rows) {
        csvFile += `${row.join(',')}\n`;
      }

      res
        .headers({
          'Content-Type': 'text/plain',
          'Content-Disposition': 'attachment; filename=products.csv',
        })
        .send(csvFile);
    },
  });

  app.get('/:productID', {
    preValidation: [validateParamIds],

    async handler(req, res) {
      const { productID } = req.params as ProductID;

      const product = await app.prisma.products.findUnique({
        where: { productID },
        include: { tags: true, vendor: true, productType: true },
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
        include: { tags: true, vendor: true, productType: true },
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
