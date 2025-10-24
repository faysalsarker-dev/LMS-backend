"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ApiError_1 = require("../errors/ApiError");
const errorHandler = (err, req, res, next) => {
    console.error(err);
    const statusCode = err instanceof ApiError_1.ApiError ? err.statusCode : 500;
    const message = err instanceof ApiError_1.ApiError ? err.message : "Internal Server Error";
    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
};
exports.default = errorHandler;
