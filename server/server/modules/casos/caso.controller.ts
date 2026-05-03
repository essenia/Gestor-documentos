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
import Notificacion from '../notificaciones/notificacion.model';

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
const nombre = (cliente as any ).nombre;
const apellido = (cliente as any ).apellido;
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
      fecha_creacion: new Date(),
        ultimo_recordatorio: null


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

    await Notificacion.create({
  id_usuario: id_abogada,
  id_caso: idCaso,
  tipo: 'sistema',
  titulo: '📂 Documentos pendientes',
  contenido: `El cliente ${nombre} ${apellido} aún no ha subido documentos`,

});
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
const html = `
  <div style="font-family: Arial; background:#f4f6f8; padding:20px;">
    <div style="max-width:600px; margin:auto; background:white; padding:20px; border-radius:10px;">
      
      <h2 style="color:#2c3e50;">📂 Nuevo Caso Creado</h2>

      <p>Hola <b>${nombre}</b>,</p>

      <p>Tu caso ha sido creado correctamente en el sistema.</p>

      <p style="background:#fff3cd; padding:10px; border-radius:5px;">
        ⚠️ Tienes documentos pendientes por subir.
      </p>

      <div style="text-align:center; margin:20px 0;">
        <a href="http://localhost:4200"
           style="background:#3498db; color:white; padding:10px 20px; text-decoration:none; border-radius:5px;">
          Acceder a la plataforma
        </a>
      </div>

      <hr/>

      <p style="font-size:12px; color:#999;">
        Sistema Legal © ${new Date().getFullYear()}
      </p>

    </div>
  </div>
`;
  await enviarEmail(
  //   "raouaacampus014@gmail.com",
  // "TEST SISTEMA",
  
   emailCliente,
    "📂 Nuevo caso creado - Documentos pendientes",
  html
  // "Documentos pendientes",
  // `
  //   <h2>Hola ${nombre}</h2>
  //   <p>Tienes documentos pendientes para tu caso.</p>
  //   <p>Accede a la plataforma para subirlos.</p>
  // `
  //   emailCliente,
  //   "Documentos pendientes",
  //   `
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
const emailCliente = (cliente as any).usuario?.email;

await Notificacion.create({
  id_usuario: id_abogada,
  id_caso: idCaso,
  tipo: 'email',
  titulo: '📧 Email enviado',
  contenido: 'Se ha enviado email al cliente',
  email_enviado_a: emailCliente
});
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


//reenviarEmailCaso
export const reenviarEmailCaso = async (req: Request, res: Response) => {
    console.log(" REENVIAR EMAIL HIT");
    const id_abogada = (res.locals.user as any).userId; // coincide con tu token

  try {
    const idCaso = Number(req.params.id); 

    const caso = await Caso.findByPk(idCaso, {
      include: [{
        model: Cliente,
    as: 'cliente',
        include: [User]
        
      }]
    });

    if (!caso) {
      return res.status(404).json({ message: "Caso no encontrado" });
    }

    const cliente = (caso as any).cliente;
    const email = cliente?.usuario?.email;
    const nombre = cliente?.nombre;

    if (!email) {
      return res.status(400).json({ message: "Sin email" });
    }

    // const html = `
    //   <h2>📂 Recordatorio de documentos</h2>
    //   <p>Hola ${nombre}</p>
    //   <p>Te reenviamos el acceso a tus documentos pendientes.</p>
    // `;
    const html = `
<div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:20px;">
  <div style="max-width:600px; margin:auto; background:white; padding:25px; border-radius:10px; box-shadow:0 2px 6px rgba(0,0,0,0.1);">
    
    <h2 style="color:#2c3e50; text-align:center;">
      📂 Recordatorio de Documentación Pendiente
    </h2>

    <p>Estimado/a <b>${nombre}</b>,</p>

    <p>
      Nos ponemos en contacto con usted desde <b> Menabogados</b> para recordarle que 
      actualmente dispone de <b>documentación pendiente</b> en su expediente.
    </p>

    <p style="background:#fff3cd; padding:12px; border-radius:6px; color:#856404;">
      ⚠️ Le recomendamos acceder a la plataforma y completar la subida de documentos lo antes posible 
      para poder continuar con la tramitación de su caso.
    </p>

    <div style="text-align:center; margin:25px 0;">
      <a href="http://localhost:4200"
         style="background:#3498db; color:white; padding:12px 25px; text-decoration:none; border-radius:6px; font-weight:bold;">
        Acceder a la plataforma
      </a>
    </div>

    <hr style="margin:20px 0;" />

    <p><b>Gracias por confiar en nosotros.</b></p>

    <p style="margin-top:15px;">
      📍 C/ Balmes 139, Piso 4 - 2A<br>
      🚇 Metro Diagonal / FGC Provença<br>
      📞 93 459 04 43 / 608 055 820<br>
      ✉️ menabogados@gmail.com
    </p>

    <p style="font-size:13px; color:#555;">
      🕒 <b>Atención presencial:</b> sólo con cita previa<br>
      Lunes a Viernes: 10:00 - 14:00<br>
      Lunes, Miércoles y Jueves: 16:00 - 19:00
    </p>

    <p style="font-size:12px; color:#999; text-align:center; margin-top:20px;">
      © ${new Date().getFullYear()} Secretaria Menabogados - Todos los derechos reservados
    </p>

  </div>
</div>
`;

    await enviarEmail(email, "Reenvío de documentos", html);
    await Notificacion.create({
  id_usuario: id_abogada,
  id_caso: idCaso,
  tipo: 'email',
  contenido: 'Se ha reenviado el email de documentos',
  email_enviado_a: email
});

    return res.json({ ok: true, message: "Email reenviado" });
// await Notificacion.create({
//   id_usuario: id_abogada,
//   id_caso: idCaso,
//   tipo: 'email',
//   titulo: '🔁 Recordatorio enviado',
//   contenido: 'Se ha reenviado el email de documentos',
//   email_enviado_a: email
// });
    

  } catch (error: any) {
  console.error(" ERROR REENVIAR:", error);

  return res.status(500).json({
    message: "Error",
    error: error.message
  });
}
};
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
