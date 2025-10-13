"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateConfig = exports.createConfig = exports.getConfig = void 0;
const AppConfigService = __importStar(require("./appConfig.service"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const ApiError_1 = require("../../errors/ApiError");
exports.getConfig = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const config = await AppConfigService.getAppConfig();
    if (!config) {
        const seededConfig = await AppConfigService.seedAppConfigFromEnv();
        if (!seededConfig) {
            throw new ApiError_1.ApiError(404, "App configuration not found and seeding failed.");
        }
        return (0, sendResponse_1.default)(res, {
            success: true,
            statusCode: 200,
            message: "App configuration seeded from environment successfully.",
            data: seededConfig,
        });
    }
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "App configuration fetched successfully.",
        data: config,
    });
});
exports.createConfig = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const config = await AppConfigService.createAppConfig(req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 201,
        message: "App configuration created successfully.",
        data: config,
    });
});
exports.updateConfig = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const config = await AppConfigService.updateAppConfig(req.params.id, req.body);
    if (!config) {
        throw new ApiError_1.ApiError(404, "App configuration not found.");
    }
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "App configuration updated successfully.",
        data: config,
    });
});
