import type { FastifyPluginCallback as Plugin } from 'fastify';

import type { VendorID, VendorRequest } from '~/types';
import { vendorSchema } from '~/schemas/product';
import {
  validateParamIds,
  validateBody,
  authenticate,
} from '~/utils/middleware';
import { NotFoundError } from '~/utils/errors';

const vendorRouter: Plugin = (app, opts, done) => {
  app.get('/', {
    preValidation: [authenticate()],

    async handler(req, res) {
      const { sub: userID } = req.accessToken;

      const vendorTypes = await app.prisma.vendors.findMany({
        where: { userID },
      });

      res.send(vendorTypes);
    },
  });

  app.get('/:vendorID', {
    preValidation: [validateParamIds, authenticate()],

    async handler(req, res) {
      const { sub: userID } = req.accessToken;
      const { vendorID } = req.params as VendorID;

      const vendor = await app.prisma.vendors.findUnique({
        where: { vendorID },
      });

      if (!vendor || vendor.userID !== userID) {
        res.send(new NotFoundError('Vendor does not exist.'));
        return;
      }

      res.send(vendor);
    },
  });

  app.post('/', {
    preValidation: [validateBody(vendorSchema), authenticate()],

    async handler(req, res) {
      const { sub: userID } = req.accessToken;
      const { vendor } = req.body as VendorRequest;

      const createdVendor = await app.prisma.vendors.create({
        data: { vendor, userID },
      });

      res.code(201).send(createdVendor);
    },
  });

  app.put('/:vendorID', {
    preValidation: [
      validateParamIds,
      validateBody(vendorSchema),
      authenticate(),
    ],

    async handler(req, res) {
      const { sub: userID } = req.accessToken;
      const { vendorID } = req.params as VendorID;
      const { vendor: newVendor } = req.body as VendorRequest;

      const vendor = await app.prisma.vendors.findUnique({
        where: { vendorID },
      });

      if (!vendor || vendor.userID !== userID) {
        res.send(new NotFoundError('Vendor does not exist.'));
        return;
      }

      const updatedVendor = await app.prisma.vendors.update({
        where: { vendorID },
        data: { vendor: newVendor },
      });

      res.code(201).send(updatedVendor);
    },
  });

  app.delete('/:vendorID', {
    preValidation: [validateParamIds, authenticate()],

    async handler(req, res) {
      const { sub: userID } = req.accessToken;
      const { vendorID } = req.params as VendorID;

      const vendor = await app.prisma.vendors.findUnique({
        where: { vendorID },
      });

      if (!vendor || vendor.userID !== userID) {
        res.send(new NotFoundError('Vendor does not exist.'));
        return;
      }

      await app.prisma.vendors.delete({ where: { vendorID } });

      res.code(204).send();
    },
  });

  done();
};

export default vendorRouter;
