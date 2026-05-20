import 'dotenv/config';

const toNumber = ({ raw, fallback }: { raw: string | undefined; fallback: number }): number => {
  if (!raw) return fallback;
  const n = Number(raw);
  return Number.isFinite(n) ? n : fallback;
};

const PORT = toNumber({ raw: process.env.PORT, fallback: 3000 });
const REFRESH_COOLDOWN_MINUTES = toNumber({
  raw: process.env.REFRESH_COOLDOWN_MINUTES,
  fallback: 60
});
const MOCK_WAREHOUSE_BASE_URL =
  process.env.MOCK_WAREHOUSE_BASE_URL ?? `http://localhost:${PORT}/mock-warehouse`;

export const config = Object.freeze({
  PORT,
  REFRESH_COOLDOWN_MINUTES,
  MOCK_WAREHOUSE_BASE_URL
});

export type AppConfig = typeof config;
