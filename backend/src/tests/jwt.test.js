import { signJwt, verifyJwt } from '../utils/jwt.utils.js'; test('jwt', ()=>{ const t=signJwt({sub:1,rol:'Empresa'}); const v=verifyJwt(t); expect(v.sub).toBe(1); });
