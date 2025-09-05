import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('5000'),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(10),
  JWT_EXPIRES_IN: z.string().default('1d'),
  BCRYPT_SALT_ROUNDS: z.string().regex(/^\d+$/).default('10'),
  GOOGLE_MAPS_API_KEY: z.string(),
});

const env = envSchema.safeParse(process.env);

if (!env.success) {
  console.error('Invalid environment variables', env.error.format());
  process.exit(1);
}

export default {
  port: Number(env.data.PORT),
  database_url: env.data.DATABASE_URL,
  jwt: {
    secret: env.data.JWT_SECRET,
    expires_in: env.data.JWT_EXPIRES_IN,
  },
  bcrypt_salt_rounds: Number(env.data.BCRYPT_SALT_ROUNDS),
  google_maps_api_key: env.data.GOOGLE_MAPS_API_KEY,
};
