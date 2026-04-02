"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const practice_controller_1 = require("./practice.controller");
const CheckAuth_1 = require("../../middleware/CheckAuth");
const auth_interface_1 = require("../auth/auth.interface");
const multer_config_1 = require("../../config/multer.config");
const rateLimiter_1 = require("../../middleware/rateLimiter");
const router = express_1.default.Router();
// ── Practice CRUD (admin/instructor) ───────────────────────────────────
router.post('/', (0, CheckAuth_1.checkAuth)([auth_interface_1.UserRoles.ADMIN, auth_interface_1.UserRoles.SUPER_ADMIN, auth_interface_1.UserRoles.INSTRUCTOR]), (0, rateLimiter_1.rateLimit)('write'), multer_config_1.multerUpload.single('file'), practice_controller_1.PracticeController.createPractice);
router.get('/', (0, CheckAuth_1.checkAuth)([auth_interface_1.UserRoles.ADMIN, auth_interface_1.UserRoles.SUPER_ADMIN, auth_interface_1.UserRoles.INSTRUCTOR]), (0, rateLimiter_1.rateLimit)('admin'), practice_controller_1.PracticeController.getAllPractices);
router.patch('/:id', (0, CheckAuth_1.checkAuth)([auth_interface_1.UserRoles.ADMIN, auth_interface_1.UserRoles.SUPER_ADMIN, auth_interface_1.UserRoles.INSTRUCTOR]), (0, rateLimiter_1.rateLimit)('write'), multer_config_1.multerUpload.single('file'), practice_controller_1.PracticeController.updatePractice);
router.delete('/:id', (0, CheckAuth_1.checkAuth)([auth_interface_1.UserRoles.ADMIN, auth_interface_1.UserRoles.SUPER_ADMIN, auth_interface_1.UserRoles.INSTRUCTOR]), (0, rateLimiter_1.rateLimit)('admin'), practice_controller_1.PracticeController.deletePractice);
// ── Student practice reads ───────────────────────────────────────────
router.get('/student', (0, CheckAuth_1.checkAuth)([auth_interface_1.UserRoles.STUDENT, auth_interface_1.UserRoles.ADMIN, auth_interface_1.UserRoles.SUPER_ADMIN, auth_interface_1.UserRoles.INSTRUCTOR]), (0, rateLimiter_1.rateLimit)('content'), practice_controller_1.PracticeController.getUserPractices);
router.get('/:slug/student', (0, CheckAuth_1.checkAuth)(), (0, rateLimiter_1.rateLimit)('content'), practice_controller_1.PracticeController.getPracticeByIdForUser);
router.get('/:id', (0, CheckAuth_1.checkAuth)(), (0, rateLimiter_1.rateLimit)('content'), practice_controller_1.PracticeController.getSinglePractice);
// ── Practice item management (admin/instructor) ────────────────────────
router.post('/items', (0, CheckAuth_1.checkAuth)([auth_interface_1.UserRoles.ADMIN, auth_interface_1.UserRoles.SUPER_ADMIN, auth_interface_1.UserRoles.INSTRUCTOR]), (0, rateLimiter_1.rateLimit)('write'), multer_config_1.multerUpload.fields([
    { name: 'audio', maxCount: 1 },
    { name: 'image', maxCount: 1 },
]), practice_controller_1.PracticeController.addItemToPractice);
router.patch('/:practiceId/items/:itemId', (0, CheckAuth_1.checkAuth)([auth_interface_1.UserRoles.ADMIN, auth_interface_1.UserRoles.SUPER_ADMIN, auth_interface_1.UserRoles.INSTRUCTOR]), (0, rateLimiter_1.rateLimit)('write'), multer_config_1.multerUpload.fields([
    { name: 'audio', maxCount: 1 },
    { name: 'image', maxCount: 1 },
]), practice_controller_1.PracticeController.updatePracticeItem);
router.delete('/:practiceId/items/:itemId', (0, CheckAuth_1.checkAuth)([auth_interface_1.UserRoles.ADMIN, auth_interface_1.UserRoles.SUPER_ADMIN, auth_interface_1.UserRoles.INSTRUCTOR]), (0, rateLimiter_1.rateLimit)('admin'), practice_controller_1.PracticeController.deletePracticeItem);
router.patch('/:practiceId/items/reorder', (0, CheckAuth_1.checkAuth)([auth_interface_1.UserRoles.ADMIN, auth_interface_1.UserRoles.SUPER_ADMIN, auth_interface_1.UserRoles.INSTRUCTOR]), (0, rateLimiter_1.rateLimit)('write'), practice_controller_1.PracticeController.reorderPracticeItems);
exports.default = router;
