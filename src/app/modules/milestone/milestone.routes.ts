import { Router } from "express";
import * as milestoneController from "./milestone.controller";

const router = Router();

router.post("/",  milestoneController.createMilestone);
router.get("/", milestoneController.getAllMilestones);
router.get("/:id", milestoneController.getMilestone);
router.put("/:id", milestoneController.updateMilestone);
router.delete("/:id", milestoneController.deleteMilestone);

export default router;
