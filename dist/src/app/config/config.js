"use strict";
// import dotenv from 'dotenv';
// import { z } from 'zod';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// dotenv.config();
// const envSchema = z.object({
//   PORT: z.string().default('5000'),
//   DATABASE_URL: z.string().url(),
//   JWT_SECRET: z.string().min(32),
//   JWT_ACCESS_EXPIRES_IN: z.string(),
//   JWT_REFRESH_EXPIRES_IN: z.string(),
//   BCRYPT_SALT_ROUNDS: z.string().regex(/^\d+$/).default('10'),
//   USER_MAIL: z.string().email(),
//   USER_PASS: z.string(),
//   SMTP_HOST: z.string().default('smtp.gmail.com'),
//   SMTP_PORT: z.string().regex(/^\d+$/).default('587'),
//   FRONTEND_URL:z.string(),
//       CLOUDINARY_CLOUD_NAME:z.string(),
// CLOUDINARY_API_KEY:z.string(),
// CLOUDINARY_API_SECRET:z.string(),
// SSL:z.object({
//   SSL_ID:z.string(),
//   SSL_PASS:z.string(),
//   SSL_PAYMENT:z.string(),
//   SSL_VALIDATION_API:z.string(),
//   SSL_SUCCESS_FRONTEND_URL:z.string(),
//   SSL_CANCEL_FRONTEND_URL:z.string(),
//   SSL_SUCCESS_BACKEND_URL:z.string(),
//   SSL_CANCEL_BACKEND_URL:z.string(),
// })
// });
// const env = envSchema.safeParse(process.env);
// if (!env.success) {
//   console.error('Invalid environment variables', env.error.format());
//   process.exit(1);
// }
// export default {
//   port: Number(env.data.PORT),
//   database_url: env.data.DATABASE_URL,
//   jwt: {
//     secret: env.data.JWT_SECRET,
//     access_expires_in: env.data.JWT_ACCESS_EXPIRES_IN,
//     refresh_expires_in: env.data.JWT_REFRESH_EXPIRES_IN,
//   },
//   bcrypt_salt_rounds: Number(env.data.BCRYPT_SALT_ROUNDS),
//     user: env.data.USER_MAIL,
//     pass: env.data.USER_PASS,
//     host: env.data.SMTP_HOST,
//    smtp_port: Number(env.data.SMTP_PORT),
//    frontend_url:env.data.FRONTEND_URL,
//    cloudinary:{
//      cloudinary_cloud_name:env.data.CLOUDINARY_CLOUD_NAME,
//    cloudinary_api_key:env.data.CLOUDINARY_API_KEY,
//    cloudinary_api_secret:env.data.CLOUDINARY_API_SECRET,
//    },
//   ssl:{
// sslId:
//   }
//   };
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
    FRONTEND_URL: zod_1.z.string().url(),
    CLOUDINARY_CLOUD_NAME: zod_1.z.string(),
    CLOUDINARY_API_KEY: zod_1.z.string(),
    CLOUDINARY_API_SECRET: zod_1.z.string(),
    // ✅ SSL (flat in env, grouped in export)
    SSL_STORE_ID: zod_1.z.string(),
    SSL_STORE_PASS: zod_1.z.string(),
    SSL_PAYMENT_API: zod_1.z.string().url(),
    SSL_VALIDATION_API: zod_1.z.string().url(),
    SSL_SUCCESS_FRONTEND_URL: zod_1.z.string().url(),
    SSL_CANCEL_FRONTEND_URL: zod_1.z.string().url(),
    SSL_SUCCESS_BACKEND_URL: zod_1.z.string().url(),
    SSL_CANCEL_BACKEND_URL: zod_1.z.string().url(),
    SSL_FAIL_BACKEND_URL: zod_1.z.string().url(),
});
const env = envSchema.safeParse(process.env);
if (!env.success) {
    console.error('❌ Invalid environment variables:', env.error.format());
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
    frontend_url: env.data.FRONTEND_URL,
    cloudinary: {
        cloudinary_cloud_name: env.data.CLOUDINARY_CLOUD_NAME,
        cloudinary_api_key: env.data.CLOUDINARY_API_KEY,
        cloudinary_api_secret: env.data.CLOUDINARY_API_SECRET,
    },
    ssl: {
        sslId: env.data.SSL_STORE_ID,
        sslPass: env.data.SSL_STORE_PASS,
        sslPayment: env.data.SSL_PAYMENT_API,
        sslValidationApi: env.data.SSL_VALIDATION_API,
        sslSuccessFrontendUrl: env.data.SSL_SUCCESS_FRONTEND_URL,
        sslCancelFrontendUrl: env.data.SSL_CANCEL_FRONTEND_URL,
        sslSuccessBackendUrl: env.data.SSL_SUCCESS_BACKEND_URL,
        sslCancelBackendUrl: env.data.SSL_CANCEL_BACKEND_URL,
        sslFailBackendUrl: env.data.SSL_FAIL_BACKEND_URL,
    },
};
