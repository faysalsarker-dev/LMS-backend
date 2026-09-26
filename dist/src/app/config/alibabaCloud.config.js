"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFromAlibaba = exports.uploadBufferToAlibaba = void 0;
const ali_oss_1 = __importDefault(require("ali-oss"));
const config_1 = __importDefault(require("./config"));
const ApiError_1 = require("../errors/ApiError");
// Initialize Alibaba Cloud OSS client
const client = new ali_oss_1.default({
    region: config_1.default.alibabaCloud.region,
    accessKeyId: config_1.default.alibabaCloud.accessKeyId,
    accessKeySecret: config_1.default.alibabaCloud.accessKeySecret,
    bucket: config_1.default.alibabaCloud.bucket,
});
/**
 * Extract file path from Alibaba Cloud URL
 * Handles both full URLs and direct paths
 */
const getFilePathFromUrl = (urlOrPath) => {
    try {
        // If it's a full URL, extract the path
        if (urlOrPath.startsWith("http://") || urlOrPath.startsWith("https://")) {
            const url = new URL(urlOrPath);
            return url.pathname.replace(/^\//, ""); // Remove leading slash
        }
        // If it's already a path, return as is
        return urlOrPath;
    }
    catch {
        // If URL parsing fails, treat as direct path
        return urlOrPath;
    }
};
const uploadBufferToAlibaba = async (buffer, destinationPath, mimeType) => {
    try {
        const result = await client.put(destinationPath, buffer, {
            headers: {
                "Content-Type": mimeType,
            },
        });
        if (!result.url) {
            throw new ApiError_1.ApiError(500, "Failed to get Alibaba Cloud upload URL");
        }
        return result.url;
    }
    catch (error) {
        throw new ApiError_1.ApiError(500, `Alibaba Cloud upload failed: ${error.message || "Unknown error"}`);
    }
};
exports.uploadBufferToAlibaba = uploadBufferToAlibaba;
const deleteFromAlibaba = async (urlOrPath) => {
    try {
        // Extract path from URL or use directly if already a path
        const filePath = getFilePathFromUrl(urlOrPath);
        await client.delete(filePath);
    }
    catch (error) {
        throw new ApiError_1.ApiError(500, `Alibaba Cloud deletion failed: ${error.message || "Unknown error"}`);
    }
};
exports.deleteFromAlibaba = deleteFromAlibaba;
