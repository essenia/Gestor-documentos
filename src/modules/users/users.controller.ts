import { Request, Response } from 'express';
import User from './user.model';
import Role from '../roles/role.model';
import bcrypt from 'bcrypt';

//// Función para obtener todos los usuarios

export const getUsers = async (req:Request, res:Response)=>{
      // Busca todos los usuarios en la base de datos
 const users = await User.findAll({
      // Incluye la relación con el modelo Role, pero solo trae el atributo 'nombre'
 include: [{model: Role, attributes: ['nombre']}]
 });
 res.json(users);
}

// Función para crear un nuevo usuario
export const createUser = async (req:Request,res :Response)=> {
    try {
      // Extrae email, password y rol  de la solicitud
const {email, password, id_rol} = req.body;
   if (!email || !password || !id_rol) {
      return res.status(400).json({ message: 'Datos incompletos' });
    }
  // Cifra la contraseña usando bcrypt con 10 rondas de salt
const hash = await bcrypt.hash(password,10);
    const requiereCambioPassword = id_rol === 3; // CLIENTE
    const user =  await User.findOne({ where: {email : email}});
   if (user){
    res.status(400).json({
        msg : ` Ya existe un Usuario con el nombre ${email}`
    })
   }
  // Crea un nuevo usuario en la base de datos
await User.create({

    email,
    password_hash :hash,
    id_rol,
    requiere_cambio_password: requiereCambioPassword,
    activo: true
});
res.sendStatus(201);
 } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear usuario' });
  }

}

export const getUser = (req: Request, res: Response) => {
  const user = res.locals.user;

  console.log(user.userId);
  console.log(user.rol);

  res.json({ message: "Usuarios protegidos" });
};

