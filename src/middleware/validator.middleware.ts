import type { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

import { APIResponse } from '~/helpers/response.helper';

type RequestPart = 'body' | 'params' | 'query';
const REQUEST_PARTS: RequestPart[] = ['body', 'params', 'query'];

/**
 * Express middleware factory: validates `req.body`, `req.params`, and `req.query`
 * against the matching keys of the provided Zod schema. On success, the parsed
 * (and possibly coerced) values are written back onto `req` so handlers see typed data.
 * On failure, responds 400 with `{ error: 'Validation failed', details: [...] }`.
 */
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

      // Replace the request part with the parsed/coerced value.
      // We intentionally assign through a typed alias to avoid `any`.
      const writable = req as unknown as Record<RequestPart, unknown>;
      writable[part] = parsed.data;
    }
    return next();
  };
};
