"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendResponse = (res, payload) => {
    res.status(payload.statusCode).json({
        success: payload.success,
        message: payload.message,
        data: payload.data ?? null,
        meta: payload.meta ?? null
    });
};
exports.default = sendResponse;
