# Task

## Background

This is a multi-tenant service which manages data dashboards.
Each tenant has their own dashboards, which they use to visualize their data.
A dashboard has an owner (the user in the tenant who created it) and can optionally be shared with the rest of the users in the tenant. Each dashboard contains a number of charts, and each chart's data comes from running a query against our data warehouse.

Because those queries are expensive, we don't run them on every page load. The DB keeps a cache of each chart's most recent result, and an automated scheduled process re-runs every chart's query once an hour to keep that cache fresh. So within a given hour, everyone viewing the same dashboard sees the same data — the snapshot from the previous hourly refresh.

Users have been asking for a way to see fresher data without waiting for the next hourly refresh. That's what this feature ships: a "refresh now" action that re-runs the queries on demand.
Since the underlying queries are expensive, a given dashboard can be on-demand refreshed at most **once per hour**.

## TO-DO

Implement a new endpoint - `POST /dashboards/:id/on-demand-refresh`.
Use the existing `executeQuery` function in `src/services/warehouse/warehouse.client.ts`, which simulates a query execution (note that it might fail sometimes, like real query executions).
The DB is the hardcoded file `data.json`, located in `src/db`
The new endpoint's response should give the client enough info to confirm how many charts were successfully refreshed.

Use `curl`, Postman, or any HTTP client to verify the new endpoint works.

**Deliverable:** a working endpoint.

Using Google and AI tools is allowed.

