import { DataTypes } from 'sequelize';
import database from '../db/connection';

const TipoDocumento = database.define('tipo_documento', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'tipo_documento',
  timestamps: false
});

export default TipoDocumento;
