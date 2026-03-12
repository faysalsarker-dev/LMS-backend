import { Router } from "express";
import * as MockTestController from "./mockTest.controller";
import validateRequest from "../../middleware/validateRequest.middleware";
import {
  createMockTestSchema,
  updateMockTestSchema,
} from "./mockTest.validation";
import { checkAuth } from "../../middleware/CheckAuth";
import { multerUpload } from "../../config/multer.config";

const router = Router();

// Public routes
router.get("/", MockTestController.getAllMockTests);
router.get("/for-user", checkAuth(), MockTestController.getMocktestForUser);
router.get("/:slug", MockTestController.getMockTestBySlug);
router.get("/id/:id", MockTestController.getMockTestById);

// Protected routes (Admin / Instructor only in a real scenario, handled by checkAuth & roles)
router.post(
  "/",
  checkAuth(),
  multerUpload.single("thumbnail"),
  MockTestController.createMockTest,
);

router.put(
  "/:id",
  checkAuth(),
  multerUpload.single("thumbnail"),
  MockTestController.updateMockTest,
);

router.delete("/:id", checkAuth(), MockTestController.deleteMockTest);

export default router;
