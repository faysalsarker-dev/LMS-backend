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
    JWT_SECRET: zod_1.z.string().min(10),
    JWT_EXPIRES_IN: zod_1.z.string().default('1d'),
    BCRYPT_SALT_ROUNDS: zod_1.z.string().regex(/^\d+$/).default('10'),
    GOOGLE_MAPS_API_KEY: zod_1.z.string(),
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
        expires_in: env.data.JWT_EXPIRES_IN,
    },
    bcrypt_salt_rounds: Number(env.data.BCRYPT_SALT_ROUNDS),
    google_maps_api_key: env.data.GOOGLE_MAPS_API_KEY,
};
