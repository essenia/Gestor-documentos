import { Request, Response } from "express";
import CasoDocumento from "./casoDocumento.model";
import { actualizarEstadoCaso } from "../casos/caso.controller";
import Caso from "../casos/caso.model";
import path from "path";
import fs from "fs";
import TipoDocumento from "../tipoDocumento/tipoDocumento.model";


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

// POST /api/caso-documentos
// export const crearDocumento = async (req: Request, res: Response) => {
//   try {
//     const { id_caso, nombre, descripcion } = req.body;

//     if (!id_caso || !nombre) {
//       return res
//         .status(400)
//         .json({ ok: false, mensaje: "id_caso y nombre son obligatorios" });
//     }

//     // Crear documento en DB
//     const nuevoDocumento = await CasoDocumento.create({
//       id_caso,
//       nombre,
//       descripcion: descripcion || null,
//       estado_validacion: "pendiente", // estado inicial
//       fecha_subida: null, // aún no se sube archivo
//       ruta: null,
//       tipo_archivo: null,
//       tamano_archivo: null,
//       comentarios: null,
//     });

//     res.status(201).json({
//       ok: true,
//       documento: nuevoDocumento,
//       mensaje: "Documento creado correctamente",
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ ok: false, mensaje: "Error al crear documento" });
//   }
// };

// POST /api/caso-documentos
// export const crearDocumento = async (req: Request, res: Response) => {
//   try {
    
//     // const { id_caso, nombre, descripcion, es_obligatorio } = req.body;

//     // if (!id_caso || !nombre) {
//     //   return res
//     //     .status(400)
//     //     .json({ ok: false, mensaje: "id_caso y nombre son obligatorios" });
//     // }

//  const { id_caso, tipo_documento_id, nombre, descripcion, es_obligatorio } = req.body;

//     // Validaciones
//     if (!id_caso) {
//       return res.status(400).json({ msg: "El id del caso es obligatorio" });
//     }
//     if (!tipo_documento_id) {
//       return res.status(400).json({ msg: "Debe seleccionar un tipo de documento" });
//     }
//     if (!nombre) {
//       return res.status(400).json({ msg: "El nombre del documento es obligatorio" });
//     }


//     // Crear documento en DB
//     const nuevoDocumento = await CasoDocumento.create({
//       id_caso,
//       tipo_documento_id: null,       // ⚡ No hay tipo predefinido
//       nombre,                        // nombre ingresado por el usuario
//       descripcion: descripcion || null,
//       estado_validacion: "pendiente", // estado inicial
//       fecha_subida: null,            // aún no se sube archivo
//       ruta: null,
//       tipo_archivo: null,
//       tamano_archivo: null,
//       comentarios: null,
//       es_obligatorio: es_obligatorio ?? true, // si no viene, por defecto true
//     });

//     res.status(201).json({
//       ok: true,
//       documento: nuevoDocumento,
//       mensaje: "Documento creado correctamente",
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ ok: false, mensaje: "Error al crear documento" });
//   }
// };


export const crearDocumento = async (req: Request, res: Response) => {
  try {
    const {
      id_caso,
      tipo_documento_id,
      nuevo_tipo_nombre,
      nombre,
      descripcion,
      es_obligatorio
    } = req.body;

    // Validaciones básicas
    if (!id_caso) {
      return res.status(400).json({ msg: "El id del caso es obligatorio" });
    }

    if (!nombre) {
      return res.status(400).json({ msg: "El nombre del documento es obligatorio" });
    }

    let tipoId = tipo_documento_id;

    // Viene un tipo existente
    if (tipoId) {
      const tipoExistente = await TipoDocumento.findByPk(tipoId);
      if (!tipoExistente) {
        return res.status(400).json({ msg: "El tipo de documento seleccionado no existe" });
      }
    }
    const caso = await Caso.findByPk(id_caso);
if (!caso) {
  return res.status(400).json({ msg: "El caso seleccionado no existe" });
}

    

    //  No viene tipo pero viene nombre nuevo
    if (!tipoId && nuevo_tipo_nombre) {
      const tipoExistente = await TipoDocumento.findOne({
        where: { nombre: nuevo_tipo_nombre }
      });

      if (tipoExistente) {
        // tipoId = tipoExistente.id;
  tipoId = tipoExistente.getDataValue("id");

      } else {
        const nuevoTipo = await TipoDocumento.create({
          nombre: nuevo_tipo_nombre
        });

        tipoId = nuevoTipo.getDataValue("id");
      }
    }

    // ❌ Si después de todo no hay tipo → error
    if (!tipoId) {
      return res.status(400).json({
        msg: "Debe seleccionar un tipo de documento o ingresar uno nuevo"
      });
    }

    // 🚀 Crear documento
    const nuevoDocumento = await CasoDocumento.create({
      id_caso,
      tipo_documento_id: tipoId,
      nombre,
      descripcion: descripcion || null,
      estado_validacion: "pendiente",
      fecha_subida: null,
      ruta: null,
      tipo_archivo: null,
      tamano_archivo: null,
      comentarios: null,
      es_obligatorio: es_obligatorio ?? true
    });

    return res.status(201).json({
      ok: true,
      documento: nuevoDocumento,
      msg: "Documento creado correctamente"
    });

  } catch (error: any) {
  console.error("Error al crear documento:", error.message, error);
  return res.status(500).json({
    ok: false,
    msg: "Error al crear documento",
    error: error.message
  });
}
}


