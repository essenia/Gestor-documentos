

import { Request, Response} from "express";

import TipoTramite from "./tipoTramite.model";




export const getTramites = async(req :Request, res: Response) => {
try {
    const tramites = await TipoTramite.findAll();
    res.json(tramites);
    
    
} catch (error) {
    console.error(error);
    res.status(500).json({
        ok: false,
        mensaje: 'Error añ obtener trámites'
    }); 
}
}
