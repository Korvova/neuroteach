import { Router } from 'express';
import { prisma } from '../prisma/client.js';
import { authMw } from './_auth.js';
import bcrypt from 'bcryptjs';
import { json } from '../utils/jsonBigInt.js';

const r = Router();
const PRICE_PER_SLOT = 2000;

/* helper: свободные слоты */
async function freeSlots(userId) {
  const paid = await prisma.payment.aggregate({
    _sum: { quantity: true },
    where: { buyerId: userId, status: 'PAID' },
  });
  const used = await prisma.user.count({
    where: { role: 'STUDENT' },
  });
  return (paid._sum.quantity || 0) - used;
}

/* ── список ── */
r.get('/', authMw(['MODERATOR']), async (_req, res) => {
  const list = await prisma.user.findMany({
    where: { role: 'STUDENT' },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      groups: { include: { group: true } },
    },
  });
  res.json(json(list));
});

/* ── создать ── */
r.post('/', authMw(['MODERATOR']), async (req, res) => {
  const { firstName, lastName, email, password, groupId, certificate } = req.body;

  if ((await freeSlots(req.user.id)) <= 0)
    return res.status(409).json({ error: 'no_free_slots' });

  try {
    const student = await prisma.user.create({
      data: {
        email,
        password: await bcrypt.hash(password || 'pass123', 10),
        firstName,
        lastName,
        role: 'STUDENT',
        groups: groupId
          ? {
              create: {
                groupId: +groupId,
                certificate,
              },
            }
          : undefined,
      },
    });
    res.status(201).json(json(student));
  } catch (e) {
    res.status(400).json({ error: 'email_exists' });
  }
});

/* ── обновить ── */
r.put('/:id', authMw(['MODERATOR']), async (req, res) => {
  const id = +req.params.id;
  const { firstName, lastName, email, groupId, certificate } = req.body;

  try {
    const upd = await prisma.user.update({
      where: { id },
      data: { firstName, lastName, email },
      include: { groups: true },
    });

    if (groupId != null) {
      await prisma.membership.upsert({
        where: { userId_groupId: { userId: id, groupId: +groupId } },
        update: { certificate },
        create: { userId: id, groupId: +groupId, certificate },
      });
    }

    res.json(json(upd));
  } catch {
    res.status(404).end();
  }
});

/* ── удалить ── */
r.delete('/:id', authMw(['MODERATOR']), async (req, res) => {
  await prisma.user.delete({ where: { id: +req.params.id } });
  res.status(204).end();
});

export default r;
