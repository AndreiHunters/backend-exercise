import type { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

import { APIResponse } from '~/helpers/response.helper';

type RequestPart = 'body' | 'params' | 'query';
const REQUEST_PARTS: RequestPart[] = ['body', 'params', 'query'];

export const validator = ({ schema }: { schema: z.ZodObject<z.ZodRawShape> }) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const shape = schema.shape;
    for (const part of REQUEST_PARTS) {
      const subSchema = shape[part];
      if (!subSchema) continue;

      const parsed = subSchema.safeParse(req[part]);
      if (!parsed.success) {
        const apiResponse = new APIResponse({ req, res });
        return apiResponse.BadRequest({
          message: 'Validation failed',
          details: parsed.error.issues
        });
      }
      
      const writable = req as unknown as Record<RequestPart, unknown>;
      writable[part] = parsed.data;
    }
    return next();
  };
};
