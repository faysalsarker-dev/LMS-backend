import express from 'express';
import practiceController from './practice.controller';
// import { authenticate, authorize } from '../../middlewares/auth'; // Your auth middleware

const router = express.Router();

// Public routes
router.get('/', practiceController.getAllPractices);
router.get('/:id', practiceController.getPractice);

// Admin routes (add your auth middleware)
router.post('/', /* authenticate, authorize('admin'), */ practiceController.createPractice);
router.patch('/:id', /* authenticate, authorize('admin'), */ practiceController.updatePractice);
router.delete('/:id', /* authenticate, authorize('admin'), */ practiceController.deletePractice);

// Practice items management
router.post('/:id/items', /* authenticate, authorize('admin'), */ practiceController.addItems);
router.delete('/:id/items/:itemIndex', /* authenticate, authorize('admin'), */ practiceController.removeItem);
router.patch('/:id/items/:itemIndex', /* authenticate, authorize('admin'), */ practiceController.updateItem);

export default router;
