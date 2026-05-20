import express, { type NextFunction, type Request, type Response } from 'express';

import { Router as DashboardsRouter, BASE_PATH as DASHBOARDS_BASE } from '~/components/dashboards/dashboards.routes';
import {
  Router as MockWarehouseRouter,
  BASE_PATH as MOCK_WAREHOUSE_BASE
} from '~/components/mock-warehouse/mock-warehouse.routes';
import { authMiddleware } from '~/middleware/auth.middleware';
import { logger } from '~/utils/logger';

const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    logger.info({
      tag: 'http',
      message: 'request',
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      durationMs: Date.now() - start
    });
  });
  next();
};

export const buildApp = () => {
  const app = express();
  app.use(express.json({ limit: '1mb' }));
  app.use(requestLogger);

  // The mock warehouse is unauthenticated for ease of demoing.
  app.use(MOCK_WAREHOUSE_BASE, MockWarehouseRouter());

  // Dashboards require auth headers.
  app.use(DASHBOARDS_BASE, authMiddleware, DashboardsRouter());

  app.use((req: Request, res: Response) => {
    res.status(404).json({ error: 'Not Found', path: req.originalUrl });
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {
    logger.error({
      tag: 'http',
      message: 'unhandled error',
      error: err instanceof Error ? err.message : String(err)
    });
    if (res.headersSent) return;
    res.status(500).json({ error: 'Internal Server Error' });
  });

  return app;
};

export const app = buildApp();
