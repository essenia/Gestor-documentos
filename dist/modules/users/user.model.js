"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection"));
const role_model_1 = __importDefault(require("../roles/role.model"));
const User = connection_1.default.define('usuarios', {
    id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: sequelize_1.DataTypes.STRING(150), unique: true, allowNull: false },
    password_hash: { type: sequelize_1.DataTypes.STRING(255), allowNull: false },
    activo: { type: sequelize_1.DataTypes.BOOLEAN, defaultValue: true },
    requiere_cambio_password: { type: sequelize_1.DataTypes.BOOLEAN, defaultValue: true }
}, {
    tableName: 'usuarios',
    timestamps: false
});
User.belongsTo(role_model_1.default, { foreignKey: 'id_rol' });
exports.default = User;
//# sourceMappingURL=user.model.js.map