"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const appConfigSchema = new mongoose_1.Schema({
    cloudinary: {
        cloudName: { type: String },
        apiKey: { type: String },
        apiSecret: { type: String },
    },
    smtp: {
        host: { type: String },
        port: { type: Number },
        user: { type: String },
        pass: { type: String },
    },
    jwt: {
        accessExpiresIn: { type: String },
        refreshExpiresIn: { type: String },
    },
    frontendUrl: { type: String },
}, { timestamps: true });
const AppConfig = (0, mongoose_1.model)("AppConfig", appConfigSchema);
exports.default = AppConfig;
