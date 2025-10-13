"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedAppConfigFromEnv = exports.updateAppConfig = exports.createAppConfig = exports.getAppConfig = void 0;
const App_model_1 = __importDefault(require("./App.model"));
const config_1 = __importDefault(require("../../config/config"));
const ApiError_1 = require("../../errors/ApiError");
// ✅ Get app configuration
const getAppConfig = async () => {
    return await App_model_1.default.findOne();
};
exports.getAppConfig = getAppConfig;
// ✅ Create new configuration
const createAppConfig = async (payload) => {
    const existing = await App_model_1.default.findOne();
    if (existing) {
        throw new ApiError_1.ApiError(400, "AppConfig already exists. Please update instead.");
    }
    const newConfig = new App_model_1.default(payload);
    return await newConfig.save();
};
exports.createAppConfig = createAppConfig;
// ✅ Update configuration
const updateAppConfig = async (id, payload) => {
    const existing = await App_model_1.default.findById(id);
    if (!existing) {
        throw new ApiError_1.ApiError(404, "No AppConfig found. Please create one first.");
    }
    Object.assign(existing, payload);
    return await existing.save();
};
exports.updateAppConfig = updateAppConfig;
// ✅ Seed data from environment config if DB is empty
const seedAppConfigFromEnv = async () => {
    const existing = await App_model_1.default.findOne();
    if (existing)
        return existing;
    const payload = {
        cloudinary: {
            cloudName: config_1.default.cloudinary.cloudinary_cloud_name,
            apiKey: config_1.default.cloudinary.cloudinary_api_key,
            apiSecret: config_1.default.cloudinary.cloudinary_api_secret,
        },
        smtp: {
            host: config_1.default.host,
            port: config_1.default.smtp_port,
            user: config_1.default.user,
            pass: config_1.default.pass,
        },
        jwt: {
            accessExpiresIn: config_1.default.jwt.access_expires_in,
            refreshExpiresIn: config_1.default.jwt.refresh_expires_in,
        },
        frontendUrl: config_1.default.frontend_url,
    };
    const newConfig = new App_model_1.default(payload);
    return await newConfig.save();
};
exports.seedAppConfigFromEnv = seedAppConfigFromEnv;
