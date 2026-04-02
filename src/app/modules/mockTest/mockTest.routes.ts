import { Router } from "express";
import * as MockTestController from "./mockTest.controller";
import validateRequest from "../../middleware/validateRequest.middleware";
import {
  createMockTestSchema,
  updateMockTestSchema,
} from "./mockTest.validation";
import { checkAuth } from "../../middleware/CheckAuth";
import { multerUpload } from "../../config/multer.config";
import { rateLimit } from "../../middleware/rateLimiter";

const router = Router();

// ── Public reads ──────────────────────────────────────────────────
router.get("/",          rateLimit("content"), MockTestController.getAllMockTests);
router.get("/for-user",  checkAuth(), rateLimit("content"), MockTestController.getMocktestForUser);
router.get("/:slug",     rateLimit("content"), MockTestController.getMockTestBySlug);
router.get("/id/:id",   rateLimit("content"), MockTestController.getMockTestById);

// ── Admin / Instructor mutations ─────────────────────────────────────
router.post(
  "/",
  checkAuth(),
  rateLimit("write"),
  multerUpload.single("thumbnail"),
  MockTestController.createMockTest,
);

router.put(
  "/:id",
  checkAuth(),
  rateLimit("write"),
  multerUpload.single("thumbnail"),
  MockTestController.updateMockTest,
);

router.delete("/:id", checkAuth(), rateLimit("admin"), MockTestController.deleteMockTest);

export default router;
