import express from 'express';

import { validator } from '~/middleware/validator.middleware';

import {
  executeController,
  failSqlsController,
  resetController
} from './mock-warehouse.controller';
import {
  executeBodySchema,
  failSqlsBodySchema
} from './mock-warehouse.types';

export const BASE_PATH = '/mock-warehouse';

export const Router = () => {
  const router = express.Router();

  router.post('/execute', validator({ schema: executeBodySchema }), executeController);
  router.post('/admin/fail-sqls', validator({ schema: failSqlsBodySchema }), failSqlsController);
  router.post('/admin/reset', resetController);

  return router;
};
