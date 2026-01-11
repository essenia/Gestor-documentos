"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
// import mysql from 'mysql2/promise';
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const sequelize = new sequelize_1.Sequelize('gestordocumentos', 'root', '', {
    host: 'localhost', dialect: 'mariadb',
    // logging: console.log
});
exports.default = sequelize;
//# sourceMappingURL=connection.js.map