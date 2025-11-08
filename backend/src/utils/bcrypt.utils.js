import bcrypt from 'bcryptjs'; export const hash=async(p)=>bcrypt.hash(p,10); export const compare=async(p,h)=>bcrypt.compare(p,h);
