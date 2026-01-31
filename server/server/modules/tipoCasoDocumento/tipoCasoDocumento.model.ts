import { DataTypes } from 'sequelize';
import database from '../db/connection';
import TipoDocumento from '../tipoDocumento/tipoDocumento.model';
import TipoTramite from '../tipoTramite/tipoTramite.model';

const TipoCasoDocumento = database.define('tipo_caso_documento', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  tipo_tramite_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: TipoTramite,
      key: 'id'
    }
  },

  tipo_documento_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: TipoDocumento,
      key: 'id'
    }
  },

  es_obligatorio: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },

  caducidad: {
    type: DataTypes.DATE,
    allowNull: true
  },

  comentarios: {
    type: DataTypes.STRING,
    allowNull: true
  }

}, {
  tableName: 'tipo_caso_documento',
  timestamps: false
});

export default TipoCasoDocumento;
