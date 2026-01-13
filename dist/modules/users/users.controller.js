"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = exports.createUser = exports.getUsers = void 0;
const user_model_1 = __importDefault(require("./user.model"));
const role_model_1 = __importDefault(require("../roles/role.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
//// Función para obtener todos los usuarios
const getUsers = async (req, res) => {
    // Busca todos los usuarios en la base de datos
    const users = await user_model_1.default.findAll({
        // Incluye la relación con el modelo Role, pero solo trae el atributo 'nombre'
        include: [{ model: role_model_1.default, attributes: ['nombre'] }]
    });
    res.json(users);
};
exports.getUsers = getUsers;
// Función para crear un nuevo usuario
const createUser = async (req, res) => {
    try {
        // Extrae email, password y rol  de la solicitud
        const { email, password, id_rol } = req.body;
        if (!email || !password || !id_rol) {
            return res.status(400).json({ message: 'Datos incompletos' });
        }
        // Cifra la contraseña usando bcrypt con 10 rondas de salt
        const hash = await bcrypt_1.default.hash(password, 10);
        const requiereCambioPassword = id_rol === 3; // CLIENTE
        const user = await user_model_1.default.findOne({ where: { email: email } });
        if (user) {
            res.status(400).json({
                msg: ` Ya existe un Usuario con el nombre ${email}`
            });
        }
        // Crea un nuevo usuario en la base de datos
        await user_model_1.default.create({
            email,
            password_hash: hash,
            id_rol,
            requiere_cambio_password: requiereCambioPassword,
            activo: true
        });
        res.sendStatus(201);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear usuario' });
    }
};
exports.createUser = createUser;
const getUser = (req, res) => {
    const user = res.locals.user;
    console.log(user.userId);
    console.log(user.rol);
    res.json({ message: "Usuarios protegidos" });
};
exports.getUser = getUser;
//# sourceMappingURL=users.controller.js.map