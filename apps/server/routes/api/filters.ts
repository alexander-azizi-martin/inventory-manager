import type { FastifyPluginCallback as Plugin } from 'fastify';

import type { FilterID, FilterRequest } from '~/types';
import { filterSchema } from '~/schemas/filter';
import { validateParamIds, validateBody } from '~/utils/middleware';
import { removeNull } from '~/utils/helpers';
import { NotFoundError } from '~/utils/errors';

const filterRouter: Plugin = (app, opts, done) => {
  app.get('/', {
    async handler(req, res) {
      const filters = await app.prisma.filters.findMany({});

      res.send(filters);
    },
  });

  app.post('/', {
    preValidation: [validateBody(filterSchema)],

    async handler(req, res) {
      const createdFilter = await app.prisma.filters.create({
        data: req.body as FilterRequest,
      });

      res.send(createdFilter);
    },
  });

  app.get('/:filterID', {
    preValidation: [validateParamIds],

    async handler(req, res) {
      const { filterID } = req.params as FilterID;

      const filter = await app.prisma.filters.findUnique({
        where: { filterID },
      });

      if (!filter) {
        res.send(new NotFoundError('Filter does not exist.'));
      } else {
        res.code(201).send(filter);
      }
    },
  });

  app.get('/:filterID/products', {
    preValidation: [validateParamIds],

    async handler(req, res) {
      const { filterID } = req.params as FilterID;

      const filter = removeNull(
        await app.prisma.filters.findUnique({
          where: { filterID },
        }),
      );

      if (!filter) {
        res.send(new NotFoundError('Filter does not exist.'));
      } else {
        const products = await app.prisma.products.findMany({
          where: {
            title: { contains: filter.title },
            status: { equals: filter.status },
            vendor: { vendor: { equals: filter.vendor } },
            productType: {
              productType: { equals: filter.productType },
            },
            tags: { some: { tag: { contains: filter.tag } } },
          },
          include: { tags: true, vendor: true, productType: true },
        });

        res.send(products);
      }
    },
  });

  app.put('/:filterID', {
    preValidation: [validateParamIds, validateBody(filterSchema)],

    async handler(req, res) {
      const { filterID } = req.params as FilterID;

      const updatedFilter = await app.prisma.filters.update({
        where: { filterID },
        data: req.body as FilterRequest,
      });

      res.code(201).send(updatedFilter);
    },
  });

  app.delete('/:filterID', {
    preValidation: [validateParamIds],

    async handler(req, res) {
      const { filterID } = req.params as FilterID;

      await app.prisma.filters.delete({
        where: { filterID },
      });

      res.code(201).send();
    },
  });

  app.post('/query/products', {
    preValidation: [validateBody(filterSchema)],

    async handler(req, res) {
      const {
        title,
        status,
        tag,
        vendor,
        productType,
      } = req.body as FilterRequest;

      const products = await app.prisma.products.findMany({
        where: {
          title: { contains: title },
          status: { equals: status },
          vendor: { vendor: { equals: vendor } },
          productType: { productType: { equals: productType } },
          tags: { some: { tag: { contains: tag } } },
        },
        include: { tags: true, vendor: true, productType: true },
      });

      res.send(products);
    },
  });

  done();
};

export default filterRouter;
