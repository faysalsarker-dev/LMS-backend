import { Router } from "express";
import * as MockTestSectionController from "./mockTestSection.controller";
import { checkAuth } from "../../middleware/CheckAuth";


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
