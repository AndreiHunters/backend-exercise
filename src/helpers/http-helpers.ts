import type { Request } from 'express';
import type { z } from 'zod';

export interface UserInfo {
  userId: string;
  tenantId: string;
}

declare module 'express-serve-static-core' {
  interface Request {
    userInfo?: UserInfo;
  }
}

/**
 * After `validator({ schema })` has run, `req.body`, `req.params`, and `req.query`
 * have been replaced by the parsed Zod output. This helper type lets a handler
 * say `req: ValidatedRequest<typeof someSchema>` and get typed access to each part.
 */
export type ValidatedRequest<TSchema extends z.ZodTypeAny> = Request & z.infer<TSchema>;

/**
 * Like ValidatedRequest, but also asserts `req.userInfo` is present (after auth middleware).
 */
export type AuthenticatedRequest<TSchema extends z.ZodTypeAny> = ValidatedRequest<TSchema> & {
  userInfo: UserInfo;
};
