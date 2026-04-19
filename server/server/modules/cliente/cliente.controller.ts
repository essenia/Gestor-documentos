// src/clientes/cliente.controller.ts
import { Request, Response } from 'express';
import Cliente from './cliente.model';
import User from '../users/user.model';
import bcrypt from "bcrypt";
import { enviarEmail } from "../../services/email.service";


// Obtener todos los clientes
export const getClientes = async (req: Request, res: Response) => {
  try {
    const clientes = await Cliente.findAll({
      include: User // Incluye datos del usuario asociado
    });
    res.json(clientes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los clientes' });
  }
};

// Obtener un cliente por ID
export const getClienteById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const cliente = await Cliente.findOne({
      where: { id },
      // include: User
      include: [{
        model: User,
        attributes: ['id', 'email'] // Solo los campos que quiero enviar 
      }]
    });

    if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });

    res.json(cliente);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el cliente' });
  }
};

// Crear un nuevo cliente asociado a un usuario existente
export const crearCliente = async (req: Request, res: Response) => {
  try {
    const {
      id_usuario,
      nombre,
      apellido,
      dni,
      tipo_dni,
      telefono,
      direccion,
      notas_internas
        } = req.body;

    const usuario = await User.findByPk(id_usuario);
    if (!usuario) {
      return res.status(400).json({ error: 'Usuario no existe. Crea primero el usuario.' });
    }
    const passwordPlano = req.body.password;


    // Crear cliente
    const cliente = await Cliente.create({
      id_usuario,
      nombre,
      apellido,
      dni,
      tipo_dni,
      telefono,
      direccion,
      notas_internas,
      activo: true,
      password: passwordPlano
    });


// const passwordPlano = req.body.password;

    // Obtener el cliente completo con datos del usuario
    const clienteCompleto = await Cliente.findOne({
      where: { id: cliente.getDataValue('id') },
  include: [{ model: User,
     attributes: ['email']
  }]
            });


const email =
  (clienteCompleto as any)?.User?.email ||
  (clienteCompleto as any)?.usuario?.email;
    if (!email) {
      console.log("❌ Cliente sin email");
       return res.status(400).json({
    error: "Cliente sin email"
  });
    }


    console.log("📧 EMAIL CLIENTE:", email);

console.log("PASSWORD RECIBIDO:", req.body.password);
  console.log("ENVIANDO EMAIL...");

// if (email && passwordPlano) {
  // const html = `
  //   <div style="font-family: Arial;">
  //     <h2>👋 Bienvenido</h2>

  //     <p>Hola ${nombre}</p>

  //     <p>Tu cuenta ha sido creada correctamente.</p>

  //     <p><b>Email:</b> ${email}</p>
  //   <p><b>Password:</b> ${passwordPlano}</p>
    
  //     <p>Accede aquí:</p>

  //     <a href="http://localhost:4200">
  //       Entrar a la plataforma
  //     </a>
  //   </div>
  // `;
  const html = `
<div style="font-family: Arial, sans-serif; background:#f5f7fa; padding:20px;">

  <div style="max-width:600px; margin:auto; background:white; padding:25px; border-radius:10px; border:1px solid #e0e0e0;">

    <h2 style="color:#2c3e50; text-align:center;">
      👋 Bienvenido a  Menabogados
    </h2>

    <p>Hola <b>${nombre}</b>,</p>

    <p>Tu cuenta ha sido creada correctamente en nuestro sistema.</p>

    <hr style="margin:20px 0;" />

    <h3 style="color:#2c3e50;">🔐 Datos de acceso</h3>

    <p><b>Email:</b> ${email}</p>
    <p><b>Password:</b> ${passwordPlano}</p>

    <div style="text-align:center; margin:20px 0;">
      <a href="http://localhost:4200"
         style="background:#2c3e50; color:white; padding:12px 20px; text-decoration:none; border-radius:5px;">
        Entrar a la plataforma
      </a>
    </div>

    <hr style="margin:20px 0;" />

    <h3 style="color:#2c3e50;">🏢  Menabogados</h3>

    <p>Gracias por comunicarte con <b>Secretaria Menabogados</b></p>

    <p>
      📍 C/ Balmes 139, Piso 4 - 2A<br/>
      🚇 Metro Diagonal o Estación Provença (FGC)<br/>
      📞 93 459 04 43 / 608 055 820<br/>
      ✉️ menabogados@gmail.com
    </p>

    <h4 style="margin-top:20px; color:#2c3e50;">🕐 Atención presencial (cita previa)</h4>

    <p>
      Lunes a Viernes: 10:00 - 14:00<br/>
      Lunes, Miércoles y Jueves: 16:00 - 19:00
    </p>

    <h4 style="margin-top:20px; color:#2c3e50;">📞 Atención telefónica</h4>

    <p>
      93 459 04 43<br/>
      Lunes a Viernes: 10:00 - 14:00<br/>
      Lunes, Miércoles y Jueves: 16:00 - 19:00
    </p>

    <hr style="margin-top:30px;" />

    <p style="font-size:12px; color:#888; text-align:center;">
      Sistema Legal  © ${new Date().getFullYear()}  Menabogados - Todos los derechos reservados
    </p>

  </div>
</div>
`;

  await enviarEmail(email, "Bienvenido", html);
    console.log("✅ Email enviado");

console.log("BODY COMPLETO:", req.body);
console.log("PASSWORD:", req.body?.password);
    return res.status(201).json(clienteCompleto);
  } catch (error) {
   console.error(error);
   return res.status(500).json({ error: 'Error al crear cliente' });
 }
};


