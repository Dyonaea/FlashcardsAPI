import {Router} from 'express'
import {login, register, recover} from '../controllers/authController.js'
import { validateBody } from '../middleware/validation.js';
import { loginSchema, registerSchema} from '../models/auth.js';
import { authenticateToken } from '../middleware/authenticateToken.js';

const router = Router();
router.post('/register',validateBody(registerSchema), register);
router.post('/login',validateBody(loginSchema), login);
router.get('/', authenticateToken, recover)
export default router;