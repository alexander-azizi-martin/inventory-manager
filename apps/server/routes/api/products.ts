import type { FastifyPluginCallback as Plugin } from 'fastify';

import type { ProductRequest, ProductID } from '~/types';
import { productSchema } from '~/schemas/product';
import {
  validateParamIds,
  validateBody,
  authenticate,
} from '~/utils/middleware';
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
  app.get('/', {
    preValidation: [authenticate],

    async handler(req, res) {
      const { sub: userID } = req.accessToken;

      const products = await app.prisma.products.findMany({
        where: { userID },
        include: { Tags: true, Vendor: true, ProductType: true },
      });

      res.send(products);
    },
  });

  app.post('/', {
    preValidation: [validateBody(productSchema), authenticate],

    async handler(req, res) {
      const { sub: userID } = req.accessToken;
      const {
        tags,
        vendor,
        productType,
        ...product
      } = req.body as ProductRequest;

      const createdProduct = await app.prisma.products.create({
        data: {
          ...product,
          Tags: {
            connectOrCreate: tags.map((tag) => ({
              create: { tag, userID },
              where: { userID_tag: { userID, tag } },
            })),
          },
          Vendor: {
            connectOrCreate: {
              create: { vendor, userID },
              where: { userID_vendor: { userID, vendor } },
            },
          },
          ProductType: {
            connectOrCreate: {
              create: { productType, userID },
              where: { userID_productType: { userID, productType } },
            },
          },
          User: {
            connect: { userID },
          },
        },
        include: { Tags: true, Vendor: true, ProductType: true },
      });

      res.code(201).send(createdProduct);
    },
  });

  app.get('/export', {
    preValidation: [authenticate],

    async handler(req, res) {
      const { sub: userID } = req.accessToken;

      const products = await app.prisma.products.findMany({
        where: { userID },
        include: { Tags: true, Vendor: true, ProductType: true },
      });

      const rows = products.map((product) => {
        const row = [];

        for (let i = 0; i < CSV_HEADERS.length; i += 1) {
          const header = CSV_HEADERS[i];

          if (header === 'vendor') {
            row.push(product.Vendor.vendor);
          } else if (header === 'productType') {
            row.push(product.ProductType.productType);
          } else if (header === 'tags') {
            const tags = product.Tags.map(({ tag }) => tag);

            row.push(`"${tags.join(',')}"`);
          } else {
            row.push((product as any)[header]);
          }
        }

        return row;
      });

      let csvFile = `${CSV_HEADERS.join(',')}\n`;
      for (let i = 0; i < rows.length; i += 1) {
        csvFile += `${rows[i].join(',')}\n`;
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
    preValidation: [validateParamIds, authenticate],

    async handler(req, res) {
      const { sub: userID } = req.accessToken;
      const { productID } = req.params as ProductID;

      const product = await app.prisma.products.findUnique({
        where: { productID },
        include: { Tags: true, Vendor: true, ProductType: true },
      });

      if (!product || product.userID !== userID) {
        res.send(new NotFoundError('Product does not exist.'));
        return;
      }

      res.send(product);
    },
  });

  app.put('/:productID', {
    preValidation: [
      validateParamIds,
      validateBody(productSchema),
      authenticate,
    ],

    async handler(req, res) {
      const { sub: userID } = req.accessToken;
      const { productID } = req.params as ProductID;
      const {
        tags,
        vendor,
        productType,
        ...newProduct
      } = req.body as ProductRequest;

      const product = await app.prisma.products.findUnique({
        where: { productID },
      });

      if (!product || product.userID !== userID) {
        res.send(new NotFoundError('Product does not exist.'));
        return;
      }

      const [, updatedProduct] = await app.prisma.$transaction([
        app.prisma.$queryRaw`
          DELETE FROM "_ProductTags" WHERE "A"=${productID};
        `,
        app.prisma.products.update({
          where: { productID },
          data: {
            ...newProduct,
            Tags: {
              connectOrCreate: tags.map((tag) => ({
                create: { tag, userID },
                where: { userID_tag: { userID, tag } },
              })),
            },
            Vendor: {
              connectOrCreate: {
                create: { vendor, userID },
                where: { userID_vendor: { userID, vendor } },
              },
            },
            ProductType: {
              connectOrCreate: {
                create: { productType, userID },
                where: { userID_productType: { userID, productType } },
              },
            },
            User: {
              connect: { userID },
            },
          },
          include: { Tags: true, Vendor: true, ProductType: true },
        }),
      ]);

      res.code(201).send(updatedProduct);
    },
  });

  app.delete('/:productID', {
    preValidation: [validateParamIds, authenticate],

    async handler(req, res) {
      const { sub: userID } = req.accessToken;
      const { productID } = req.params as ProductID;

      const product = await app.prisma.products.findUnique({
        where: { productID },
      });

      if (!product || product.userID !== userID) {
        res.send(new NotFoundError('Product does not exist.'));
        return;
      }

      await app.prisma.products.delete({ where: { productID } });

      res.code(204).send();
    },
  });

  done();
};

export default productRouter;
