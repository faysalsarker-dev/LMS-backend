"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAppConfig = exports.createAppConfig = exports.getAppConfig = void 0;
const App_model_1 = __importDefault(require("./App.model"));
const getAppConfig = async () => {
    return await App_model_1.default.findOne();
};
exports.getAppConfig = getAppConfig;
const createAppConfig = async (payload) => {
    const existing = await App_model_1.default.findOne();
    if (existing) {
        throw new Error("AppConfig already exists. Please update instead.");
    }
    const config = new App_model_1.default(payload);
    return await config.save();
};
exports.createAppConfig = createAppConfig;
const updateAppConfig = async (payload) => {
    const config = await App_model_1.default.findOne();
    if (!config)
        throw new Error("No config found. Create one first.");
    Object.assign(config, payload);
    return await config.save();
};
exports.updateAppConfig = updateAppConfig;
