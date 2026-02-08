

import { Request, Response } from 'express';
import TipoDocumento from './tipoDocumento.model';

export const getTiposDocumento = async (req: Request, res: Response) => {
  try {
    const tipos = await TipoDocumento.findAll();
    res.json(tipos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, mensaje: 'Error al obtener tipos de documento' });
  }
};
