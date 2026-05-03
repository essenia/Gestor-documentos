import { Router } from "express";
import {
  obtenerNotificaciones,
  contarNoLeidas,
  marcarComoLeida
} from "../notificaciones/notificacion.controller";
import { validateJWT } from "../../middlewares/validate-jwt";

const router = Router();
router.get('/', validateJWT,obtenerNotificaciones);
router.get("/no-leidas",validateJWT, contarNoLeidas);
router.patch("/:id/leida",validateJWT, marcarComoLeida);

export default router;