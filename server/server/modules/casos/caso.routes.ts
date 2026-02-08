import { Router } from 'express';
import { crearCaso, obtenerCasoPorId, obtenerDocumentosCaso, obtenerTodosCasos } from './caso.controller';
import { validateJWT } from "../../middlewares/validate-jwt";

const router = Router();

// Solo abogada o admin pueden crear casos
router.post('/', validateJWT, crearCaso);

router.get('/:id/documentos', obtenerDocumentosCaso);
router.get('/', obtenerTodosCasos);

router.get('/:id', obtenerCasoPorId);


export default router;
