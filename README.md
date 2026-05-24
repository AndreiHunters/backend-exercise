# Dashboards: on-demand-refresh interview

A small Node.js + TypeScript Express service. Dashboards belong to a tenant and an owner, can be shared, and contain a number of Charts. Each Chart has a SQL query that is "executed" via an in-process simulator at `src/services/warehouse/warehouse.client.ts`.

## Quick start

```bash
cp .env.example .env
npm install
npm run dev (Or use the existing launch.json file to debug via Cursor)
```

The server listens on `http://localhost:3000` by default.

