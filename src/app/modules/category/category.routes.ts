import { Router } from "express";
import { CategoryController } from "./category.controller";
import { dynamicFileUploadMiddleware } from "../../middleware/fileUpload.middleware";

const router = Router();

router.post("/",dynamicFileUploadMiddleware('file'),CategoryController.create);
router.get("/", CategoryController.getAll);
router.get("/select", CategoryController.getAllForSelecting);
router.get("/:id", CategoryController.getById);
router.put("/:id",dynamicFileUploadMiddleware('file'),CategoryController.update);
router.delete("/:id", CategoryController.delete);

export default router;
