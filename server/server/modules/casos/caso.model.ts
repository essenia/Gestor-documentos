// src/casos/caso.model.ts
import { DataTypes } from 'sequelize';
import database from '../db/connection';
import Cliente from '../cliente/cliente.model';
import User from '../users/user.model';
import TipoTramite from '../tipoTramite/tipoTramite.model';

const Caso = database.define('casos', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  id_cliente: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Cliente,
      key: 'id'
    }
  },

  id_abogada: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },

  tipo_tramite_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: TipoTramite,
      key: 'id'
    }
  },

  estado: {
    type: DataTypes.ENUM(
      'abierto',
      'pendiente_documentos',
      'en_tramite',
      'completado',
      'archivado'
    ),
    defaultValue: 'pendiente_documentos'
  },

  num_expediente: {
    type: DataTypes.STRING,
    allowNull: true
  },

  cod_caso: {
    type: DataTypes.STRING,
    allowNull: true
  },

  año: {
    type: DataTypes.INTEGER
  },

  fecha_creacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
    //  fecha de última actualización del estado
  fecha_estado: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }


}, {
  tableName: 'casos',
  timestamps: false
});

export default Caso;
