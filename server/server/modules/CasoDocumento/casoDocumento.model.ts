import { DataTypes } from 'sequelize';
import database from '../db/connection';
import TipoDocumento from '../tipoDocumento/tipoDocumento.model';

const CasoDocumento = database.define('caso_documento', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  id_caso: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  tipo_documento_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: TipoDocumento,
      key: 'id'
    }
  },

  ruta: {
    type: DataTypes.STRING,
    allowNull: true
  },

  tipo_archivo: {
    type: DataTypes.STRING,
    allowNull: true
  },

  tamano_archivo: {
    type: DataTypes.INTEGER,
    allowNull: true
  },

  fecha_subida: {
    type: DataTypes.DATE,
    allowNull: true
  },

  estado_validacion: {
    type: DataTypes.ENUM('pendiente','en_revision','aprobado','rechazado'),
    defaultValue: 'pendiente'
  },

  fecha_caducidad: {
    type: DataTypes.DATE,
    allowNull: true
  },

  


  es_obligatorio: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },

  comentarios: {
    type: DataTypes.STRING,
    allowNull: true
  }

}, {
  tableName: 'caso_documento',
  timestamps: false
});

// 🔹 Relación para traer nombre del documento
CasoDocumento.belongsTo(TipoDocumento, {
  foreignKey: 'tipo_documento_id'
});

export default CasoDocumento;
