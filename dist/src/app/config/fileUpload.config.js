"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const bunny_config_1 = require("./bunny.config");
const alibabaCloud_config_1 = require("./alibabaCloud.config");
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
class UniversalStorage {
    constructor(isInternational = true) {
        this.isInternational = isInternational;
    }
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
                let publicUrl;
                // Route to appropriate provider based on isInternational flag
                if (this.isInternational) {
                    publicUrl = await (0, bunny_config_1.uploadBufferToBunny)(buffer, destinationPath, file.mimetype);
                }
                else {
                    publicUrl = await (0, alibabaCloud_config_1.uploadBufferToAlibaba)(buffer, destinationPath, file.mimetype);
                }
                console.log(`upload returned URL: ${publicUrl}`);
                cb(null, {
                    buffer,
                    size: buffer.length,
                    path: publicUrl,
                    destination: this.isInternational ? "bunny" : "alibaba",
                    filename: destinationPath,
                });
            }
            catch (error) {
                cb(error);
            }
        });
    }
    _removeFile(req, file, cb) {
        // Optional: implement file deletion logic if needed
        cb(null);
    }
}
exports.default = UniversalStorage;
