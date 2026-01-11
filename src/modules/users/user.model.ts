import { DataTypes } from 'sequelize';
import database from '../db/connection';
import Role from '../roles/role.model';

const User = database.define('usuarios', {
  id: { type: DataTypes.INTEGER, primaryKey:true, autoIncrement:true },
  email: { type: DataTypes.STRING(150), unique:true, allowNull:false },
  password_hash: { type: DataTypes.STRING(255), allowNull:false },
  activo: { type: DataTypes.BOOLEAN, defaultValue:true },
  requiere_cambio_password: { type: DataTypes.BOOLEAN, defaultValue:true }
},{
  tableName:'usuarios',
  timestamps:false
});

User.belongsTo(Role, { foreignKey:'id_rol' });

export default User;
