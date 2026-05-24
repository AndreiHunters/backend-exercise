import 'dotenv/config';

const PORT = Number(process.env.PORT) || 3000;

export const config = Object.freeze({
  PORT
});
