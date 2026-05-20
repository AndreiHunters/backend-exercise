import type { NextFunction, Request, Response } from 'express';

import { APIResponse } from '~/helpers/response.helper';

const readHeader = ({ req, name }: { req: Request; name: string }): string | undefined => {
  const value = req.header(name);
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const userId = readHeader({ req, name: 'x-user-id' });
  const tenantId = readHeader({ req, name: 'x-tenant-id' });

  if (!userId || !tenantId) {
    const apiResponse = new APIResponse({ req, res });
    return apiResponse.Unauthorized({ message: 'Missing authentication headers' });
  }

  req.userInfo = { userId, tenantId };
  next();
};
