import { Router } from 'express';
import { AuthController } from './auth.controller';
import validateRequest from '../../middleware/validateRequest.middleware';
import { AuthValidation } from './auth.validation';
import { checkAuth } from '../../middleware/CheckAuth';
import { UserRoles } from './auth.interface';

const router = Router();

router.post('/register', validateRequest(AuthValidation.register), AuthController.register);
router.post('/login', validateRequest(AuthValidation.login), AuthController.login);
router.post('/logout', AuthController.logout);
// router.get('/me', checkAuth([...UserRoles.ADMIN,UserRoles.DRIVER,UserRoles.RIDER]), AuthController.me);
// router.put('/update', checkAuth([...UserRoles.ADMIN,UserRoles.DRIVER,UserRoles.RIDER]), AuthController.update);
// router.put('/change-password', checkAuth([...UserRoles.ADMIN,UserRoles.DRIVER,UserRoles.RIDER]), AuthController.changePassword);
// router.put('/driver-online', checkAuth([...UserRoles.ADMIN,UserRoles.DRIVER,UserRoles.RIDER]), AuthController.driverOnline);

export default router;
