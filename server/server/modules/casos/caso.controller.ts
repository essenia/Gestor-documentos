// import { enviarEmail } from './../../services/email.service';



import { Request, response, Response } from 'express';
import Caso from './caso.model';
import Cliente from '../cliente/cliente.model';
import TipoCasoDocumento from '../tipoCasoDocumento/tipoCasoDocumento.model';
import CasoDocumento from '../CasoDocumento/casoDocumento.model';
import TipoDocumento from '../tipoDocumento/tipoDocumento.model';
import TipoTramite from '../tipoTramite/tipoTramite.model';
import { Op } from 'sequelize';
import HistorialEstado from '../historialEstado/historialEstado.model';
import  { enviarEmail } from '../../services/email.service';
 import User from '../users/user.model';

// bfzw ukrt zjtu mdkd



//crear Caso
export const crearCaso = async (req:Request, res: Response)=>{
try {
      console.log("BODY RECIBIDO:", req.body);
    console.log("TIPO TRAMITE:", typeof req.body.tipo_tramite_id);
    console.log("USER:", res.locals.user);
    const {id_cliente, tipo_tramite_id} = req.body;
const id_abogada = (res.locals.user as any).userId; // coincide con tu token
  //Buscar cliente para obtener DNI
// const cliente = await Cliente.findByPk(id_cliente);
 //  TRAER CLIENTE CON EMAIL (USER)
 const cliente = await Cliente.findByPk(id_cliente, {
  include: [{ model: User }]
});
if(!cliente){
    return res.status(404).json({
        ok:false,
        mensaje :'Cliente no existe'
    });
}
const dni = (cliente as any ).dni;
const añoActual = new Date().getFullYear();
//generar código de caso
const cod_caso = `${dni}-${añoActual}`;

// Número de expediente incremental por año
    const totalCasosEsteAnio = await Caso.count({
      where: { año: añoActual }
    });

    const num_expediente = `${añoActual}-${totalCasosEsteAnio + 1}`;
    //Crear el Caso
    const nuevoCaso = await Caso.create({
id_cliente,
id_abogada,
tipo_tramite_id,
      estado: 'pendiente_documentos',
 cod_caso,
      num_expediente,
      año: añoActual,
      fecha_creacion: new Date()

    });
  

        const idCaso = nuevoCaso.get('id');
    //  Crear checklist de documentos automáticamente....

    //buscar documentos base del tipo de trámite
    const documentosBase = await TipoCasoDocumento.findAll({
              where: { tipo_tramite_id }
 });
 if (documentosBase.length === 0) {
  return res.status(400).json({
    ok: false,
    mensaje: 'Este tipo de trámite no tiene documentos configurados'
  });
}

 //map crea un nuevo array (documentosCaso) transformando cada elemento
 const documentosCaso  = documentosBase.map((doc: any)=>({
  id_caso: idCaso,
      tipo_documento_id: doc.tipo_documento_id,
      es_obligatorio: doc.es_obligatorio,
      fecha_caducidad: doc.caducidad,
      comentarios: doc.comentarios,
      estado_validacion: 'pendiente',
      ruta: null,
      tipo_archivo: null,
      tamano_archivo: null,
      fecha_subida: null


 }));
 //Inserta todos los documentos en una sola consulta SQL.
     await CasoDocumento.bulkCreate(documentosCaso);
// traer documentos con nombre
    const documentosCreados = await CasoDocumento.findAll({
      where: { id_caso: idCaso },
      include: [{ model: TipoDocumento, attributes: ['nombre'] }]
    });
    //    ENVIAR EMAIL AL CLIENTE
try {

  const cliente = await Cliente.findByPk(id_cliente, {
  include: [{ model: User }]
});

// const emailCliente = (cliente as any).User?.email;
const emailCliente = (cliente as any).usuario?.email;
const nombre = (cliente as any).nombre;

if (!emailCliente) {
  console.log("❌ Cliente sin email");
  return;
}

  // const emailCliente = (cliente as any).User?.email;
  // const nombre = (cliente as any).nombre;

  console.log("EMAIL DEL CLIENTE:", emailCliente);


  console.log("ENVIANDO EMAIL...");

  await enviarEmail(
    
  //   "raouaacampus014@gmail.com",
  // "TEST SISTEMA",
  // "<h1>Funciona 🚀</h1>"
   emailCliente,
  "Documentos pendientes",
  `
    <h2>Hola ${nombre}</h2>
    <p>Tienes documentos pendientes para tu caso.</p>
    <p>Accede a la plataforma para subirlos.</p>
  `
    // emailCliente,
    // "Documentos pendientes",
    // `
    //   <h2>Hola ${nombre}</h2>
    //   <p>Tienes documentos pendientes para tu caso.</p>
    //   <p>Accede a la plataforma para subirlos.</p>
    // `
  );

  console.log("EMAIL ENVIADO OK");
} catch (error) {
  console.error("Error enviando email:", error);
}
console.log("EMAIL CLIENTE:", (cliente as any)?.usuario?.email);
    // console.log("EMAIL CLIENTE:", (cliente as any)?.email);
 res.status(201).json({
      ok: true,
      caso: nuevoCaso,
      documentos: documentosCreados,
      mensaje: 'Caso creado con checklist documental automático'
    });


} catch (error) {
  console.error('Error al crear caso:', error);
    res.status(500).json({
        ok: false,
        mensaje: 'Error al Crear Caso..',
        error: (error as any).message  // <--- esto nos dice el mensaje real
    });
}}

