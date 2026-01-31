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
const router = express_1.default.Router();
// Practice CRUD
router.post('/', (0, CheckAuth_1.checkAuth)([auth_interface_1.UserRoles.ADMIN, auth_interface_1.UserRoles.SUPER_ADMIN, auth_interface_1.UserRoles.INSTRUCTOR]), multer_config_1.multerUpload.single('file'), practice_controller_1.PracticeController.createPractice);
router.get('/', (0, CheckAuth_1.checkAuth)([auth_interface_1.UserRoles.ADMIN, auth_interface_1.UserRoles.SUPER_ADMIN, auth_interface_1.UserRoles.INSTRUCTOR]), practice_controller_1.PracticeController.getAllPractices);
router.patch('/:id', (0, CheckAuth_1.checkAuth)([auth_interface_1.UserRoles.ADMIN, auth_interface_1.UserRoles.SUPER_ADMIN, auth_interface_1.UserRoles.INSTRUCTOR]), multer_config_1.multerUpload.single('file'), practice_controller_1.PracticeController.updatePractice);
router.delete('/:id', (0, CheckAuth_1.checkAuth)([auth_interface_1.UserRoles.ADMIN, auth_interface_1.UserRoles.SUPER_ADMIN, auth_interface_1.UserRoles.INSTRUCTOR]), practice_controller_1.PracticeController.deletePractice);
router.get('/:id', (0, CheckAuth_1.checkAuth)(), practice_controller_1.PracticeController.getSinglePractice);
// ============== NEW: Practice Item Management Routes ==============
// Add item to practice
router.post('/items', (0, CheckAuth_1.checkAuth)([auth_interface_1.UserRoles.ADMIN, auth_interface_1.UserRoles.SUPER_ADMIN, auth_interface_1.UserRoles.INSTRUCTOR]), multer_config_1.multerUpload.fields([
    { name: 'audio', maxCount: 1 },
    { name: 'image', maxCount: 1 },
]), practice_controller_1.PracticeController.addItemToPractice);
// Update practice item
router.patch('/:practiceId/items/:itemId', (0, CheckAuth_1.checkAuth)([auth_interface_1.UserRoles.ADMIN, auth_interface_1.UserRoles.SUPER_ADMIN, auth_interface_1.UserRoles.INSTRUCTOR]), multer_config_1.multerUpload.fields([
    { name: 'audio', maxCount: 1 },
    { name: 'image', maxCount: 1 },
]), practice_controller_1.PracticeController.updatePracticeItem);
// Delete practice item
router.delete('/:practiceId/items/:itemId', (0, CheckAuth_1.checkAuth)([auth_interface_1.UserRoles.ADMIN, auth_interface_1.UserRoles.SUPER_ADMIN, auth_interface_1.UserRoles.INSTRUCTOR]), practice_controller_1.PracticeController.deletePracticeItem);
// Reorder practice items
router.patch('/:practiceId/items/reorder', (0, CheckAuth_1.checkAuth)([auth_interface_1.UserRoles.ADMIN, auth_interface_1.UserRoles.SUPER_ADMIN, auth_interface_1.UserRoles.INSTRUCTOR]), practice_controller_1.PracticeController.reorderPracticeItems);
exports.default = router;
