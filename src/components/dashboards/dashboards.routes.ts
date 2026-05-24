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
} from './dashboards.types';

export const dashboardsBasePath = '/dashboards';

export const dashboardsRouter = express.Router();

dashboardsRouter.get('/', getDashboardsController);
dashboardsRouter.get(
  '/:id',
  validator({ schema: getDashboardByIdSchema }),
  getDashboardByIdController
);
dashboardsRouter.post('/', validator({ schema: createDashboardSchema }), createDashboardController);
dashboardsRouter.delete(
  '/:id',
  validator({ schema: deleteDashboardSchema }),
  deleteDashboardController
);
