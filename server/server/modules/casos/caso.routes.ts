import { Router } from 'express';
import { actualizarEstado, actualizarEstadoCaso, crearCaso, obtenerCasoPorId, obtenerDocumentosCaso, obtenerHistorialCaso, obtenerTodosCasos } from './caso.controller';
import { validateJWT } from "../../middlewares/validate-jwt";
import HistorialEstado from '../historialEstado/historialEstado.model';

const router = Router();

// Solo abogada o admin pueden crear casos
router.post('/', validateJWT, crearCaso);

router.get('/:id/documentos', obtenerDocumentosCaso);
router.get('/', obtenerTodosCasos);

router.get('/:id', obtenerCasoPorId);

// Actualizar estado de un caso
router.patch('/actualizar-estado/:id', validateJWT, actualizarEstado);

// Obtener historial de un caso
router.get('/historial/:id', validateJWT, obtenerHistorialCaso);

export default router;
