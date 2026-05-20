import type { Request, Response } from 'express';

import { APIResponse } from '~/helpers/response.helper';
import { logger } from '~/utils/logger';
import {
  type ExecuteRequest,
  type ExecuteResponse,
  type FailSqlsRequest,
  failureInjector
} from '~/components/mock-warehouse/mock-warehouse.types';

const sleep = ({ ms }: { ms: number }): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));

const hashRowCount = ({ sql }: { sql: string }): number => {
  let sum = 0;
  for (let i = 0; i < sql.length; i++) sum = (sum + sql.charCodeAt(i)) % 9973;
  return sum;
};

const previewOf = ({ sql }: { sql: string }): string => sql.slice(0, 80);

export const executeController = async (req: Request, res: Response) => {
  const apiResponse = new APIResponse({ req, res });
  const { body, query } = req as unknown as ExecuteRequest;
  const { sql, cacheKey } = body;
  const forceFail = query.fail === true;
  const delayMs = query.delayMs ?? 50;

  const sqlPreview = previewOf({ sql });
  logger.info({
    tag: 'mock-warehouse',
    message: 'execute',
    cacheKey: cacheKey ?? '-',
    sql: sqlPreview
  });

  if (delayMs > 0) await sleep({ ms: delayMs });

  if (forceFail || failureInjector.shouldFail({ sql })) {
    return apiResponse.InternalServerError({ message: 'simulated warehouse failure' });
  }

  const payload: ExecuteResponse = {
    executedAt: new Date().toISOString(),
    cacheKey: cacheKey ?? '-',
    rowCount: hashRowCount({ sql }),
    sqlPreview
  };
  return apiResponse.Success({ data: payload });
};

export const failSqlsController = (req: Request, res: Response) => {
  const apiResponse = new APIResponse({ req, res });
  const { body } = req as unknown as FailSqlsRequest;
  failureInjector.addAll({ items: body.sqlSubstrings });
  return apiResponse.Success({ data: { ok: true, failing: failureInjector.list() } });
};

export const resetController = (req: Request, res: Response) => {
  const apiResponse = new APIResponse({ req, res });
  failureInjector.reset();
  return apiResponse.Success({ data: { ok: true } });
};
