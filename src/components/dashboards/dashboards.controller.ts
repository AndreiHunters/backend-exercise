import type { Request, Response } from 'express';

import { repository } from '~/db/repository';
import { handleApiError } from '~/helpers/error.utils';
import { APIResponse } from '~/helpers/response.helper';
import type { UserInfo } from '~/helpers/http-helpers';

import {
  createDashboard as createDashboardService,
  getVisibleDashboardWithCharts,
  listVisibleDashboards,
  softDeleteDashboard
} from './dashboards.service';

const requireUserInfo = ({ req }: { req: Request }): UserInfo => {
  // auth middleware guarantees this is set on protected routes
  return req.userInfo as UserInfo;
};

export const getDashboardsController = (req: Request, res: Response) => {
  const apiResponse = new APIResponse({ req, res });
  try {
    const userInfo = requireUserInfo({ req });
    const dashboards = listVisibleDashboards({ repo: repository, userInfo });
    return apiResponse.Success({ data: { dashboards } });
  } catch (error) {
    return handleApiError({ apiResponse, error });
  }
};

export const getDashboardByIdController = (req: Request, res: Response) => {
  const apiResponse = new APIResponse({ req, res });
  try {
    const userInfo = requireUserInfo({ req });
    const { id } = req.params as { id: string };
    const dashboard = getVisibleDashboardWithCharts({ repo: repository, userInfo, id });
    return apiResponse.Success({ data: dashboard });
  } catch (error) {
    return handleApiError({ apiResponse, error });
  }
};

export const createDashboardController = (req: Request, res: Response) => {
  const apiResponse = new APIResponse({ req, res });
  try {
    const userInfo = requireUserInfo({ req });
    const { title, isShared } = (req.body as { title: string; isShared?: boolean }) ?? {};
    const dashboard = createDashboardService({ repo: repository, userInfo, title, isShared });
    return apiResponse.Created({ data: dashboard });
  } catch (error) {
    return handleApiError({ apiResponse, error });
  }
};

export const deleteDashboardController = (req: Request, res: Response) => {
  const apiResponse = new APIResponse({ req, res });
  try {
    const userInfo = requireUserInfo({ req });
    const { id } = req.params as { id: string };
    softDeleteDashboard({ repo: repository, userInfo, id });
    return apiResponse.Success({ data: { ok: true } });
  } catch (error) {
    return handleApiError({ apiResponse, error });
  }
};
