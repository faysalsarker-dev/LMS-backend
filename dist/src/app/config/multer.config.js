"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.multerVideoUpload = exports.multerUpload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const bunny_config_1 = require("./bunny.config");
const ApiError_1 = require("../errors/ApiError");
const sanitizeFileName = (name) => name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/\./g, "-")
    .replace(/[^a-z0-9\-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
const getFolderForField = (fieldname, mimetype) => {
    if (fieldname === "video")
        return "videos";
    if (fieldname === "audio" || fieldname === "audioFile")
        return "audio";
    if (mimetype.startsWith("image/"))
        return "images";
    return "uploads";
};
const buildDestinationPath = (file) => {
    const extension = path_1.default.extname(file.originalname) || "";
    const baseName = sanitizeFileName(path_1.default.basename(file.originalname, extension));
    const folder = getFolderForField(file.fieldname, file.mimetype);
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}-${baseName}${extension}`;
    return `${folder}/${uniqueName}`;
};
class BunnyStorage {
    _handleFile(req, file, cb) {
        const chunks = [];
        file.stream.on("data", (chunk) => {
            chunks.push(chunk);
        });
        file.stream.on("error", (error) => cb(error));
        file.stream.on("end", async () => {
            try {
                const buffer = Buffer.concat(chunks);
                const destinationPath = buildDestinationPath(file);
                const publicUrl = await (0, bunny_config_1.uploadBufferToBunny)(buffer, destinationPath, file.mimetype);
                cb(null, {
                    buffer,
                    size: buffer.length,
                    path: publicUrl,
                    filename: destinationPath,
                    mimetype: file.mimetype,
                });
            }
            catch (error) {
                cb(new ApiError_1.ApiError(500, `Failed to upload file to Bunny.net: ${error.message}`));
            }
        });
    }
    _removeFile(req, file, cb) {
        cb(null);
    }
}
const bunnyStorage = new BunnyStorage();
exports.multerUpload = (0, multer_1.default)({ storage: bunnyStorage });
exports.multerVideoUpload = (0, multer_1.default)({
    storage: bunnyStorage,
    limits: {
        fileSize: 300 * 1024 * 1024,
    },
});
