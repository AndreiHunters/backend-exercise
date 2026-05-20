import 'dotenv/config';

const PORT = Number(process.env.PORT) || 3000;
const REFRESH_COOLDOWN_MINUTES = Number(process.env.REFRESH_COOLDOWN_MINUTES) || 60;
const MOCK_WAREHOUSE_BASE_URL =
  process.env.MOCK_WAREHOUSE_BASE_URL ?? `http://localhost:${PORT}/mock-warehouse`;

export const config = Object.freeze({
  PORT,
  REFRESH_COOLDOWN_MINUTES,
  MOCK_WAREHOUSE_BASE_URL
});
