import { Router } from 'express';
import { crearCaso } from './caso.controller';
import { validateJWT } from "../../middlewares/validate-jwt";

const router = Router();

// Solo abogada o admin pueden crear casos
router.post('/', validateJWT, crearCaso);

export default router;
