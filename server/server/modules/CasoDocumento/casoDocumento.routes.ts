

import { Router } from "express";
import { subirDocumento } from "./casoDocumento.controller";
import upload from "../../middlewares/uploadFile";
import { validateJWT } from "../../middlewares/validate-jwt";


const router = Router();

// Subir archivo a un documento del checklist
router.patch("/:id/upload", validateJWT, upload.single("archivo"), subirDocumento);

export default router;
