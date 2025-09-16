import { Router } from 'express';
import validateRequest from '../../middleware/validateRequest.middleware';
import { checkAuth } from '../../middleware/CheckAuth';
import { UserRoles } from './auth.interface';
import { AuthController } from './auth.controller';

const router = Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/logout', AuthController.logout);
router.get('/me', AuthController.me);
router.put('/verify-otp', AuthController.verifyOtp);
router.post('/send-otp', AuthController.sendOtp);
router.post("/forget-password",AuthController.forgetPassword);
router.put("/reset-password",AuthController.resetPassword);

export default router;
