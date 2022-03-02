import type { FastifyPluginCallback as Plugin } from 'fastify';

import type { FilterID, FilterRequest } from '~/types';
import { filterSchema } from '~/schemas/filter';
import {
  authenticate,
  validateParamIds,
  validateBody,
} from '~/utils/middleware';
import { removeNull } from '~/utils/helpers';
import { NotFoundError } from '~/utils/errors';

const filterRouter: Plugin = (app, opts, done) => {
  app.get('/', {
    preValidation: [authenticate],

    async handler(req, res) {
      const { sub: userID } = req.accessToken;

      const filters = await app.prisma.filters.findMany({ where: { userID } });

      res.send(filters);
    },
  });

  app.post('/', {
    preValidation: [validateBody(filterSchema), authenticate],

    async handler(req, res) {
      const { sub: userID } = req.accessToken;
      const {
        title,
        status,
        tag,
        vendor,
        productType,
      } = req.body as FilterRequest;

      const createdFilter = await app.prisma.filters.create({
        data: {
          title,
          status,
          tag,
          vendor,
          productType,
          userID,
        },
      });

      res.send(createdFilter);
    },
  });

  app.get('/:filterID', {
    preValidation: [validateParamIds, authenticate],

    async handler(req, res) {
      const { sub: userID } = req.accessToken;
      const { filterID } = req.params as FilterID;

      const filter = await app.prisma.filters.findUnique({
        where: { filterID },
      });

      if (!filter || filter.userID !== userID) {
        res.send(new NotFoundError('Filter does not exist.'));
        return;
      }

      res.code(201).send(filter);
    },
  });

  app.get('/:filterID/products', {
    preValidation: [validateParamIds, authenticate],

    async handler(req, res) {
      const { sub: userID } = req.accessToken;
      const { filterID } = req.params as FilterID;

      const filter = removeNull(
        await app.prisma.filters.findUnique({
          where: { filterID },
        }),
      );

      if (!filter || filter.userID !== userID) {
        res.send(new NotFoundError('Filter does not exist.'));
        return;
      }

      const products = await app.prisma.products.findMany({
        where: {
          title: {
            contains: filter.title,
          },
          status: {
            equals: filter.status,
          },
          Vendor: {
            vendor: { equals: filter.vendor },
          },
          ProductType: {
            productType: { equals: filter.productType },
          },
          Tags: {
            some: { tag: { contains: filter.tag } },
          },
        },
        include: { Tags: true, Vendor: true, ProductType: true },
      });

      res.send(products);
    },
  });

  app.put('/:filterID', {
    preValidation: [validateParamIds, validateBody(filterSchema), authenticate],

    async handler(req, res) {
      const { sub: userID } = req.accessToken;
      const { filterID } = req.params as FilterID;

      const filter = await app.prisma.filters.findUnique({
        where: { filterID },
      });

      if (!filter || filter.userID !== userID) {
        res.send(new NotFoundError('Filter does not exist.'));
        return;
      }

      const updatedFilter = await app.prisma.filters.update({
        where: { filterID },
        data: req.body as FilterRequest,
      });

      res.code(201).send(updatedFilter);
    },
  });

  app.delete('/:filterID', {
    preValidation: [validateParamIds, authenticate],

    async handler(req, res) {
      const { sub: userID } = req.accessToken;
      const { filterID } = req.params as FilterID;

      const filter = await app.prisma.filters.findUnique({
        where: { filterID },
      });

      if (!filter || filter.userID !== userID) {
        res.send(new NotFoundError('Filter does not exist.'));
        return;
      }

      await app.prisma.filters.delete({
        where: { filterID },
      });

      res.code(201).send();
    },
  });

  app.post('/query/products', {
    preValidation: [validateBody(filterSchema), authenticate],

    async handler(req, res) {
      const { sub: userID } = req.accessToken;
      const {
        title,
        status,
        tag,
        vendor,
        productType,
      } = req.body as FilterRequest;

      const products = await app.prisma.products.findMany({
        where: {
          title: {
            contains: title,
          },
          status: {
            equals: status,
          },
          Vendor: {
            vendor: { equals: vendor },
          },
          ProductType: {
            productType: { equals: productType },
          },
          Tags: {
            some: { tag: { contains: tag } },
          },
          userID,
        },
        include: { Tags: true, Vendor: true, ProductType: true },
      });

      res.send(products);
    },
  });

  done();
};

export default filterRouter;
