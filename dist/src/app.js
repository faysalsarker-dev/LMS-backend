"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const routes_1 = require("./app/routes");
const globalErrorHandler_1 = require("./app/middleware/globalErrorHandler");
const rateLimiter_1 = require("./app/middleware/rateLimiter");
const morgan_1 = __importDefault(require("morgan"));
const ApiError_1 = require("./app/errors/ApiError");
const app = (0, express_1.default)();
app.set('trust proxy', 1);
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: [
        "https://lms.faysalsarker.me",
        "https://humanisticlanguagecenter.com",
        "http://humanisticlanguagecenter.com",
        "http://localhost:5173"
    ],
    credentials: true,
}));
app.use((0, morgan_1.default)("dev"));
app.use(rateLimiter_1.globalRateLimiter);
app.get("/api/v1", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "Humanistic Language Center API is working....... check deployment pipeline v1",
    });
});
app.use("/api/v1", routes_1.router);
app.use((req, _res, next) => {
    next(new ApiError_1.ApiError(404, `Can't find ${req.originalUrl} on this server!`));
});
app.use(globalErrorHandler_1.globalErrorHandler);
exports.default = app;
