import {Router} from 'express'
import {login, register} from '../controllers/authController.js'
//import { validateBody } from '../middleware/validation.js';
import { loginSchema, registerSchema } from '../models/auth.js';

const router = Router();
//todo validate body middleware
router.post('/register', register);
router.post('/login', login);

export default router;