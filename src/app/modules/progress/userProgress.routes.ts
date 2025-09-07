import express from "express";
import { markItemComplete, getProgress } from "./userProgress.controller";

const router = express.Router();

router.patch("/complete", markItemComplete);

router.get("/:userId/:courseId", getProgress);

const UserProgressRoutes = router;

export default UserProgressRoutes;