// ✅ Actualizar cliente
export const actualizarCliente = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

  const {
    nombre,
    apellido,
    dni,
    tipo_dni,
    telefono,
    direccion,
    notas_internas,
    activo
  } = req.body;

  try {
    // Buscar cliente
    // const cliente = await Cliente.findByPk(id);
    const cliente = await Cliente.findOne({
  where: { id },
  // include: [{
  //   model: User,
  //   attributes: ['id', 'email']
  // }]
   include: { model: User, as: 'usuario', attributes: ['id', 'email'] }
});
    if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });

    // Reemplazar todos los campos (PUT)
    cliente.setDataValue('nombre', nombre);
    cliente.setDataValue('apellido', apellido);
    cliente.setDataValue('dni', dni);
    cliente.setDataValue('tipo_dni', tipo_dni);
    cliente.setDataValue('telefono', telefono);
    cliente.setDataValue('direccion', direccion);
    cliente.setDataValue('notas_internas', notas_internas);
    cliente.setDataValue('activo', activo);

    await cliente.save();

    // Devolver cliente actualizado con info del usuario
    // const clienteActualizado = await Cliente.findOne({
    //   where: { id },
    //   include: { model: User, attributes: { exclude: ['password_hash'] } }
    // });
      const clienteActualizado = await Cliente.findOne({
      where: { id },
      include: { model: User, as: 'usuario', attributes: ['id', 'email'] }
    });

    res.json(clienteActualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar cliente' });
  }
};

export const getUltimosClientes = async (req :Request, res: Response) => {
   try {
    // Trae los últimos 5 clientes, incluyendo los datos del usuario relacionado
    const clientes = await Cliente.findAll({
      include: [{
        model: User,
        attributes: ['id', 'nombre', 'apellido', 'rol'] // solo campos que necesites
      }],
      order: [['id', 'DESC']],  // puedes usar 'id' si no tienes createdAt
      limit: 5
    });

    res.json(clientes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener últimos clientes' });
  }
};





export const marcarNoActivo = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  try {
    const cliente = await Cliente.findByPk(id);
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
cliente.setDataValue('activo', false);
const activo = cliente.getDataValue('activo'); 
    await cliente.save();

    res.json({ message: 'Cliente marcado como no activo' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al marcar cliente como no activo' });
  }
};

