import { Router } from "express";
import { getTramites } from "./tipoTramite.controller";

const router = Router();
router.get('/', getTramites);

export default router;