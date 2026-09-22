import { Router } from "express";
import { CategoryController } from "./category.controller";
import { dynamicFileUploadMiddleware } from "../../middleware/fileUpload.middleware";
import { checkAuth } from "../../middleware/CheckAuth";
import { UserRoles } from "../auth/auth.interface";

const router = Router();

router.post(
  "/",
  checkAuth([UserRoles.INSTRUCTOR, UserRoles.ADMIN, UserRoles.SUPER_ADMIN]),
  dynamicFileUploadMiddleware("file"),
  CategoryController.create,
);
router.get("/", CategoryController.getAll);
router.get("/select", CategoryController.getAllForSelecting);
router.get("/:id", CategoryController.getById);
router.put(
  "/:id",
  checkAuth([UserRoles.INSTRUCTOR, UserRoles.ADMIN, UserRoles.SUPER_ADMIN]),
  dynamicFileUploadMiddleware("file"),
  CategoryController.update,
);
router.delete(
  "/:id",
  checkAuth([UserRoles.ADMIN, UserRoles.SUPER_ADMIN]),
  CategoryController.delete,
);

export default router;
