import express from 'express';
import { PracticeController } from './practice.controller';
import { checkAuth } from '../../middleware/CheckAuth';
import { UserRoles } from '../auth/auth.interface';
import { multerUpload } from '../../config/multer.config';

const router = express.Router();

// Practice CRUD
router.post(
  '/',
  checkAuth([UserRoles.ADMIN, UserRoles.SUPER_ADMIN, UserRoles.INSTRUCTOR]),
  multerUpload.single('file'),
  PracticeController.createPractice
);

router.get(
  '/',
  checkAuth([UserRoles.ADMIN, UserRoles.SUPER_ADMIN, UserRoles.INSTRUCTOR]),
  PracticeController.getAllPractices
);
router.get(
  '/student',
  checkAuth([UserRoles.STUDENT,UserRoles.ADMIN, UserRoles.SUPER_ADMIN, UserRoles.INSTRUCTOR]),
  PracticeController.getUserPractices
);

router.patch(
  '/:id',
  checkAuth([UserRoles.ADMIN, UserRoles.SUPER_ADMIN, UserRoles.INSTRUCTOR]),
  multerUpload.single('file'),
  PracticeController.updatePractice
);

router.delete(
  '/:id',
  checkAuth([UserRoles.ADMIN, UserRoles.SUPER_ADMIN, UserRoles.INSTRUCTOR]),
  PracticeController.deletePractice
);

router.get(
  '/:slug/student',
  checkAuth(),
  PracticeController.getPracticeByIdForUser
);




router.get(
  '/:id',
  checkAuth(),
  PracticeController.getSinglePractice
);


// ============== NEW: Practice Item Management Routes ==============

// Add item to practice
router.post(
  '/items',
  checkAuth([UserRoles.ADMIN, UserRoles.SUPER_ADMIN, UserRoles.INSTRUCTOR]),
  multerUpload.fields([
    { name: 'audio', maxCount: 1 },
    { name: 'image', maxCount: 1 },
  ]),
  PracticeController.addItemToPractice
);

// Update practice item
router.patch(
  '/:practiceId/items/:itemId',
  checkAuth([UserRoles.ADMIN, UserRoles.SUPER_ADMIN, UserRoles.INSTRUCTOR]),
  multerUpload.fields([
    { name: 'audio', maxCount: 1 },
    { name: 'image', maxCount: 1 },
  ]),
  PracticeController.updatePracticeItem
);

// Delete practice item
router.delete(
  '/:practiceId/items/:itemId',
  checkAuth([UserRoles.ADMIN, UserRoles.SUPER_ADMIN, UserRoles.INSTRUCTOR]),
  PracticeController.deletePracticeItem
);

// Reorder practice items
router.patch(
  '/:practiceId/items/reorder',
  checkAuth([UserRoles.ADMIN, UserRoles.SUPER_ADMIN, UserRoles.INSTRUCTOR]),
  PracticeController.reorderPracticeItems
);

export default router;