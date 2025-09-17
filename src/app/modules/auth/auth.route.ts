import { Router } from 'express';
import validateRequest from '../../middleware/validateRequest.middleware';
import { checkAuth } from '../../middleware/CheckAuth';
import { UserRoles } from './auth.interface';
import { AuthController } from './auth.controller';
import { multerUpload } from '../../config/multer.config';

const router = Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/logout',checkAuth([UserRoles.ADMIN,UserRoles.INSTRUCTOR,UserRoles.SUPER_ADMIN,UserRoles.STUDENT]), AuthController.logout);
router.get('/me',checkAuth([UserRoles.ADMIN,UserRoles.INSTRUCTOR,UserRoles.SUPER_ADMIN,UserRoles.STUDENT]), AuthController.me);
router.put('/verify-otp', AuthController.verifyOtp);
router.post('/send-otp', AuthController.sendOtp);
router.post("/forget-password",AuthController.forgetPassword);
router.put("/reset-password",AuthController.resetPassword);
router.put("/update",checkAuth(),multerUpload.single("file"),AuthController.updateProfile);

export default router;
