import { Router } from "express";
import * as milestoneController from "./milestone.controller";
import validateRequest from "../../middleware/validateRequest.middleware";
import { createMilestoneSchema, updateMilestoneSchema } from "./milestone.validation";

const router = Router();

router.post("/", validateRequest(createMilestoneSchema), milestoneController.createMilestone);
router.get("/", milestoneController.getAllMilestones);
router.get("/:id", milestoneController.getMilestone);
router.put("/:id", validateRequest(updateMilestoneSchema), milestoneController.updateMilestone);
router.delete("/:id", milestoneController.deleteMilestone);

export default router;
