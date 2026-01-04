"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const errorConverter_1 = __importDefault(require("./app/errors/errorConverter"));
const errorHandler_middleware_1 = __importDefault(require("./app/middleware/errorHandler.middleware"));
const routes_1 = require("./app/routes");
const globalErrorHandler_1 = require("./app/middleware/globalErrorHandler");
const app = (0, express_1.default)();
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use((0, cors_1.default)({ origin: ["https://lms-web-app-sigma.vercel.app", "http://localhost:5173", "https://lms.bonikjewellers.com", "http://192.168.0.127:5173"], credentials: true }));
app.use("/api/v1", routes_1.router);
app.get("/", (req, res) => {
    res.status(200).json({
        message: "api is working....."
    });
});
app.use(globalErrorHandler_1.globalErrorHandler);
app.use(errorConverter_1.default);
app.use(errorHandler_middleware_1.default);
exports.default = app;
