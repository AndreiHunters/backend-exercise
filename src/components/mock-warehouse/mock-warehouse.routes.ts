import express from 'express';

import { validator } from '~/middleware/validator.middleware';

import {
  executeController,
  failSqlsController,
  resetController
} from './mock-warehouse.controller';
import { executeBodySchema, failSqlsBodySchema } from './mock-warehouse.types';

export const mockWarehouseBasePath = '/mock-warehouse';

export const mockWarehouseRouter = express.Router();

mockWarehouseRouter.post('/execute', validator({ schema: executeBodySchema }), executeController);
mockWarehouseRouter.post(
  '/admin/fail-sqls',
  validator({ schema: failSqlsBodySchema }),
  failSqlsController
);
mockWarehouseRouter.post('/admin/reset', resetController);
