import { Router } from "express";
import { getConfig, createConfig, updateConfig } from "./appConfig.controller";

const router = Router();


router.get("/", getConfig);
router.post("/", createConfig);
router.put("/", updateConfig);

export default router;
