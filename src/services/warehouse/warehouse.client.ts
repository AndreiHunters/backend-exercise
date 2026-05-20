import axios, { AxiosError } from 'axios';

import { config } from '~/config';

export interface WarehouseExecuteResult {
  executedAt: string;
  cacheKey: string;
  rowCount: number;
  sqlPreview: string;
}

export interface WarehouseClient {
  executeQuery: (args: { sql: string; cacheKey: string }) => Promise<WarehouseExecuteResult>;
}

export const createWarehouseClient = ({ baseUrl }: { baseUrl: string }): WarehouseClient => {
  const http = axios.create({ baseURL: baseUrl, timeout: 5000 });

  return {
    executeQuery: async ({ sql, cacheKey }) => {
      try {
        const response = await http.post<WarehouseExecuteResult>('/execute', { sql, cacheKey });
        return response.data;
      } catch (err) {
        if (err instanceof AxiosError) {
          const status = err.response?.status ?? 'no-response';
          const upstreamMessage =
            (err.response?.data as { error?: string } | undefined)?.error ?? err.message;
          throw new Error(`Warehouse call failed (status=${status}): ${upstreamMessage}`);
        }
        throw err;
      }
    }
  };
};

export const warehouseClient: WarehouseClient = createWarehouseClient({
  baseUrl: config.MOCK_WAREHOUSE_BASE_URL
});
