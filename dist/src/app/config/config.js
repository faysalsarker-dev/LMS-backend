"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
dotenv_1.default.config();
const envSchema = zod_1.z.object({
    PORT: zod_1.z.string().default('5000'),
    DATABASE_URL: zod_1.z.string().url(),
    JWT_SECRET: zod_1.z.string().min(32),
    JWT_ACCESS_EXPIRES_IN: zod_1.z.string(),
    JWT_REFRESH_EXPIRES_IN: zod_1.z.string(),
    BCRYPT_SALT_ROUNDS: zod_1.z.string().regex(/^\d+$/).default('10'),
    USER_MAIL: zod_1.z.string().email(),
    USER_PASS: zod_1.z.string(),
    SMTP_HOST: zod_1.z.string().default('smtp.gmail.com'),
    SMTP_PORT: zod_1.z.string().regex(/^\d+$/).default('587'),
    FRONTEND_URL: zod_1.z.string(),
});
const env = envSchema.safeParse(process.env);
if (!env.success) {
    console.error('Invalid environment variables', env.error.format());
    process.exit(1);
}
exports.default = {
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
    frontend_url: env.data.FRONTEND_URL
};
