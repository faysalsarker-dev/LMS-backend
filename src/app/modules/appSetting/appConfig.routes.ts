import express from "express";
import * as AppConfigController from "./appConfig.controller";

const router = express.Router();


router.get("/", AppConfigController.getConfig);

router.post("/", AppConfigController.createConfig);

router.put("/:id", AppConfigController.updateConfig);


export default router;
