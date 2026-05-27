import { logger } from '~/utils/logger';

/*
 * Simulates running a single SQL query against the external data warehouse.
 *
 * @param sql - The chart query to execute.
 * @param cacheKey - Identifier for this query run (used in logs and on failure).
 *
 * Resolves after a short simulated latency. The simulator is intentionally flaky:
 * calls may reject with an error, so callers should handle failures per chart.
 */
export const executeQuery = async ({
  sql,
  cacheKey
}: {
  sql: string;
  cacheKey: string;
}): Promise<void> => {
  logger.info({ tag: 'warehouse', message: 'execute', cacheKey, sql: sql.slice(0, 80) });
  await new Promise(resolve => setTimeout(resolve, 50));
  if (Math.random() < 0.1) {
    throw new Error(`Query execution failed: ${cacheKey}`);
  }
};
