"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFileByPath = exports.deleteMultipleFiles = exports.deleteFile = void 0;
const bunny_config_1 = require("../config/bunny.config");
const alibabaCloud_config_1 = require("../config/alibabaCloud.config");
const ApiError_1 = require("../errors/ApiError");
/**
 * Unified file deletion function
 * Routes to appropriate provider based on isInternational flag
 *
 * @param fileUrl - File URL or path to delete
 * @param isInternational - Boolean flag (true = Bunny, false = Alibaba Cloud). Default: true
 * @throws ApiError if deletion fails
 */
const deleteFile = async (fileUrl, isInternational = true) => {
    if (!fileUrl) {
        throw new ApiError_1.ApiError(400, "File URL is required for deletion");
    }
    try {
        if (isInternational) {
            // Delete from Bunny
            await (0, bunny_config_1.deleteFileFromBunny)(fileUrl);
        }
        else {
            // Delete from Alibaba Cloud
            await (0, alibabaCloud_config_1.deleteFromAlibaba)(fileUrl);
        }
    }
    catch (error) {
        throw new ApiError_1.ApiError(500, `Failed to delete file: ${error.message || "Unknown error"}`);
    }
};
exports.deleteFile = deleteFile;
/**
 * Delete multiple files from the same provider
 *
 * @param fileUrls - Array of file URLs to delete
 * @param isInternational - Boolean flag (true = Bunny, false = Alibaba Cloud). Default: true
 * @throws ApiError if any deletion fails
 */
const deleteMultipleFiles = async (fileUrls, isInternational = true) => {
    const successCount = [];
    const failedUrls = [];
    for (const fileUrl of fileUrls) {
        try {
            await (0, exports.deleteFile)(fileUrl, isInternational);
            successCount.push(fileUrl);
        }
        catch (error) {
            failedUrls.push(fileUrl);
            console.error(`Failed to delete ${fileUrl}:`, error.message);
        }
    }
    return {
        success: successCount,
        failed: failedUrls,
    };
};
exports.deleteMultipleFiles = deleteMultipleFiles;
/**
 * Delete file by its path/filename instead of URL
 * Useful when you only have the storage path, not the full URL
 *
 * @param filePath - File path (e.g., "videos/123-abc-video.mp4")
 * @param isInternational - Boolean flag (true = Bunny, false = Alibaba Cloud). Default: true
 */
const deleteFileByPath = async (filePath, isInternational = true) => {
    if (!filePath) {
        throw new ApiError_1.ApiError(400, "File path is required for deletion");
    }
    try {
        if (isInternational) {
            // For Bunny, pass the path directly
            await (0, bunny_config_1.deleteFileFromBunny)(filePath);
        }
        else {
            // For Alibaba, pass the path directly
            await (0, alibabaCloud_config_1.deleteFromAlibaba)(filePath);
        }
    }
    catch (error) {
        throw new ApiError_1.ApiError(500, `Failed to delete file at path ${filePath}: ${error.message || "Unknown error"}`);
    }
};
exports.deleteFileByPath = deleteFileByPath;
