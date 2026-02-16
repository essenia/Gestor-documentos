

import { Router } from "express";
import { crearDocumento, eliminarDocumento, subirDocumento, validarDocumento, verDocumento } from "./casoDocumento.controller";
import upload from "../../middlewares/uploadFile";
import { validateJWT } from "../../middlewares/validate-jwt";


const router = Router();
router.post("/", crearDocumento);

// Subir archivo a un documento del checklist

// router.patch("/:id/upload", validateJWT, upload.single("archivo"), subirDocumento);
router.patch("/:id/upload", validateJWT, upload.array("archivo",15), subirDocumento);

//validar Docs 
router.patch("/:id/validar", validateJWT, validarDocumento);
// router.delete("/api/caso-documentos/:id", eliminarDocumento);
router.delete("/:id", validateJWT, eliminarDocumento);


router.get("/ver/:id", verDocumento);


export default router;
