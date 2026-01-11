"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = exports.getUsers = void 0;
const user_model_1 = __importDefault(require("./user.model"));
const role_model_1 = __importDefault(require("../roles/role.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const getUsers = async (req, res) => {
    const users = await user_model_1.default.findAll({
        include: [{ model: role_model_1.default, attributes: ['nombre'] }]
    });
    res.json(users);
};
exports.getUsers = getUsers;
const createUser = async (req, res) => {
    const { email, password, id_rol } = req.body;
    const hash = await bcrypt_1.default.hash(password, 10);
    await user_model_1.default.create({
        email,
        password_hash: hash,
        id_rol
    });
    res.sendStatus(201);
};
exports.createUser = createUser;
//# sourceMappingURL=users.controller.js.map