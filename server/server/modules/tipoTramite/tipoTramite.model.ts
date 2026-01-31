// src/catalogos/tipoTramite.model.ts
import { DataTypes } from 'sequelize';
import database from '../db/connection';

const TipoTramite = database.define('tipo_tramite', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  descripcion: {
    type: DataTypes.STRING,
    allowNull: false
  },

  area: {
    type: DataTypes.STRING,
    allowNull: false
  }

}, {
  tableName: 'tipo_tramite',
  timestamps: false
});

export default TipoTramite;
