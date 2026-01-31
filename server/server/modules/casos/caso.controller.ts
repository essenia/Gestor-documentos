


import { Request, Response } from 'express';
import Caso from './caso.model';
import Cliente from '../cliente/cliente.model';
import TipoCasoDocumento from '../tipoCasoDocumento/tipoCasoDocumento.model';
import CasoDocumento from '../CasoDocumento/casoDocumento.model';
import TipoDocumento from '../tipoDocumento/tipoDocumento.model';

//crear Caso
export const crearCaso = async (req:Request, res: Response)=>{
try {
    const {id_cliente, tipo_tramite_id} = req.body;
const id_abogada = (res.locals.user as any).userId; // coincide con tu token
  //Buscar cliente para obtener DNI
const cliente = await Cliente.findByPk(id_cliente);
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
     await CasoDocumento.bulkCreate(documentosCaso);
// traer documentos con nombre
    const documentosCreados = await CasoDocumento.findAll({
      where: { id_caso: idCaso },
      include: [{ model: TipoDocumento, attributes: ['nombre'] }]
    });
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