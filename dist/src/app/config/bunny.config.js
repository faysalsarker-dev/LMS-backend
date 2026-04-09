"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFileFromBunny = exports.uploadBufferToBunny = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = __importDefault(require("./config"));
const ApiError_1 = require("../errors/ApiError");
const storageZoneName = config_1.default.bunny.storage_zone_name;
const storagePassword = config_1.default.bunny.storage_zone_password;
const storageRegionHost = config_1.default.bunny.storage_region_host || "storage.bunnycdn.com";
const cdnHostname = config_1.default.bunny.cdn_hostname;
const getStorageEndpoint = (path) => `https://${storageRegionHost}/${storageZoneName}/${path}`;
const getPublicUrl = (path) => {
    if (cdnHostname) {
        return `https://${cdnHostname}/${path}`;
    }
    return getStorageEndpoint(path);
};
const getRelativePathFromUrl = (url) => {
    try {
        const parsed = new URL(url);
        if (parsed.hostname === storageRegionHost && parsed.pathname.startsWith(`/${storageZoneName}/`)) {
            return parsed.pathname.replace(`/${storageZoneName}/`, "");
        }
        if (cdnHostname && parsed.hostname === cdnHostname) {
            return parsed.pathname.replace(/^\//, "");
        }
        if (parsed.hostname.endsWith("bunnycdn.com") && parsed.pathname.includes(`/${storageZoneName}/`)) {
            return parsed.pathname.split(`/${storageZoneName}/`)[1];
        }
        return null;
    }
    catch {
        return null;
    }
};
const uploadBufferToBunny = async (buffer, destinationPath, mimeType) => {
    try {
        const url = getStorageEndpoint(destinationPath);
        await axios_1.default.put(url, buffer, {
            headers: {
                AccessKey: storagePassword,
                "Content-Type": mimeType,
                "Content-Length": buffer.length,
            },
            maxBodyLength: Infinity,
        });
        return getPublicUrl(destinationPath);
    }
    catch (error) {
        throw new ApiError_1.ApiError(500, `Bunny.net upload failed: ${error.message}`);
    }
};
exports.uploadBufferToBunny = uploadBufferToBunny;
const deleteFileFromBunny = async (fileUrl) => {
    const relativePath = getRelativePathFromUrl(fileUrl);
    if (!relativePath) {
        throw new ApiError_1.ApiError(400, `Unable to parse Bunny.net file URL: ${fileUrl}`);
    }
    const url = getStorageEndpoint(relativePath);
    await axios_1.default.delete(url, {
        headers: {
            AccessKey: storagePassword,
        },
    });
};
exports.deleteFileFromBunny = deleteFileFromBunny;
