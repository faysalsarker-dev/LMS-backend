import express from "express";
import { ModuleController } from "./module.controller";
import { createModuleSchema, updateModuleSchema } from "./module.validation";
import validateRequest from "../../middleware/validateRequest.middleware";

const router = express.Router();

router.post(
  "/",
  validateRequest(createModuleSchema),
  ModuleController.createModule
);

router.get("/", ModuleController.getAllModules);

router.get("/:id", ModuleController.getModuleById);

router.put(
  "/:id",
  validateRequest(updateModuleSchema),
  ModuleController.updateModule
);

router.delete("/:id", ModuleController.deleteModule);

export default router;
