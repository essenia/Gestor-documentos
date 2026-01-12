import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

import User from "../users/user.model";
import Role from "../roles/role.model";



// const JWT_SECRET = process.env.JWT_SECRET;

    const JWT_SECRET = process.env.JWT_SECRET as string;
    const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "8h";




// if (!JWT_SECRET) {
//   throw new Error('JWT_SECRET no está definido en el .env');
// }
   
// LOGIN
export const login = async (req: Request, res: Response) => {
   


  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email y password requeridos" });
    }
    //Buscar Usuario y Rol
    const usr = await User.findOne({
      where: { email },
      include: [{ model: Role, attributes: ["nombre"] }],
    });
    if (!User) {
      return res.status(401).json({
        message: "Credenciales inválidas",
      });
    }
    //Comparar Passwordç
     const userAny = User as any;
 
     const rol = userAny.Role?.nombre;
    //  const userId = userAny.dataValues.id;


    const passwordHash = (User as any).dataValues.password_hash;

    const validPassword = await bcrypt.compare(password, passwordHash);

    if (!validPassword) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    //Requiere cambiar Pass solo para Client
    const requiereCambio = (User as any).dataValues.requiere_cambio_password;
    const userId = (User as any).dataValues.id;
    const Email = (User as any).dataValues.email;

    if (requiereCambio) {
      return res.status(403).json({
        message: "Debe Cambiar su contraseña",
        requiereCambio: true,
        userId: userId,
      });
    }
    // Generar JWT
    

    const JWT_SECRET = process.env.JWT_SECRET!;
    const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';
    if (!JWT_SECRET) throw new Error('JWT_SECRET no definido en .env');
    
const token = jwt.sign(
   {userId : userId, 

        rol},
  JWT_SECRET,
  { expiresIn: JWT_EXPIRES_IN }
);
   return res.json({
      message: 'Login exitoso',
      user: {
        id : userId, Email
   ,rol
        //  id: user.id, email: user.email, rol 
        },
      token
    });   

  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "Error Login..",
    });
  }
};
