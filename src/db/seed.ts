import type { Chart, Dashboard } from '~/components/dashboards/dashboards.types';

// Fixed reference timestamps. The seed is deterministic and does NOT depend on
// the time the server starts — `lastRefreshedAt` values are real points in time.
const CREATED_AT = new Date('2026-01-01T00:00:00.000Z');
const DELETED_AT = new Date('2026-04-01T00:00:00.000Z');
// `lastRefreshedAt` for the long-ago dashboard. Fixed and intrinsically far in
// the past, so it is always outside the cooldown window.
const LAST_REFRESHED_LONG_AGO = new Date('2026-01-15T12:00:00.000Z');

const dashboards: Dashboard[] = [
  {
    id: 'b6d8e4a1-7c2f-4f5b-9a3e-2c1d8b5e7f4a',
    tenantId: 'tenant-1',
    ownerId: 'user-alice',
    title: 'Empty dashboard',
    isShared: false,
    lastRefreshedAt: null,
    createdAt: CREATED_AT,
    deletedAt: null
  },
  {
    id: 'e1f4c7a9-3b8d-4e2c-9f6a-5c8b2d1e3f7b',
    tenantId: 'tenant-1',
    ownerId: 'user-alice',
    title: "Alice's private dashboard",
    isShared: false,
    lastRefreshedAt: null,
    createdAt: CREATED_AT,
    deletedAt: null
  },
  {
    id: '4a9c2d6e-5b1f-4c8a-8d3e-7b6f1c2d4e5a',
    tenantId: 'tenant-1',
    ownerId: 'user-alice',
    title: 'Team shared dashboard',
    isShared: true,
    lastRefreshedAt: null,
    createdAt: CREATED_AT,
    deletedAt: null
  },
  {
    id: 'd2e7f1c4-8a3b-4d5e-9c2f-1b6a8d4e7c9f',
    tenantId: 'tenant-1',
    ownerId: 'user-alice',
    title: 'Refreshed long ago',
    isShared: false,
    lastRefreshedAt: LAST_REFRESHED_LONG_AGO,
    createdAt: CREATED_AT,
    deletedAt: null
  },
  {
    id: '7f1c4d8e-2b3a-4f5c-8e9d-6a1b3c5d7e9f',
    tenantId: 'tenant-2',
    ownerId: 'user-carol',
    title: "Carol's tenant-2 dashboard",
    isShared: true,
    lastRefreshedAt: null,
    createdAt: CREATED_AT,
    deletedAt: null
  },
  {
    id: '3c8f2e6d-1a4b-4c7e-9d5f-8a2b3c4d5e6f',
    tenantId: 'tenant-1',
    ownerId: 'user-alice',
    title: 'Old soft-deleted dashboard',
    isShared: true,
    lastRefreshedAt: null,
    createdAt: CREATED_AT,
    deletedAt: DELETED_AT
  }
];

const charts: Chart[] = [
  // Charts for the private dashboard (3)
  {
    id: 'a1c3e5b7-2d4f-4a6c-8e0a-9b1c3d5e7f9a',
    dashboardId: 'e1f4c7a9-3b8d-4e2c-9f6a-5c8b2d1e3f7b',
    title: 'Daily events',
    sql: 'SELECT count(*) FROM events_daily WHERE tenant = $1'
  },
  {
    id: '7b3d8c2f-9e1a-4d5b-bc6e-2f8a1b3c5d7e',
    dashboardId: 'e1f4c7a9-3b8d-4e2c-9f6a-5c8b2d1e3f7b',
    title: 'Weekly events',
    sql: 'SELECT count(*) FROM events_weekly WHERE tenant = $1'
  },
  {
    id: '4f1a9c5e-3b8d-4a2c-9f7b-5c8a1d3e6f9b',
    dashboardId: 'e1f4c7a9-3b8d-4e2c-9f6a-5c8b2d1e3f7b',
    title: 'Monthly events',
    sql: 'SELECT count(*) FROM events_monthly WHERE tenant = $1'
  },
  // Charts for the shared dashboard (2)
  {
    id: '2e8d4c6a-1f3b-4e5a-9c8d-7a3b5c1d9e2f',
    dashboardId: '4a9c2d6e-5b1f-4c8a-8d3e-7b6f1c2d4e5a',
    title: 'Shared chart A',
    sql: 'SELECT count(*) FROM events_shared_1 WHERE tenant = $1'
  },
  {
    id: '6a4c1f8e-2b9d-4c3a-8e1f-5b7d2a4c6e8f',
    dashboardId: '4a9c2d6e-5b1f-4c8a-8d3e-7b6f1c2d4e5a',
    title: 'Shared chart B',
    sql: 'SELECT count(*) FROM events_shared_2 WHERE tenant = $1'
  },
  // Charts for the long-ago dashboard (2)
  {
    id: '9c5e2a7b-4f8d-4b6c-9a3d-1e8b6c2f4a5d',
    dashboardId: 'd2e7f1c4-8a3b-4d5e-9c2f-1b6a8d4e7c9f',
    title: 'Long-ago chart A',
    sql: 'SELECT count(*) FROM events_old_1 WHERE tenant = $1'
  },
  {
    id: '3e7b9c4f-5a1d-4f2e-8b5a-2c6d4e1f9a7b',
    dashboardId: 'd2e7f1c4-8a3b-4d5e-9c2f-1b6a8d4e7c9f',
    title: 'Long-ago chart B',
    sql: 'SELECT count(*) FROM events_old_2 WHERE tenant = $1'
  },
  // Charts for the other-tenant dashboard (2)
  {
    id: '8d2f6e1a-9c4b-4a8e-bc7d-3f5e2a9b1c4d',
    dashboardId: '7f1c4d8e-2b3a-4f5c-8e9d-6a1b3c5d7e9f',
    title: 'Tenant-2 chart A',
    sql: 'SELECT count(*) FROM events_t2_1 WHERE tenant = $1'
  },
  {
    id: '5a9d3c7f-6e2b-4d1a-9f8b-4c1e5a3b7d6e',
    dashboardId: '7f1c4d8e-2b3a-4f5c-8e9d-6a1b3c5d7e9f',
    title: 'Tenant-2 chart B',
    sql: 'SELECT count(*) FROM events_t2_2 WHERE tenant = $1'
  },
  // Charts for the deleted dashboard (2 — kept for completeness; dashboard is hidden by deletedAt)
  {
    id: '1f6a4d8c-7b3e-4c9d-8a2f-9b6e1d4a3c5f',
    dashboardId: '3c8f2e6d-1a4b-4c7e-9d5f-8a2b3c4d5e6f',
    title: 'Deleted chart A',
    sql: 'SELECT count(*) FROM events_del_1 WHERE tenant = $1'
  },
  {
    id: 'b3e8f5a2-4c9d-4f7b-9d3e-6a8c1b5f4e2d',
    dashboardId: '3c8f2e6d-1a4b-4c7e-9d5f-8a2b3c4d5e6f',
    title: 'Deleted chart B',
    sql: 'SELECT count(*) FROM events_del_2 WHERE tenant = $1'
  }
];

export const seed: { dashboards: Dashboard[]; charts: Chart[] } = { dashboards, charts };
