import { NotFoundError } from '~/helpers/error.utils';
import type { UserInfo } from '~/helpers/http-helpers';
import type { InMemoryRepository } from '~/db/repository';

import type { Dashboard, DashboardWithCharts } from './dashboards.types';

export const listVisibleDashboards = ({
  repo,
  userInfo
}: {
  repo: InMemoryRepository;
  userInfo: UserInfo;
}): Dashboard[] => {
  return repo.listDashboards({ tenantId: userInfo.tenantId, userId: userInfo.userId });
};

export const getVisibleDashboardWithCharts = ({
  repo,
  userInfo,
  id
}: {
  repo: InMemoryRepository;
  userInfo: UserInfo;
  id: string;
}): DashboardWithCharts => {
  const dashboard = repo.findDashboardById({
    tenantId: userInfo.tenantId,
    userId: userInfo.userId,
    id
  });
  if (!dashboard) {
    throw new NotFoundError({ message: 'Dashboard not found' });
  }
  const charts = repo.listChartsByDashboardId({ dashboardId: dashboard.id });
  return { ...dashboard, charts };
};

export const createDashboard = ({
  repo,
  userInfo,
  title,
  isShared
}: {
  repo: InMemoryRepository;
  userInfo: UserInfo;
  title: string;
  isShared?: boolean;
}): Dashboard => {
  return repo.createDashboard({
    tenantId: userInfo.tenantId,
    ownerId: userInfo.userId,
    title,
    isShared
  });
};

/**
 * Soft-deletes a dashboard owned by the caller in the caller's tenant.
 * Returns `true` if a row was modified, otherwise throws NotFoundError so the
 * caller (controller) does not need to know the difference between
 * "doesn't exist" and "not your dashboard" — both map to 404.
 */
export const softDeleteDashboard = ({
  repo,
  userInfo,
  id
}: {
  repo: InMemoryRepository;
  userInfo: UserInfo;
  id: string;
}): void => {
  const deleted = repo.softDeleteDashboard({
    tenantId: userInfo.tenantId,
    ownerId: userInfo.userId,
    id
  });
  if (!deleted) throw new NotFoundError({ message: 'Dashboard not found' });
};
