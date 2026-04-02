import express from 'express';
import { PracticeController } from './practice.controller';
import { checkAuth } from '../../middleware/CheckAuth';
import { UserRoles } from '../auth/auth.interface';
import { multerUpload } from '../../config/multer.config';
import { rateLimit } from '../../middleware/rateLimiter';

const router = express.Router();

// ── Practice CRUD (admin/instructor) ───────────────────────────────────
router.post(
  '/',
  checkAuth([UserRoles.ADMIN, UserRoles.SUPER_ADMIN, UserRoles.INSTRUCTOR]),
  rateLimit('write'),
  multerUpload.single('file'),
  PracticeController.createPractice,
);

router.get(
  '/',
  checkAuth([UserRoles.ADMIN, UserRoles.SUPER_ADMIN, UserRoles.INSTRUCTOR]),
  rateLimit('admin'),
  PracticeController.getAllPractices,
);

router.patch(
  '/:id',
  checkAuth([UserRoles.ADMIN, UserRoles.SUPER_ADMIN, UserRoles.INSTRUCTOR]),
  rateLimit('write'),
  multerUpload.single('file'),
  PracticeController.updatePractice,
);

router.delete(
  '/:id',
  checkAuth([UserRoles.ADMIN, UserRoles.SUPER_ADMIN, UserRoles.INSTRUCTOR]),
  rateLimit('admin'),
  PracticeController.deletePractice,
);

// ── Student practice reads ───────────────────────────────────────────
router.get(
  '/student',
  checkAuth([UserRoles.STUDENT, UserRoles.ADMIN, UserRoles.SUPER_ADMIN, UserRoles.INSTRUCTOR]),
  rateLimit('content'),
  PracticeController.getUserPractices,
);

router.get(
  '/:slug/student',
  checkAuth(),
  rateLimit('content'),
  PracticeController.getPracticeByIdForUser,
);

router.get(
  '/:id',
  checkAuth(),
  rateLimit('content'),
  PracticeController.getSinglePractice,
);

// ── Practice item management (admin/instructor) ────────────────────────
router.post(
  '/items',
  checkAuth([UserRoles.ADMIN, UserRoles.SUPER_ADMIN, UserRoles.INSTRUCTOR]),
  rateLimit('write'),
  multerUpload.fields([
    { name: 'audio', maxCount: 1 },
    { name: 'image', maxCount: 1 },
  ]),
  PracticeController.addItemToPractice,
);

router.patch(
  '/:practiceId/items/:itemId',
  checkAuth([UserRoles.ADMIN, UserRoles.SUPER_ADMIN, UserRoles.INSTRUCTOR]),
  rateLimit('write'),
  multerUpload.fields([
    { name: 'audio', maxCount: 1 },
    { name: 'image', maxCount: 1 },
  ]),
  PracticeController.updatePracticeItem,
);

router.delete(
  '/:practiceId/items/:itemId',
  checkAuth([UserRoles.ADMIN, UserRoles.SUPER_ADMIN, UserRoles.INSTRUCTOR]),
  rateLimit('admin'),
  PracticeController.deletePracticeItem,
);

router.patch(
  '/:practiceId/items/reorder',
  checkAuth([UserRoles.ADMIN, UserRoles.SUPER_ADMIN, UserRoles.INSTRUCTOR]),
  rateLimit('write'),
  PracticeController.reorderPracticeItems,
);

export default router;