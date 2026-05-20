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
  return repo.listDashboards({ tenant: userInfo.tenant, userId: userInfo.userId });
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
    tenant: userInfo.tenant,
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
    tenant: userInfo.tenant,
    ownerId: userInfo.userId,
    title,
    isShared
  });
};

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
    tenant: userInfo.tenant,
    ownerId: userInfo.userId,
    id
  });
  if (!deleted) throw new NotFoundError({ message: 'Dashboard not found' });
};
