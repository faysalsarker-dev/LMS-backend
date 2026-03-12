import { Router } from "express";
import * as MockTestSectionController from "./mockTestSection.controller";
import { checkAuth } from "../../middleware/CheckAuth";
import validateRequest from "../../middleware/validateRequest.middleware";
import { createMockTestSectionSchema, updateMockTestSectionSchema } from "./mockTestSection.validation";

const router = Router();

// Routes for sections
router.get("/", MockTestSectionController.getAllMockTestSections);
router.get("/:id", MockTestSectionController.getMockTestSectionById);

router.post(
  "/",
  checkAuth(),
  MockTestSectionController.createMockTestSection
);

router.put(
  "/:id",
  checkAuth(),
  MockTestSectionController.updateMockTestSection
);


router.delete(
  "/:id",
  checkAuth(),
  MockTestSectionController.deleteMockTestSection
);

export default router;
