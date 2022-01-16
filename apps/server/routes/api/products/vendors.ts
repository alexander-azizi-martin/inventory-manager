import type { FastifyPluginCallback as Plugin } from 'fastify';

import type { VendorID, VendorRequest } from '~/types';
import { vendorSchema } from '~/schemas/product';
import { validateParamIds, validateBody } from '~/utils/middleware';
import { NotFoundError } from '~/utils/errors';

const vendorRouter: Plugin = (app, opts, done) => {
  app.get('/vendors', {
    async handler(req, res) {
      const vendorTypes = await app.prisma.vendors.findMany();

      res.send(vendorTypes);
    },
  });

  app.get('/vendors/:vendorID', {
    preValidation: [validateParamIds],

    async handler(req, res) {
      const { vendorID } = req.params as VendorID;

      const vendor = await app.prisma.vendors.findUnique({
        where: { vendorID },
      });

      if (!vendor) {
        res.send(new NotFoundError('Vendor type does not exist.'));
      } else {
        res.send(vendor);
      }
    },
  });

  app.post('/vendors', {
    preValidation: [validateBody(vendorSchema)],

    async handler(req, res) {
      const { vendor } = req.body as VendorRequest;

      const createdVendor = await app.prisma.vendors.create({
        data: { vendor },
      });

      res.code(201).send(createdVendor);
    },
  });

  app.put('/vendors/:vendorID', {
    preValidation: [validateParamIds, validateBody(vendorSchema)],

    async handler(req, res) {
      const { vendorID } = req.params as VendorID;
      const { vendor } = req.body as VendorRequest;

      const updatedVendor = await app.prisma.vendors.update({
        where: { vendorID },
        data: { vendor },
      });

      res.code(201).send(updatedVendor);
    },
  });

  app.delete('/vendors/:vendorID', {
    preValidation: [validateParamIds],

    async handler(req, res) {
      const { vendorID } = req.params as VendorID;

      await app.prisma.vendors.delete({ where: { vendorID } });

      res.code(204).send();
    },
  });

  done();
};

export default vendorRouter;
