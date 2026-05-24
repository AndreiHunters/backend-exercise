import { randomUUID } from 'crypto';
import { readFileSync, renameSync, writeFileSync } from 'fs';
import { join } from 'path';

import { z } from 'zod';

import {
  chartSchema,
  dashboardSchema,
  type Chart,
  type Dashboard
} from '~/components/dashboards/dashboards.types';

const DEFAULT_DATA_FILE = join(__dirname, 'data.json');

const databaseSchema = z.object({
  dashboards: z.array(dashboardSchema),
  charts: z.array(chartSchema)
});

type Database = z.infer<typeof databaseSchema>;

export class Repository {
  private readonly _dataFile: string;

  constructor({ dataFile = DEFAULT_DATA_FILE }: { dataFile?: string } = {}) {
    this._dataFile = dataFile;
    // Fail fast at startup if the DB file is missing or malformed.
    this._read();
  }

  private _read = (): Database => {
    return databaseSchema.parse(JSON.parse(readFileSync(this._dataFile, 'utf-8')));
  };

  // Write-temp then rename so a crash mid-write can't leave a torn file.
  private _write = (data: Database): void => {
    const tmp = `${this._dataFile}.tmp`;
    writeFileSync(tmp, JSON.stringify(data, null, 2), 'utf-8');
    renameSync(tmp, this._dataFile);
  };

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
    return this._read()
      .dashboards.filter(dashboard => this._isVisible({ dashboard, tenant, userId }))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
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
    const dashboard = this._read().dashboards.find(d => d.id === id);
    if (!dashboard) return null;
    if (!this._isVisible({ dashboard, tenant, userId })) return null;
    return dashboard;
  };

  listChartsByDashboardId = ({ dashboardId }: { dashboardId: string }): Chart[] => {
    return this._read().charts.filter(chart => chart.dashboardId === dashboardId);
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
    const data = this._read();
    const dashboard: Dashboard = {
      id: randomUUID(),
      tenant,
      ownerId,
      title,
      isShared: isShared ?? false,
      lastRefreshedAt: null,
      createdAt: new Date().toISOString(),
      deletedAt: null
    };
    data.dashboards.push(dashboard);
    this._write(data);
    return dashboard;
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
    const data = this._read();
    const dashboard = data.dashboards.find(d => d.id === id);
    if (!dashboard) return false;
    if (dashboard.deletedAt !== null) return false;
    if (dashboard.tenant !== tenant) return false;
    if (dashboard.ownerId !== ownerId) return false;
    dashboard.deletedAt = new Date().toISOString();
    this._write(data);
    return true;
  };
}

export const repository = new Repository();
