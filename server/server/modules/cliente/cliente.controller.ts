// src/clientes/cliente.controller.ts
import { Request, Response } from 'express';
import Cliente from './cliente.model';
import User from '../users/user.model';

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

    // Verificar que el usuario exista
    const usuario = await User.findByPk(id_usuario);
    if (!usuario) {
      return res.status(400).json({ error: 'Usuario no existe. Crea primero el usuario.' });
    }

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
      activo: true
    });

    // Obtener el cliente completo con datos del usuario
    const clienteCompleto = await Cliente.findOne({
      where: { id: cliente.getDataValue('id') },
      include: User
    });

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

