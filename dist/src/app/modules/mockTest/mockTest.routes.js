"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const MockTestController = __importStar(require("./mockTest.controller"));
const CheckAuth_1 = require("../../middleware/CheckAuth");
const fileUpload_middleware_1 = require("../../middleware/fileUpload.middleware");
const rateLimiter_1 = require("../../middleware/rateLimiter");
const router = (0, express_1.Router)();
// ── Public reads ──────────────────────────────────────────────────
router.get("/", (0, rateLimiter_1.rateLimit)("content"), MockTestController.getAllMockTests);
router.get("/for-user", (0, CheckAuth_1.checkAuth)(), (0, rateLimiter_1.rateLimit)("content"), MockTestController.getMocktestForUser);
router.get("/:slug", (0, rateLimiter_1.rateLimit)("content"), MockTestController.getMockTestBySlug);
router.get("/id/:id", (0, rateLimiter_1.rateLimit)("content"), MockTestController.getMockTestById);
// ── Admin / Instructor mutations ─────────────────────────────────────
router.post("/", (0, CheckAuth_1.checkAuth)(), (0, rateLimiter_1.rateLimit)("write"), (0, fileUpload_middleware_1.dynamicFileUploadMiddleware)("thumbnail"), MockTestController.createMockTest);
router.put("/:id", (0, CheckAuth_1.checkAuth)(), (0, rateLimiter_1.rateLimit)("write"), (0, fileUpload_middleware_1.dynamicFileUploadMiddleware)("thumbnail"), MockTestController.updateMockTest);
router.delete("/:id", (0, CheckAuth_1.checkAuth)(), (0, rateLimiter_1.rateLimit)("admin"), MockTestController.deleteMockTest);
exports.default = router;
