import { Request, Response } from "express";
import CasoDocumento from "./casoDocumento.model";
import { actualizarEstadoCaso } from "../casos/caso.controller";
import Caso from "../casos/caso.model";
import path from "path";
import fs from "fs";


export const subirDocumento = async (req: Request, res: Response) => {
  try {
    const idDocumento = Number(req.params.id);
    const files = req.files as Express.Multer.File[];

    // const file = req.file as Express.Multer.File;

    if (isNaN(idDocumento)) {
      return res.status(400).json({ ok: false, mensaje: "ID inválido" });
    }
    // if (!file) {
    if (!files || files.length === 0) {
      return res.status(400).json({ ok: false, mensaje: "Archivo no enviado" });
    }

    const documento: any = await CasoDocumento.findByPk(idDocumento);

    if (!documento) {
      return res
        .status(404)
        .json({ ok: false, mensaje: "Documento no encontrado" });
    }
    // Tomamos el primer archivo para guardar en el documento

    // documento.ruta = file.path;
    // documento.tipo_archivo = file.mimetype;
    // documento.tamano_archivo = file.size;
    // documento.fecha_subida = new Date();
    // documento.estado_validacion = "en_revision";
    const primerArchivo = files[0];
    if (!primerArchivo) {
      return res.status(400).json({ ok: false, mensaje: "Archivo no enviado" });
    }
    documento.ruta = primerArchivo.path;

    documento.tipo_archivo = primerArchivo.mimetype;
    documento.tamano_archivo = primerArchivo.size;
    documento.fecha_subida = new Date();
    documento.estado_validacion = "en_revision";

    await documento.save();

    res.json({
      ok: true,
      documento,
      archivos: files.map((f) => ({ nombre: f.originalname, ruta: f.path })),
      mensaje: "Documento(s) subido(s) correctamente y en revisión",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, mensaje: "Error al subir documento" });
  }
};

// Aprobar o rechazar documento
export const validarDocumento = async (req: Request, res: Response) => {
  try {
    const idDocumento = Number(req.params.id);
    const { estado, comentarios } = req.body;

    if (isNaN(idDocumento)) {
      return res.status(400).json({ ok: false, mensaje: "ID inválido" });
    }

    // if (!['aprobado', 'rechazado'].includes(estado)) {
    //   return res.status(400).json({ ok: false, mensaje: "Estado inválido" });
    // }

    if (!["en_revision", "completado", "pendiente"].includes(estado)) {
      return res.status(400).json({ ok: false, mensaje: "Estado inválido" });
    }
    const documento: any = await CasoDocumento.findByPk(idDocumento);

    if (!documento) {
      return res
        .status(404)
        .json({ ok: false, mensaje: "Documento no encontrado" });
    }

    documento.estado_validacion = estado;
    documento.comentarios = comentarios || null;

    await documento.save();

    // Actualizar estado del caso automáticamente
    // await actualizarEstadoCaso(documento.id_caso);

    // res.json({
    //   ok: true,
    //   documento,
    //   mensaje: `Documento ${estado}`
    // });

    await actualizarEstadoCaso(documento.id_caso);

    const casoActualizado = await Caso.findByPk(documento.id_caso);

    res.json({
      ok: true,
      documento,
      caso: casoActualizado,
      mensaje: `Documento ${estado}`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, mensaje: "Error al validar documento" });
  }
};


// GET /api/caso-documentos/:id/ver
export const verDocumento = async (req: Request, res: Response) => {
  try {
    const idDocumento = Number(req.params.id);

    if (isNaN(idDocumento)) {
      return res.status(400).json({ ok: false, mensaje: "ID inválido" });
    }

    const documento: any = await CasoDocumento.findByPk(idDocumento);

    if (!documento || !documento.ruta) {
      return res.status(404).json({
        ok: false,
        mensaje: "Documento o archivo no encontrado",
      });
    }
    //Convierte la ruta a una ruta absoluta segura

    const rutaArchivo = path.resolve(documento.ruta);

    res.sendFile(rutaArchivo);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      mensaje: "Error al visualizar documento",
    });
  }
};

// DELETE /api/caso-documentos/:id
export const eliminarDocumento = async (req: Request, res: Response) => {
try {
  const idDocumento = Number(req.params.id);
   if (isNaN(idDocumento)) {
      return res.status(400).json({ ok: false, mensaje: "ID inválido" });
    }
        const documento: any = await CasoDocumento.findByPk(idDocumento);
 if (!documento) {
      return res.status(404).json({
        ok: false,
        mensaje: "Documento no encontrado",
      });
    }
      // borrar archivo físico si existe
    if (documento.ruta) {
      const rutaArchivo = path.resolve(documento.ruta);
      if (fs.existsSync(rutaArchivo)) {
        fs.unlinkSync(rutaArchivo);
      }
    }
     const idCaso = documento.id_caso;

    await documento.destroy();
   // recalcular estado del caso
    await actualizarEstadoCaso(idCaso);

    res.json({
      ok: true,
      mensaje: "Documento eliminado correctamente",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      mensaje: "Error al eliminar documento",
    });
  }
};