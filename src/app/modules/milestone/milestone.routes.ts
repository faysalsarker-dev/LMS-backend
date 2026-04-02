import { Router } from "express";
import * as milestoneController from "./milestone.controller";
import { rateLimit } from "../../middleware/rateLimiter";

const router = Router();

// ── Milestone CRUD ────────────────────────────────────────────────
router.post("/",   rateLimit("write"),   milestoneController.createMilestone);
router.get("/",    rateLimit("content"), milestoneController.getAllMilestones);
router.get("/:id", rateLimit("content"), milestoneController.getMilestone);
router.put("/:id", rateLimit("write"),   milestoneController.updateMilestone);
router.delete("/:id", rateLimit("admin"), milestoneController.deleteMilestone);

export default router;
