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
    //Validamos si el usuarios ya existe en DB
    const user = await User.findOne({
      where: { email },
      include: [{ model: Role, attributes: ["nombre"] }],
    });
   if (!user) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }
    //Comparar Passwordç
    const passwordHash = user.getDataValue("password_hash");

     const rol = user.getDataValue("Role")?.nombre;

   

    //Validomos Password

const validPassword = await bcrypt.compare(password, passwordHash);

    if (!validPassword) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    //Requiere cambiar Pass solo para Client
    const requiereCambio = user.getDataValue("requiere_cambio_password");
    const userId = user.getDataValue("id");
    const userEmail = user.getDataValue("email");

    if (requiereCambio) {
      return res.status(403).json({
          message: "Debe cambiar su contraseña",
        requiereCambio: true,
        userId: user.getDataValue("id")
      });
    }
    // Generar JWT
    

    const JWT_SECRET = process.env.JWT_SECRET!;
    let  JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';
    // if (!JWT_SECRET) throw new Error('JWT_SECRET no definido en .env');
    // Validar formato simple: número seguido de s/m/h/d
if (!/^\d+[smhd]$/.test(JWT_EXPIRES_IN)) {
  console.warn(`JWT_EXPIRES_IN inválido: ${JWT_EXPIRES_IN}, usando "8h" por defecto`);
  JWT_EXPIRES_IN = "8h";
}
    
const token = jwt.sign(
   {userId: user.getDataValue("id"), rol

    },
  JWT_SECRET,
  { expiresIn: JWT_EXPIRES_IN }
);
   return res.json({
      message: 'Login exitoso',
      user: {
         id: userId,
        email: userEmail,
        rol
        //  id: user.id, email: user.email, rol 
        },
      token
    });   

  } catch (error) {
   console.error('ERROR LOGIN 👉', error);
  return res.status(500).json({
    msg: 'Error Login',
    error: error instanceof Error ? error.message : error
  })
}

}

//Change PassWord

export const changePassword = async (req: Request, res: Response) =>{
   
    try {
        const  {userId , newPassword} = req.body;
        if(!userId || ! newPassword){
                  return res.status(400).json({ message: 'Datos incompletos' });  }
                  const hash = await bcrypt.hash(newPassword,10);
                  await User.update(
                    {
                        password_hash : hash,
                        requiere_cambio_password: false
                         },
                         { where: { id: userId } }
                  );
                      res.json({ message: 'Contraseña actualizada correctamente' });

        
    } catch (error) {
         console.error(error);
    res.status(500).json({ message: 'Error al cambiar la contraseña' });
    }

}