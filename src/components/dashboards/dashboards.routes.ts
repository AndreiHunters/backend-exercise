import express from 'express';

import { validator } from '~/middleware/validator.middleware';

import {
  createDashboardController,
  deleteDashboardController,
  getDashboardByIdController,
  getDashboardsController
} from './dashboards.controller';
import {
  createDashboardSchema,
  deleteDashboardSchema,
  getDashboardByIdSchema
} from './dashboards.validations';

export const BASE_PATH = '/dashboards';

export const Router = () => {
  const router = express.Router();

  router.get('/', getDashboardsController);

  router.get(
    '/:id',
    validator({ schema: getDashboardByIdSchema }),
    getDashboardByIdController
  );

  router.post('/', validator({ schema: createDashboardSchema }), createDashboardController);

  router.delete(
    '/:id',
    validator({ schema: deleteDashboardSchema }),
    deleteDashboardController
  );

  return router;
};
