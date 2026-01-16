

import { Request, Response } from 'express';
import Role  from './role.model';


//para obtener todos los Roles
export const getRoles  = async(req:Request, res:Response)=> {
      try {
    //Buscamos todos los registros en la tabla Rol
const roles = await Role.findAll();
// return datos de forma JSON
res.json(roles)
} catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener roles' });
  }
};

// Para crear un Nuevo Rol
export const createRole = async(req:Request, res: Response) => {
    //  // Creamos un nuevo rol usando el nombre enviado en el body de la petición
  await Role.create({ nombre: req.body.nombre });
  // enviar una respuesta http 201 => se indica que el usuario fue creado
  res.sendStatus(201);


};