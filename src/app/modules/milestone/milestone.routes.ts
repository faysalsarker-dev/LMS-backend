import { Router } from "express";
import * as milestoneController from "./milestone.controller";
import { rateLimit } from "../../middleware/rateLimiter";
import { checkAuth } from "../../middleware/CheckAuth";
import { UserRoles } from "../auth/auth.interface";

const router = Router();

// ── Milestone CRUD ────────────────────────────────────────────────
router.post(
  "/",
  checkAuth([UserRoles.INSTRUCTOR, UserRoles.ADMIN, UserRoles.SUPER_ADMIN]),
  rateLimit("write"),
  milestoneController.createMilestone,
);
router.get("/",    rateLimit("content"), milestoneController.getAllMilestones);
router.get("/:id", rateLimit("content"), milestoneController.getMilestone);
router.put(
  "/:id",
  checkAuth([UserRoles.INSTRUCTOR, UserRoles.ADMIN, UserRoles.SUPER_ADMIN]),
  rateLimit("write"),
  milestoneController.updateMilestone,
);
router.delete(
  "/:id",
  checkAuth([UserRoles.ADMIN, UserRoles.SUPER_ADMIN]),
  rateLimit("admin"),
  milestoneController.deleteMilestone,
);

export default router;
