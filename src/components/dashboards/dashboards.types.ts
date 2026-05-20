export interface Dashboard {
  id: string;
  tenantId: string;
  ownerId: string;
  title: string;
  isShared: boolean;
  lastRefreshedAt: Date | null;
  createdAt: Date;
  deletedAt: Date | null;
}

export interface Chart {
  id: string;
  dashboardId: string;
  title: string;
  sql: string;
}

export interface DashboardWithCharts extends Dashboard {
  charts: Chart[];
}
