import type { Chart, Dashboard } from '~/components/dashboards/dashboards.types';
import { seed } from '~/db/seed';

let nextDashboardCounter = 1;
const newId = (): string => {
  const n = nextDashboardCounter++;
  return `dash-new-${Date.now()}-${n}`;
};

export class InMemoryRepository {
  private readonly _dashboards: Map<string, Dashboard>;
  private readonly _chartsByDashboard: Map<string, Chart[]>;

  constructor({ seed: initial }: { seed: { dashboards: Dashboard[]; charts: Chart[] } }) {
    this._dashboards = new Map(initial.dashboards.map(d => [d.id, { ...d }]));
    this._chartsByDashboard = new Map();
    for (const chart of initial.charts) {
      const list = this._chartsByDashboard.get(chart.dashboardId) ?? [];
      list.push({ ...chart });
      this._chartsByDashboard.set(chart.dashboardId, list);
    }
  }

  private _isVisible = ({
    dashboard,
    tenantId,
    userId
  }: {
    dashboard: Dashboard;
    tenantId: string;
    userId: string;
  }): boolean => {
    if (dashboard.deletedAt !== null) return false;
    if (dashboard.tenantId !== tenantId) return false;
    if (dashboard.ownerId === userId) return true;
    return dashboard.isShared === true;
  };

  listDashboards = ({ tenantId, userId }: { tenantId: string; userId: string }): Dashboard[] => {
    const result: Dashboard[] = [];
    for (const d of this._dashboards.values()) {
      if (this._isVisible({ dashboard: d, tenantId, userId })) {
        result.push({ ...d });
      }
    }
    result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return result;
  };

  findDashboardById = ({
    tenantId,
    userId,
    id
  }: {
    tenantId: string;
    userId: string;
    id: string;
  }): Dashboard | null => {
    const d = this._dashboards.get(id);
    if (!d) return null;
    if (!this._isVisible({ dashboard: d, tenantId, userId })) return null;
    return { ...d };
  };

  findDashboardByIdRaw = ({ id }: { id: string }): Dashboard | null => {
    const d = this._dashboards.get(id);
    return d ? { ...d } : null;
  };

  listChartsByDashboardId = ({ dashboardId }: { dashboardId: string }): Chart[] => {
    const charts = this._chartsByDashboard.get(dashboardId) ?? [];
    return charts.map(c => ({ ...c }));
  };

  createDashboard = ({
    tenantId,
    ownerId,
    title,
    isShared
  }: {
    tenantId: string; 
    ownerId: string;
    title: string;
    isShared?: boolean;
  }): Dashboard => {
    const dashboard: Dashboard = {
      id: newId(),
      tenantId,
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
    tenantId,
    ownerId,
    id
  }: {
    tenantId: string;
    ownerId: string;
    id: string;
  }): boolean => {
    const d = this._dashboards.get(id);
    if (!d) return false;
    if (d.deletedAt !== null) return false;
    if (d.tenantId !== tenantId) return false;
    if (d.ownerId !== ownerId) return false;
    d.deletedAt = new Date();
    return true;
  };

  /**
   * Compare-and-swap on `lastRefreshedAt`. Updates only if the current value
   * equals `expectedPriorAt` (both Date instances must be equal by timestamp, or both null).
   * Returns the post-state.
   */
  updateLastRefreshedAtIfUnchanged = ({
    id,
    expectedPriorAt,
    now
  }: {
    id: string;
    expectedPriorAt: Date | null;
    now: Date;
  }): { updated: boolean; lastRefreshedAt: Date | null } => {
    const d = this._dashboards.get(id);
    if (!d) return { updated: false, lastRefreshedAt: null };

    const currentMs = d.lastRefreshedAt?.getTime() ?? null;
    const expectedMs = expectedPriorAt?.getTime() ?? null;
    if (currentMs !== expectedMs) {
      return { updated: false, lastRefreshedAt: d.lastRefreshedAt };
    }

    d.lastRefreshedAt = now;
    return { updated: true, lastRefreshedAt: d.lastRefreshedAt };
  };
}

export const repository = new InMemoryRepository({ seed });
