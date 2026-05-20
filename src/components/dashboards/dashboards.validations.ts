import { z } from 'zod';

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
