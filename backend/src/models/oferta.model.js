import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.js';

export class Oferta extends Model {}

Oferta.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  id_empresa: { type: DataTypes.INTEGER, allowNull: false },
  titulo: { type: DataTypes.STRING(120), allowNull: false },
  descripcion: { type: DataTypes.TEXT, allowNull: false },
  tipo_practica: { type: DataTypes.STRING(50), allowNull: false, defaultValue: 'Profesional' },
  fecha_publicacion: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  estado: { type: DataTypes.STRING(30), allowNull: false, defaultValue: 'Activa' }
}, {
  sequelize,
  modelName: 'oferta',
  tableName: 'ofertas',
  timestamps: false
});
