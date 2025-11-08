import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.js';

export class Postulacion extends Model {}

Postulacion.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  id_estudiante: { type: DataTypes.INTEGER, allowNull: false },
  id_oferta: { type: DataTypes.INTEGER, allowNull: false },
  estado: { type: DataTypes.STRING(30), allowNull: false, defaultValue: 'Enviada' },
  fecha: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
}, {
  sequelize,
  modelName: 'postulacion',
  tableName: 'postulaciones',
  timestamps: false
});
