import { Router } from "express";
import { CategoryController } from "./category.controller";
import { multerUpload } from "../../config/multer.config";

const router = Router();

router.post("/",multerUpload.single('file') ,CategoryController.create);
router.get("/", CategoryController.getAll);
router.get("/:id", CategoryController.getById);
router.put("/:id",multerUpload.single('file'),CategoryController.update);
router.delete("/:id", CategoryController.delete);

export default router;
