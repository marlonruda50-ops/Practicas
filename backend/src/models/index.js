
import { sequelize } from '../config/db.js';
import { Rol } from './rol.model.js'; import { Usuario } from './usuario.model.js';
import { Oferta } from './oferta.model.js'; import { Postulacion } from './postulacion.model.js';
Rol.hasMany(Usuario,{foreignKey:'id_rol'}); Usuario.belongsTo(Rol,{foreignKey:'id_rol'});
Usuario.hasMany(Oferta,{foreignKey:'id_empresa'}); Oferta.belongsTo(Usuario,{as:'empresa',foreignKey:'id_empresa'});
Usuario.hasMany(Postulacion,{foreignKey:'id_estudiante'}); Postulacion.belongsTo(Usuario,{as:'estudiante',foreignKey:'id_estudiante'});
Oferta.hasMany(Postulacion,{foreignKey:'id_oferta'}); Postulacion.belongsTo(Oferta,{foreignKey:'id_oferta'});
export async function initDb(){ await sequelize.sync(); }
export { Rol, Usuario, Oferta, Postulacion };
