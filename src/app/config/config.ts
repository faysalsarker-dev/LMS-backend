import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('5000'),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  JWT_ACCESS_EXPIRES_IN: z.string(),
  JWT_REFRESH_EXPIRES_IN: z.string(),
  BCRYPT_SALT_ROUNDS: z.string().regex(/^\d+$/).default('10'),
  USER_MAIL: z.string().email(),
  USER_PASS: z.string(),
  SMTP_HOST: z.string().default('smtp.gmail.com'),
  SMTP_PORT: z.string().regex(/^\d+$/).default('587'),
  FRONTEND_URL:z.string(),
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
    access_expires_in: env.data.JWT_ACCESS_EXPIRES_IN,
    refresh_expires_in: env.data.JWT_REFRESH_EXPIRES_IN,
  },
  bcrypt_salt_rounds: Number(env.data.BCRYPT_SALT_ROUNDS),

    user: env.data.USER_MAIL,
    pass: env.data.USER_PASS,
    host: env.data.SMTP_HOST,
   smtp_port: Number(env.data.SMTP_PORT),
   frontend_url:env.data.FRONTEND_URL

  };
