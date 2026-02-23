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

// ===== Función para generar contraseña automática =====
function generarPassword(longitud = 12) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?";
    let password = "";
    for (let i = 0; i < longitud; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

// Función para crear un nuevo usuario
export const createUser = async (req:Request,res :Response)=> {
    try {
      // Extrae email, password y rol  de la solicitud
// const {email, password, repeatPassword,id_rol} = req.body;
const {email, password, repeatPassword,id_rol} = req.body;

    console.log(req.body); 
  //  if (!email || !password  || !repeatPassword  || !id_rol) {

   if (!email || !password  || !repeatPassword  ) {
      return res.status(400).json({ message: 'Datos incompletos' });
    }

     // Validación de repetir contraseña
  

    if (password !== repeatPassword) {
      return res.status(400).json({
        message: 'Las contraseñas no coinciden'
      });
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
const newUser  = await User.create({

    email,
    password_hash :hash,
    id_rol,
    requiere_cambio_password: requiereCambioPassword,
    activo: true
});
    // return  res.sendStatus(201);
    //  res.status(201).json({
    //   msg: 'Usuario creado correctamente'
    // });
    // Devuelve el usuario completo o al menos su ID
    const userId = newUser.getDataValue('id');

res.status(201).json({
  id: userId,
  email: newUser.getDataValue(email),
  id_rol: newUser.getDataValue(id_rol)
});
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

