import { config } from 'dotenv';
config();

export const { NODE_ENV = 'development', PORT = 3000 } = process.env;