/// obtener todos los casos 


export const obtenerTodosCasos = async (req: Request, res: Response) => {
  try {
    const casos = await Caso.findAll({
      include: [
        { model: Cliente, as: 'cliente', attributes: ['id', 'nombre', 'apellido', 'dni'] },
        { model: TipoTramite, as: 'tipoTramite', attributes: ['id', 'descripcion', 'area'] },
        {
          model: CasoDocumento,
          as: 'documentos',
          include: [
            { model: TipoDocumento, as: 'tipoDocumento', attributes: ['id', 'nombre'] }
          ]
        }
      ],
      order: [
        ['id', 'ASC'],
        [{ model: CasoDocumento, as: 'documentos' }, 'id', 'ASC']
      ]
    });

    res.json({
      ok: true,
      total: casos.length,
      casos
    });

  } catch (error) {
    console.error('Error al obtener todos los casos:', error);
    res.status(500).json({
      ok: false,
      mensaje: 'Error al obtener todos los casos',
      error: (error as any).message
    });
  }
};
// GET /api/casos/:id
export const obtenerCasoPorId = async (req: Request, res: Response) => {
  try {
    const idCaso = Number(req.params.id);

    if (isNaN(idCaso)) {
      return res.status(400).json({
        ok: false,
        mensaje: 'ID de caso inválido'
      });
    }

   const caso = await Caso.findByPk(idCaso, {
  include: [
    { model: Cliente, as: 'cliente' },
    { model: TipoTramite, as: 'tipoTramite' },
    {
      model: CasoDocumento,
      as: 'documentos',
      include: [
        { model: TipoDocumento, as: 'tipoDocumento' }
      ]
    }
  ]
});

    if (!caso) {
      return res.status(404).json({
        ok: false,
        mensaje: 'Caso no encontrado'
      });
    }

    res.json({
      ok: true,
      caso
    });

  } catch (error) {
    console.error('Error al obtener caso:', error);
    res.status(500).json({
      ok: false,
      mensaje: 'Error al obtener el caso'
    });
  }
};

//*********** */


/**
 * Actualiza el estado de un caso según sus documentos obligatorios
 * @param idCaso ID del caso a verificar
 */
export const actualizarEstadoCaso = async (idCaso: number) => {
  try {
    //  Traer todos los documentos del caso
    const documentos: any[] = await CasoDocumento.findAll({

    // const documentos = await CasoDocumento.findAll({
      where: { id_caso: idCaso }
    });




    if (documentos.length === 0) return;

    console.log(" Docs del caso:", documentos.map(d => ({
      id: d.id,
      obligatorio: d.es_obligatorio,
      estado: d.estado_validacion
    })));

    //  detectar obligatorios correctamente
    const obligatorios = documentos.filter(doc => doc.es_obligatorio === true);

    if (obligatorios.length === 0) return;

    const todosAprobados = obligatorios.every(
      doc => doc.estado_validacion === "completado"
    );

    console.log(" Todos obligatorios completados?", todosAprobados);

    if (todosAprobados) {
      await Caso.update(
        { estado: "en_tramite" },
        { where: { id: idCaso } }
      );

      console.log(" CASO ACTUALIZADO A EN_TRAMITE");
    }

  } catch (error) {
    console.error("Error actualizando estado del caso:", error);
  }
};


