# Task

## Context

Dashboards live inside a tenant. A dashboard has an owner and can optionally be shared with the rest of the tenant. Each dashboard contains a number of charts, and each chart's data comes from running a query against our data warehouse.

Because those queries are expensive, we don't run them on every page load. The warehouse keeps a cache of each chart's most recent result, and a scheduled job re-runs every chart's query once an hour to keep that cache fresh. So within a given hour, everyone viewing the same dashboard sees the same numbers — the snapshot from the previous hourly refresh.

Users have been asking for a way to see fresher data without waiting for the next hour. That's what this feature ships: a "refresh now" action that re-runs the queries on demand. Since the underlying queries are expensive, a given dashboard can be on-demand refreshed at most once per hour.

## About this exercise

Implement this as a new endpoint at `POST /dashboards/:id/on-demand-refresh`, alongside the existing dashboards endpoints — read those for the conventions. Use the existing `executeQuery` function in `src/services/warehouse/warehouse.client.ts` to actually run the refreshes; don't modify it. The response should give the client enough info to confirm how many charts were successfully refreshed.

Use `curl`, Postman, or any HTTP client to verify your work. Each warehouse call prints to the dev log so you can see what ran.

**Deliverable:** a working endpoint.

**Time:** 60–75 minutes. AI tooling is expected; keep your chat visible.
