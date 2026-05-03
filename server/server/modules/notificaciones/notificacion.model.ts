// src/notificaciones/notificacion.model.ts
import { DataTypes } from 'sequelize';
import db from '../db/connection';

const Notificacion = db.define('notificaciones', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  id_usuario: { type: DataTypes.INTEGER, allowNull: false },
  id_caso: { type: DataTypes.INTEGER },
  tipo: { type: DataTypes.ENUM('email', 'sistema'), allowNull: false },
  contenido: { type: DataTypes.TEXT, allowNull: false },
  email_enviado_a: { type: DataTypes.STRING },
  fecha_envio: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  leida: { type: DataTypes.BOOLEAN, defaultValue: false }
}, {
  tableName: 'notificaciones',
  timestamps: false
});

export default Notificacion;