"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../users/user.model"));
const role_model_1 = __importDefault(require("../roles/role.model"));
// const JWT_SECRET = process.env.JWT_SECRET;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "8h";
// if (!JWT_SECRET) {
//   throw new Error('JWT_SECRET no está definido en el .env');
// }
// LOGIN
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email y password requeridos" });
        }
        //Buscar Usuario y Rol
        const usr = await user_model_1.default.findOne({
            where: { email },
            include: [{ model: role_model_1.default, attributes: ["nombre"] }],
        });
        if (!user_model_1.default) {
            return res.status(401).json({
                message: "Credenciales inválidas",
            });
        }
        //Comparar Passwordç
        const userAny = user_model_1.default;
        const rol = userAny.Role?.nombre;
        //  const userId = userAny.dataValues.id;
        const passwordHash = user_model_1.default.dataValues.password_hash;
        const validPassword = await bcrypt_1.default.compare(password, passwordHash);
        if (!validPassword) {
            return res.status(401).json({ message: "Credenciales inválidas" });
        }
        //Requiere cambiar Pass solo para Client
        const requiereCambio = user_model_1.default.dataValues.requiere_cambio_password;
        const userId = user_model_1.default.dataValues.id;
        const Email = user_model_1.default.dataValues.email;
        if (requiereCambio) {
            return res.status(403).json({
                message: "Debe Cambiar su contraseña",
                requiereCambio: true,
                userId: userId,
            });
        }
        // Generar JWT
        const JWT_SECRET = process.env.JWT_SECRET;
        const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';
        if (!JWT_SECRET)
            throw new Error('JWT_SECRET no definido en .env');
        const token = jsonwebtoken_1.default.sign({ userId: userId,
            rol }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        return res.json({
            message: 'Login exitoso',
            user: {
                id: userId, Email,
                rol
                //  id: user.id, email: user.email, rol 
            },
            token
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            msg: "Error Login..",
        });
    }
};
exports.login = login;
//# sourceMappingURL=auth.controller.js.map