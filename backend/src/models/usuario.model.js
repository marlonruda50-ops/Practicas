import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.js';

export class Usuario extends Model {}

Usuario.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(100), allowNull: false },
  apellido: { type: DataTypes.STRING(100), allowNull: false },
  correo: { type: DataTypes.STRING(150), allowNull: false, unique: true },
  password_hash: { type: DataTypes.STRING(255), allowNull: false },
  id_rol: { type: DataTypes.INTEGER, allowNull: false }
}, {
  sequelize,
  modelName: 'usuario',
  tableName: 'usuarios',
  timestamps: false
});
