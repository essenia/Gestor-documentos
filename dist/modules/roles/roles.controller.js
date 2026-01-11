"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRole = exports.getRoles = void 0;
const role_model_1 = __importDefault(require("./role.model"));
//para obtener todos los Roles
const getRoles = async (req, res) => {
    try {
        //Buscamos todos los registros en la tabla Rol
        const roles = await role_model_1.default.findAll();
        // return datos de forma JSON
        res.json(roles);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener roles' });
    }
};
exports.getRoles = getRoles;
// Para crear un Nuevo Rol
const createRole = async (req, res) => {
    //  // Creamos un nuevo rol usando el nombre enviado en el body de la petición
    await role_model_1.default.create({ nombre: req.body.nombre });
    // enviar una respuesta http 201 => se indica que el usuario fue creado
    res.sendStatus(201);
};
exports.createRole = createRole;
//# sourceMappingURL=roles.controller.js.map