# Dashboards: on-demand-refresh interview

A small Node.js + TypeScript Express service. Dashboards belong to a tenant and an owner, can be shared, and contain a number of Charts. Each Chart has a SQL query that is "executed" by a mock SQL warehouse running in this same Express app at `/mock-warehouse`.

## Quick start

```bash
cp .env.example .env
npm install
npm run dev
```

The server listens on `http://localhost:3000` by default.

