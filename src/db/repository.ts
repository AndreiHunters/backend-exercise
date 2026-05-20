import { randomUUID } from 'crypto';

import type { Chart, Dashboard } from '~/components/dashboards/dashboards.types';
import { mockData } from '~/db/data';

export class InMemoryRepository {
  private readonly _dashboards: Map<string, Dashboard>;
  private readonly _chartsByDashboard: Map<string, Chart[]>;

  constructor({ mockData }: { mockData: { dashboards: Dashboard[]; charts: Chart[] } }) {
    this._dashboards = new Map(
      mockData.dashboards.map(dashboard => [dashboard.id, { ...dashboard }])
    );
    this._chartsByDashboard = new Map();
    for (const chart of mockData.charts) {
      const chartsForDashboard = this._chartsByDashboard.get(chart.dashboardId) ?? [];
      chartsForDashboard.push({ ...chart });
      this._chartsByDashboard.set(chart.dashboardId, chartsForDashboard);
    }
  }

  private _isVisible = ({
    dashboard,
    tenant,
    userId
  }: {
    dashboard: Dashboard;
    tenant: string;
    userId: string;
  }): boolean => {
    if (dashboard.deletedAt !== null) return false;
    if (dashboard.tenant !== tenant) return false;
    if (dashboard.ownerId === userId) return true;
    return dashboard.isShared === true;
  };

  listDashboards = ({ tenant, userId }: { tenant: string; userId: string }): Dashboard[] => {
    const visibleDashboards: Dashboard[] = [];
    for (const dashboard of this._dashboards.values()) {
      if (this._isVisible({ dashboard, tenant, userId })) {
        visibleDashboards.push({ ...dashboard });
      }
    }
    visibleDashboards.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return visibleDashboards;
  };

  findDashboardById = ({
    tenant,
    userId,
    id
  }: {
    tenant: string;
    userId: string;
    id: string;
  }): Dashboard | null => {
    const dashboard = this._dashboards.get(id);
    if (!dashboard) return null;
    if (!this._isVisible({ dashboard, tenant, userId })) return null;
    return { ...dashboard };
  };

  findDashboardByIdRaw = ({ id }: { id: string }): Dashboard | null => {
    const dashboard = this._dashboards.get(id);
    return dashboard ? { ...dashboard } : null;
  };

  listChartsByDashboardId = ({ dashboardId }: { dashboardId: string }): Chart[] => {
    const charts = this._chartsByDashboard.get(dashboardId) ?? [];
    return charts.map(chart => ({ ...chart }));
  };

  createDashboard = ({
    tenant,
    ownerId,
    title,
    isShared
  }: {
    tenant: string;
    ownerId: string;
    title: string;
    isShared?: boolean;
  }): Dashboard => {
    const dashboard: Dashboard = {
      id: randomUUID(),
      tenant,
      ownerId,
      title,
      isShared: isShared ?? false,
      lastRefreshedAt: null,
      createdAt: new Date(),
      deletedAt: null
    };
    this._dashboards.set(dashboard.id, { ...dashboard });
    this._chartsByDashboard.set(dashboard.id, []);
    return { ...dashboard };
  };

  softDeleteDashboard = ({
    tenant,
    ownerId,
    id
  }: {
    tenant: string;
    ownerId: string;
    id: string;
  }): boolean => {
    const dashboard = this._dashboards.get(id);
    if (!dashboard) return false;
    if (dashboard.deletedAt !== null) return false;
    if (dashboard.tenant !== tenant) return false;
    if (dashboard.ownerId !== ownerId) return false;
    dashboard.deletedAt = new Date();
    return true;
  };

  updateLastRefreshedAtIfUnchanged = ({
    id,
    expectedPriorAt,
    now
  }: {
    id: string;
    expectedPriorAt: Date | null;
    now: Date;
  }): { updated: boolean; lastRefreshedAt: Date | null } => {
    const dashboard = this._dashboards.get(id);
    if (!dashboard) return { updated: false, lastRefreshedAt: null };

    const currentMs = dashboard.lastRefreshedAt?.getTime() ?? null;
    const expectedMs = expectedPriorAt?.getTime() ?? null;
    if (currentMs !== expectedMs) {
      return { updated: false, lastRefreshedAt: dashboard.lastRefreshedAt };
    }

    dashboard.lastRefreshedAt = now;
    return { updated: true, lastRefreshedAt: dashboard.lastRefreshedAt };
  };
}

export const repository = new InMemoryRepository({ mockData });
