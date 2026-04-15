"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToDomestic = exports.uploadToInternational = exports.dynamicFileUploadMiddleware = exports.fileUploadMiddleware = void 0;
const multer_1 = __importDefault(require("multer"));
const fileUpload_config_1 = __importDefault(require("../config/fileUpload.config"));
const ApiError_1 = require("../errors/ApiError");
// Define file size limits
const FILE_SIZE_LIMITS = {
    image: 10 * 1024 * 1024, // 10MB
    video: 500 * 1024 * 1024, // 500MB
    audio: 50 * 1024 * 1024, // 50MB
    default: 20 * 1024 * 1024, // 20MB
};
const ALLOWED_MIME_TYPES = {
    image: ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"],
    video: ["video/mp4", "video/mpeg", "video/quicktime", "video/x-msvideo"],
    audio: ["audio/mpeg", "audio/wav", "audio/ogg", "audio/webm"],
};
// Get file size limit based on field name
const getFileSizeLimit = (fieldname) => {
    if (fieldname === "video")
        return FILE_SIZE_LIMITS.video;
    if (fieldname === "audio" || fieldname === "audioFile")
        return FILE_SIZE_LIMITS.audio;
    if (fieldname === "image" || fieldname === "thumbnail" || fieldname === "profilePicture")
        return FILE_SIZE_LIMITS.image;
    return FILE_SIZE_LIMITS.default;
};
// Validate file based on field name
const fileFilter = (req, file, cb) => {
    if (file.fieldname === "video" && !ALLOWED_MIME_TYPES.video.includes(file.mimetype)) {
        return cb(new ApiError_1.ApiError(400, "Only video files are allowed for video field"));
    }
    if ((file.fieldname === "audio" || file.fieldname === "audioFile") &&
        !ALLOWED_MIME_TYPES.audio.includes(file.mimetype)) {
        return cb(new ApiError_1.ApiError(400, "Only audio files are allowed for audio field"));
    }
    if ((file.fieldname === "image" ||
        file.fieldname === "thumbnail" ||
        file.fieldname === "profilePicture") &&
        !ALLOWED_MIME_TYPES.image.includes(file.mimetype)) {
        return cb(new ApiError_1.ApiError(400, "Only image files are allowed for image field"));
    }
    cb(null, true);
};
/**
 * File Upload Middleware
 * Checks if user/request is international and routes to appropriate provider
 * @param isInternational - Boolean flag to determine upload provider
 * @returns Express middleware
 */
const fileUploadMiddleware = (isInternational = true) => {
    const storage = new fileUpload_config_1.default(isInternational);
    return (0, multer_1.default)({
        storage,
        limits: {
            fileSize: FILE_SIZE_LIMITS.default,
        },
        fileFilter,
    });
};
exports.fileUploadMiddleware = fileUploadMiddleware;
/**
 * Dynamic File Upload Middleware
 * Determines upload provider from request object (prioritizes req.body)
 * Priority order:
 * 1. req.body.isInternational (frontend user selection)
 * 2. req.user.isInternational (authenticated user profile)
 * 3. req.query.isInternational (URL query parameter)
 * 4. Default to true (Bunny)
 * @returns Express middleware creator
 */
const dynamicFileUploadMiddleware = (fieldName) => {
    return (req, res, next) => {
        // Get isInternational flag - prioritize req.body (frontend selection)
        const isInternational = req.body?.isInternational ??
            req.user?.isInternational ??
            req.query?.isInternational ??
            true;
        const storage = new fileUpload_config_1.default(Boolean(isInternational));
        const uploader = (0, multer_1.default)({
            storage,
            limits: {
                fileSize: getFileSizeLimit(Array.isArray(fieldName) ? fieldName[0] : fieldName),
            },
            fileFilter,
        });
        // Handle single or multiple fields
        if (Array.isArray(fieldName)) {
            uploader.fields(fieldName.map((fn) => ({ name: fn })))(req, res, next);
        }
        else {
            uploader.single(fieldName)(req, res, next);
        }
    };
};
exports.dynamicFileUploadMiddleware = dynamicFileUploadMiddleware;
/**
 * Static File Upload Middleware - for International users (Bunny)
 */
exports.uploadToInternational = (0, multer_1.default)({
    storage: new fileUpload_config_1.default(true),
    limits: { fileSize: FILE_SIZE_LIMITS.default },
    fileFilter,
});
/**
 * Static File Upload Middleware - for Domestic users (Alibaba Cloud)
 */
exports.uploadToDomestic = (0, multer_1.default)({
    storage: new fileUpload_config_1.default(false),
    limits: { fileSize: FILE_SIZE_LIMITS.default },
    fileFilter,
});
