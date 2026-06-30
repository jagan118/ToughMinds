import { Router } from 'express';
import { z } from 'zod';
import { AuthController } from './auth.controller.js';
import { registerSchema, loginSchema } from './auth.validation.js';
import { validate } from '../../middleware/validate.js';
import { authenticate } from '../../middleware/auth.js';

const router = Router();

const refreshSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required')
});

router.post('/register', validate(registerSchema), AuthController.register);
router.post('/login', validate(loginSchema), AuthController.login);
router.post('/refresh', validate(refreshSchema), AuthController.refresh);
router.post('/logout', AuthController.logout);
router.get('/me', authenticate, AuthController.getMe);

export default router;
