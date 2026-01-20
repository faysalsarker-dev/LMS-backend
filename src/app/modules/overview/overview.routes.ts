import { Router } from "express";
import AdminDashboardController from "./overview.controller";
import { checkAuth } from "../../middleware/CheckAuth";
import { UserRoles } from "../auth/auth.interface";


const router = Router();


router.get("/dashboard",checkAuth([UserRoles.SUPER_ADMIN]), AdminDashboardController.getDashboard);

export default router;
