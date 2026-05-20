import express, { type NextFunction, type Request, type Response } from 'express';

import {
  dashboardsBasePath,
  dashboardsRouter
} from '~/components/dashboards/dashboards.routes';
import {
  mockWarehouseBasePath,
  mockWarehouseRouter
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

export const app = express();
app.use(express.json({ limit: '1mb' }));
app.use(requestLogger);

app.use(mockWarehouseBasePath, mockWarehouseRouter);

app.use(dashboardsBasePath, authMiddleware, dashboardsRouter);

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
