import multer from "multer";
import { NextFunction, Request, Response } from "express";
import UniversalStorage from "../config/fileUpload.config";
import { ApiError } from "../errors/ApiError";

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
const getFileSizeLimit = (fieldname: string): number => {
  if (fieldname === "video") return FILE_SIZE_LIMITS.video;
  if (fieldname === "audio" || fieldname === "audioFile") return FILE_SIZE_LIMITS.audio;
  if (fieldname === "image" || fieldname === "thumbnail" || fieldname === "profilePicture")
    return FILE_SIZE_LIMITS.image;
  return FILE_SIZE_LIMITS.default;
};

// Validate file based on field name
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.fieldname === "video" && !ALLOWED_MIME_TYPES.video.includes(file.mimetype)) {
    return cb(new ApiError(400, "Only video files are allowed for video field"));
  }

  if (
    (file.fieldname === "audio" || file.fieldname === "audioFile") &&
    !ALLOWED_MIME_TYPES.audio.includes(file.mimetype)
  ) {
    return cb(new ApiError(400, "Only audio files are allowed for audio field"));
  }

  if (
    (file.fieldname === "image" ||
      file.fieldname === "thumbnail" ||
      file.fieldname === "profilePicture") &&
    !ALLOWED_MIME_TYPES.image.includes(file.mimetype)
  ) {
    return cb(new ApiError(400, "Only image files are allowed for image field"));
  }

  cb(null, true);
};

/**
 * File Upload Middleware
 * Checks if user/request is international and routes to appropriate provider
 * @param isInternational - Boolean flag to determine upload provider
 * @returns Express middleware
 */
export const fileUploadMiddleware = (isInternational: boolean = true) => {
  const storage = new UniversalStorage(isInternational);

  return multer({
    storage,
    limits: {
      fileSize: FILE_SIZE_LIMITS.default,
    },
    fileFilter,
  });
};

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
export const dynamicFileUploadMiddleware = (fieldName: string | string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Get isInternational flag - prioritize req.body (frontend selection)
    const isInternational =
      req.body?.isInternational ??
      (req as any).user?.isInternational ??
      req.query?.isInternational ??
      true; 

    const storage = new UniversalStorage(Boolean(isInternational));
    const uploader = multer({
      storage,
      limits: {
        fileSize: getFileSizeLimit(Array.isArray(fieldName) ? fieldName[0] : fieldName),
      },
      fileFilter,
    });

    // Handle single or multiple fields
    if (Array.isArray(fieldName)) {
      uploader.fields(fieldName.map((fn) => ({ name: fn })))(req, res, next);
    } else {
      uploader.single(fieldName)(req, res, next);
    }
  };
};

/**
 * Static File Upload Middleware - for International users (Bunny)
 */
export const uploadToInternational = multer({
  storage: new UniversalStorage(true),
  limits: { fileSize: FILE_SIZE_LIMITS.default },
  fileFilter,
});

/**
 * Static File Upload Middleware - for Domestic users (Alibaba Cloud)
 */
export const uploadToDomestic = multer({
  storage: new UniversalStorage(false),
  limits: { fileSize: FILE_SIZE_LIMITS.default },
  fileFilter,
});
