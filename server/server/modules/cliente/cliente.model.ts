// src/clientes/cliente.model.ts
import { DataTypes } from 'sequelize';
import database from '../db/connection';
import User from '../users/user.model';

const Cliente = database.define('clientes', {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,  // Apunta al modelo User
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  nombre: { type: DataTypes.STRING, allowNull: false },
  apellido: { type: DataTypes.STRING, allowNull: false },
  dni: { type: DataTypes.STRING, allowNull: false },
  tipo_dni: { type: DataTypes.STRING, allowNull: false },
  telefono: { type: DataTypes.STRING },
  direccion: { type: DataTypes.STRING },
  notas_internas: { type: DataTypes.TEXT },
  activo: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
  tableName: 'clientes',
  timestamps: false
});

// Relaciones
User.hasOne(Cliente, { foreignKey: 'id_usuario' });
Cliente.belongsTo(User, { foreignKey: 'id_usuario' });

export default Cliente;
