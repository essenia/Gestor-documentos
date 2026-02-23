import { DataTypes } from 'sequelize';
import database from '../db/connection';
import Caso from '../casos/caso.model';
import User from '../users/user.model';

const HistorialEstado = database.define('historial_estados', {

  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  caso_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Caso,
      key: 'id'
    }
  },

  estado_anterior: {
    type: DataTypes.STRING,
    allowNull: false
  },

  estado_nuevo: {
    type: DataTypes.STRING,
    allowNull: false
  },

  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },

  fecha_cambio: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }

}, {
  tableName: 'historial_estados',
  timestamps: false
});

export default HistorialEstado;
