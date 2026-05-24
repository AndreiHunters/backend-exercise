import { logger } from '~/utils/logger';

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
    throw new Error(`Warehouse query failed: ${cacheKey}`);
  }
};
