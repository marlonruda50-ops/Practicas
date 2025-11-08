import { Postulacion, Oferta, Usuario } from '../models/index.js';

// POST /api/postulaciones  (Estudiante)
export async function postular(req, res) {
  const { id_oferta } = req.body;
  if (!id_oferta) return res.status(400).json({ message: 'id_oferta es requerido' });

  const oferta = await Oferta.findByPk(id_oferta);
  if (!oferta) return res.status(404).json({ message: 'Oferta no existe' });

  // Evitar duplicados (UX + seguridad)
  const yaExiste = await Postulacion.findOne({
    where: { id_estudiante: req.user.sub, id_oferta }
  });
  if (yaExiste) {
    return res.status(409).json({ message: 'Ya te postulaste a esta oferta' });
  }

  const p = await Postulacion.create({
    id_estudiante: req.user.sub,
    id_oferta
  });
  return res.status(201).json(p);
}

// GET /api/postulaciones/oferta/:id  (Empresa/Coordinador/Admin)
export async function listarPorOferta(req, res) {
  const { id } = req.params;

  // (opcional) Restringir a la empresa dueña de la oferta:
  // const oferta = await Oferta.findByPk(id);
  // if (!oferta || oferta.id_empresa !== req.user.sub) {
  //   return res.status(403).json({ message: 'Forbidden' });
  // }

  const ps = await Postulacion.findAll({
    where: { id_oferta: id },
    order: [['fecha', 'DESC']],
    include: [{ model: Usuario, as: 'estudiante', attributes: ['id', 'nombre', 'apellido', 'correo'] }]
  });
  return res.json(ps);
}

// GET /api/postulaciones/mias  (Estudiante)
export async function misPostulaciones(req, res) {
  const ps = await Postulacion.findAll({
    where: { id_estudiante: req.user.sub },
    order: [['fecha', 'DESC']]
  });
  return res.json(ps);
}
