


import { Request, Response } from "express";
import CasoDocumento from "./casoDocumento.model";


export const subirDocumento = async (req: Request, res: Response) => {
  try {
    const idDocumento = Number(req.params.id);
    const file = req.file as Express.Multer.File;

    if (isNaN(idDocumento)) {
      return res.status(400).json({ ok: false, mensaje: "ID inválido" });
    }

    if (!file) {
      return res.status(400).json({ ok: false, mensaje: "Archivo no enviado" });
    }

    const documento: any = await CasoDocumento.findByPk(idDocumento);

    if (!documento) {
      return res.status(404).json({ ok: false, mensaje: "Documento no encontrado" });
    }

    documento.ruta = file.path;
    documento.tipo_archivo = file.mimetype;
    documento.tamano_archivo = file.size;
    documento.fecha_subida = new Date();
    documento.estado_validacion = "en_revision";

    await documento.save();

    res.json({
      ok: true,
      documento,
      mensaje: "Documento subido correctamente y en revisión"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, mensaje: "Error al subir documento" });
  }
};
