import type { NextFunction, Request, Response } from 'express';

import { APIResponse } from '~/helpers/response.helper';

const readHeader = ({ req, name }: { req: Request; name: string }): string | undefined => {
  const value = req.header(name);
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

const readQuery = ({ req, name }: { req: Request; name: string }): string | undefined => {
  const value = req.query[name];
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const apiResponse = new APIResponse({ req, res });

  const userId = readHeader({ req, name: 'x-user-id' });
  if (!userId) {
    return apiResponse.Unauthorized({ message: 'Missing authentication headers' });
  }

  const tenant = readQuery({ req, name: 'tenant' });
  if (!tenant) {
    return apiResponse.BadRequest({ message: "Missing required query parameter 'tenant'" });
  }

  req.userInfo = { userId, tenant };
  next();
};
