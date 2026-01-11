import { DataTypes } from 'sequelize';
import database from '../db/connection';

const Role = database.define('roles', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(30),
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'roles',
  timestamps: false
});

export default Role;
