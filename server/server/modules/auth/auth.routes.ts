

import { Router } from 'express';
import { login, changePassword } from './auth.controller';

const router = Router();

// LOGIN
// POST /api/auth/login
router.post('/login', login);

// CAMBIO DE CONTRASEÑA (CLIENTE)
// POST /api/auth/change-password
router.post('/change-password', changePassword);

export default router;
