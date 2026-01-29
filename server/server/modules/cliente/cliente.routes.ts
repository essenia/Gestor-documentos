// src/clientes/cliente.routes.ts
import { Router } from 'express';
import { getClientes, getClienteById, crearCliente, actualizarCliente, getUltimosClientes, marcarNoActivo } from './cliente.controller';

const router = Router();

// Obtener todos los clientes
router.get('/', getClientes);

// Obtener cliente por ID
router.get('/:id', getClienteById);

// Crear un nuevo cliente
router.post('/', crearCliente);

// PATCH para actualizar cliente
router.put('/:id', actualizarCliente);
router.get('/ultimos', getUltimosClientes);
router.patch('/:id', marcarNoActivo);



export default router;
