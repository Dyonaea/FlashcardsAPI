import {Router} from 'express'
import { adminAuthenticateToken } from '../middleware/authenticateToken.js';
import { getAllUsers, getUserById } from '../controllers/userController.js';
import { validateParam } from '../middleware/validation.js';
import { userIdSchema } from '../model/user.js';

const router = Router();
router.use(adminAuthenticateToken)
router.get('/', getAllUsers)
router.get('/:id', validateParam(userIdSchema), getUserById)
export default router