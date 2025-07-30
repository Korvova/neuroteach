import { Router } from 'express';

import bcrypt from 'bcryptjs';
import { prisma } from '../prisma/client.js';
import { sign } from './_auth.js';
const r = Router();

/* login */
r.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ error: 'invalid' });

  res.json({ token: sign({ id: user.id, role: user.role }) });
});

export default r;
