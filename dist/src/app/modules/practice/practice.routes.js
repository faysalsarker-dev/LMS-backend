"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const practice_controller_1 = __importDefault(require("./practice.controller"));
// import { authenticate, authorize } from '../../middlewares/auth'; // Your auth middleware
const router = express_1.default.Router();
// Public routes
router.get('/', practice_controller_1.default.getAllPractices);
router.get('/:id', practice_controller_1.default.getPractice);
// Admin routes (add your auth middleware)
router.post('/', /* authenticate, authorize('admin'), */ practice_controller_1.default.createPractice);
router.patch('/:id', /* authenticate, authorize('admin'), */ practice_controller_1.default.updatePractice);
router.delete('/:id', /* authenticate, authorize('admin'), */ practice_controller_1.default.deletePractice);
// Practice items management
router.post('/:id/items', /* authenticate, authorize('admin'), */ practice_controller_1.default.addItems);
router.delete('/:id/items/:itemIndex', /* authenticate, authorize('admin'), */ practice_controller_1.default.removeItem);
router.patch('/:id/items/:itemIndex', /* authenticate, authorize('admin'), */ practice_controller_1.default.updateItem);
exports.default = router;