//   Actualizar Datos
export const actualizarCaso = async (req: Request, res: Response) => {
  try {
    const idCaso = Number(req.params.id);

    if (isNaN(idCaso)) {
      return res.status(400).json({
        ok: false,
        mensaje: 'ID inválido'
      });
    }

    const {
      id_cliente,
      tipo_tramite_id,
      num_expediente,
      cod_caso
    } = req.body;

    const caso = await Caso.findByPk(idCaso);

    if (!caso) {
      return res.status(404).json({
        ok: false,
        mensaje: 'Caso no encontrado'
      });
    }

    //   el estado  lo dejo tal como estaba
    await caso.update({
      id_cliente,
      tipo_tramite_id,
      num_expediente,
      cod_caso
    });

    return res.json({
      ok: true,
      mensaje: 'Caso actualizado correctamente',
      caso
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      mensaje: 'Error al actualizar caso'
    });
  }
};

///******************************** */

// Obtener documentos de un caso
export const obtenerDocumentosCaso = async (req: Request, res: Response) => {
  try {
   // Obtener el ID del caso desde la URL
    const idCaso = Number(req.params.id);
//Verifica si el valor no es un número
    if (isNaN(idCaso)) {
      return res.status(400).json({ ok: false, mensaje: "ID de caso inválido" });
    }
//Busca todos los documentos relacionados con el caso
    const documentos = await CasoDocumento.findAll({
      where: { id_caso: idCaso },
      include: [{ model: TipoDocumento, attributes: ['nombre'] }]
    });
//Devuelve la información en formato JSON.
    res.json({
      ok: true,
      idCaso,
      documentos
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, mensaje: "Error al obtener documentos del caso" });
  }
};


// export const actualizarEstado =  async (req: Request, res: Response) => {
 
//   const id = Number(req.params.id);
//   const { nuevoEstado } = req.body;

//   try {
//     await Caso.update(
//       {
//         estado: nuevoEstado,
//         fecha_estado: new Date()
//       },
//       { where: { id } }
//     );

//     res.json({ ok: true });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ ok: false });
//   }
// }




export const actualizarEstado = async (req: Request, res: Response) => {
  try {
    const casoId = Number(req.params.id);
    const { nuevoEstado } = req.body;
    const userId = (res.locals.user as any).userId; 

    if (!nuevoEstado) {
      return res.status(400).json({ ok: false, msg: 'Nuevo estado requerido' });
    }

    const caso = await Caso.findByPk(casoId);
    if (!caso) return res.status(404).json({ ok: false, msg: 'Caso no encontrado' });

    const estadoAnterior = caso.getDataValue('estado');

    // Actualizar estado y fecha
    caso.setDataValue('estado', nuevoEstado);
    caso.setDataValue('fecha_estado', new Date());
    await caso.save();

    // Guardar historial
    await HistorialEstado.create({
  
      caso_id: caso.getDataValue('id'),   
  estado_anterior: estadoAnterior,
  estado_nuevo: nuevoEstado,
  fecha_cambio: new Date(),
  usuario_id: userId 
    });
   return res.json({ ok: true, msg: 'Estado actualizado', caso });

  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: 'Error al actualizar estado' });
  }
}

// GET /casos/historial/:id
export const obtenerHistorialCaso = async (req: Request, res: Response) => {
 try {
    const casoId = Number(req.params.id);

    const historial = await HistorialEstado.findAll({
      where: { caso_id: casoId },  // ⚠ aquí debe ser caso_id
      order: [['fecha_cambio', 'DESC']]
    });

    return res.json({ ok: true, historial });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: 'Error al obtener historial' });
  }
};
