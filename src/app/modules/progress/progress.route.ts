import express from "express";
import * as ProgressController from "./progress.controller";

const router = express.Router();

router.post("/complete", ProgressController.markCompleteController);
router.post("/incomplete", ProgressController.markIncompleteController);
router.get("/", ProgressController.getProgressController);

export default router;
