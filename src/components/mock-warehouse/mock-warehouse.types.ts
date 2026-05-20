import { z } from 'zod';

export const executeBodySchema = z.object({
  body: z.object({
    sql: z.string().min(1),
    cacheKey: z.string().optional()
  }),
  query: z.object({
    fail: z
      .union([z.literal('true'), z.literal('false')])
      .optional()
      .transform(v => v === 'true'),
    delayMs: z
      .string()
      .optional()
      .transform(v => (v === undefined ? undefined : Math.max(0, Math.min(2000, Number(v) || 0))))
  })
});
export type ExecuteRequest = z.infer<typeof executeBodySchema>;

export const failSqlsBodySchema = z.object({
  body: z.object({
    sqlSubstrings: z.array(z.string().min(1)).min(1)
  })
});
export type FailSqlsRequest = z.infer<typeof failSqlsBodySchema>;

export interface ExecuteResponse {
  executedAt: string;
  cacheKey: string;
  rowCount: number;
  sqlPreview: string;
}
class FailureInjector {
  private readonly _substrings = new Set<string>();

  addAll = ({ items }: { items: string[] }): void => {
    for (const item of items) this._substrings.add(item);
  };

  reset = (): void => {
    this._substrings.clear();
  };

  shouldFail = ({ sql }: { sql: string }): boolean => {
    for (const sub of this._substrings) {
      if (sql.includes(sub)) return true;
    }
    return false;
  };

  list = (): string[] => Array.from(this._substrings);
}

export const failureInjector = new FailureInjector();
