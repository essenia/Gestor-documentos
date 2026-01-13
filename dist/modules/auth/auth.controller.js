"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.login = void 0;
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
        //Validamos si el usuarios ya existe en DB
        const user = await user_model_1.default.findOne({
            where: { email },
            include: [{ model: role_model_1.default, attributes: ["nombre"] }],
        });
        if (!user) {
            return res.status(401).json({ message: "Credenciales inválidas" });
        }
        //Comparar Passwordç
        const passwordHash = user.getDataValue("password_hash");
        const rol = user.getDataValue("Role")?.nombre;
        //Validomos Password
        const validPassword = await bcrypt_1.default.compare(password, passwordHash);
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
        const JWT_SECRET = process.env.JWT_SECRET;
        let JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';
        // if (!JWT_SECRET) throw new Error('JWT_SECRET no definido en .env');
        // Validar formato simple: número seguido de s/m/h/d
        if (!/^\d+[smhd]$/.test(JWT_EXPIRES_IN)) {
            console.warn(`JWT_EXPIRES_IN inválido: ${JWT_EXPIRES_IN}, usando "8h" por defecto`);
            JWT_EXPIRES_IN = "8h";
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.getDataValue("id"), rol
        }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
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
    }
    catch (error) {
        console.error('ERROR LOGIN 👉', error);
        return res.status(500).json({
            msg: 'Error Login',
            error: error instanceof Error ? error.message : error
        });
    }
};
exports.login = login;
//Change PassWord
const changePassword = async (req, res) => {
    try {
        const { userId, newPassword } = req.body;
        if (!userId || !newPassword) {
            return res.status(400).json({ message: 'Datos incompletos' });
        }
        const hash = await bcrypt_1.default.hash(newPassword, 10);
        await user_model_1.default.update({
            password_hash: hash,
            requiere_cambio_password: false
        }, { where: { id: userId } });
        res.json({ message: 'Contraseña actualizada correctamente' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al cambiar la contraseña' });
    }
};
exports.changePassword = changePassword;
//# sourceMappingURL=auth.controller.js.map