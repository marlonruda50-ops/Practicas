export function authorize(r=[]){const s=new Set(Array.isArray(r)?r:[r]); return (req,res,next)=>{ if(!req.user||!s.has(req.user.rol)) return res.status(403).json({message:'Forbidden'}); next(); } }
