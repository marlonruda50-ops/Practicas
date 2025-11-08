import { Router } from 'express';
import { postular, listarPorOferta, misPostulaciones } from '../controllers/postulacion.controller.js';
import { auth } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/authorize.middleware.js';

const r = Router();
r.post('/', auth, authorize(['Estudiante']), postular);
r.get('/oferta/:id', auth, authorize(['Empresa','Coordinador','Admin']), listarPorOferta);
r.get('/mias', auth, authorize(['Estudiante']), misPostulaciones);
export default r;
