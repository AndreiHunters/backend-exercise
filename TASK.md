# Task

## Background

This is a multi-tenant service that manages **data dashboards**. Each tenant has its own dashboards, owned by a user in that tenant and optionally shared with the rest of the tenant. Each dashboard contains a number of **charts**. Each chart is defined by a SQL query that runs against our external data warehouse.

Warehouse queries are expensive, so we don't run them on every page load. A scheduled job re-runs every chart's query **once an hour** and records the refresh time on the dashboard. Within an hourly window, everyone viewing the same dashboard sees the same snapshot — the one from the most recent hourly run.

Users have been asking for a way to see fresher data without waiting for the next hourly tick. That's what this feature ships: a **"refresh now"** action that re-runs a dashboard's queries on demand. Because warehouse queries are expensive, a given dashboard can be on-demand-refreshed **at most once per hour**.

## To-do

Implement a new endpoint:

```
POST /dashboards/:id/on-demand-refresh
```

When called, it should:

1. Run the SQL of every chart on the dashboard.
2. Enforce the **once-per-hour** limit per dashboard.
3. Return a response that tells the client how many of the charts were refreshed successfully.

### What you have to work with

- **`executeQuery`** in `src/services/warehouse/warehouse.client.ts` — an async function that simulates running a single SQL query against the warehouse. It may reject (the simulator is intentionally flaky). You don't need to edit it; just call it.
- **`src/db/data.json`** — this service's own file-backed database. It stores dashboard and chart **metadata**. The repository in `src/db/repository.ts` reads from it and writes back to it on mutations. This file is **not** the warehouse — the warehouse is the external system `executeQuery` talks to.

### Verification

Use `curl`, Postman, or any HTTP client to verify the new endpoint works end-to-end.

**Deliverable:** a working endpoint.

**Using Google and AI tools is allowed.**
