import { z } from 'zod';

// === Domain schemas + types ===

export const dashboardSchema = z.object({
  id: z.string().uuid(),
  tenant: z.string(),
  ownerId: z.string().uuid(),
  title: z.string(),
  isShared: z.boolean(),
  lastRefreshedAt: z.string().datetime().nullable(),
  createdAt: z.string().datetime(),
  deletedAt: z.string().datetime().nullable()
});

export type Dashboard = z.infer<typeof dashboardSchema>;

export const chartSchema = z.object({
  id: z.string().uuid(),
  dashboardId: z.string().uuid(),
  title: z.string(),
  sql: z.string()
});

export type Chart = z.infer<typeof chartSchema>;

export interface DashboardWithCharts extends Dashboard {
  charts: Chart[];
}

// === Request schemas + types ===

export const getDashboardByIdSchema = z.object({
  params: z.object({
    id: z.string().min(1)
  })
});
export type GetDashboardByIdRequest = z.infer<typeof getDashboardByIdSchema>;

export const createDashboardSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(120),
    isShared: z.boolean().optional()
  })
});
export type CreateDashboardRequest = z.infer<typeof createDashboardSchema>;

export const deleteDashboardSchema = z.object({
  params: z.object({
    id: z.string().min(1)
  })
});
export type DeleteDashboardRequest = z.infer<typeof deleteDashboardSchema>;

// === Response types ===

export type ListDashboardsResponse = { dashboards: Dashboard[] };
export type GetDashboardByIdResponse = DashboardWithCharts;
export type CreateDashboardResponse = Dashboard;
export type DeleteDashboardResponse = { ok: true };
