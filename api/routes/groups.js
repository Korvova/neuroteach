import { Router } from 'express';
import { prisma } from '../prisma/client.js';
import { authMw } from './_auth.js';
import { json } from '../utils/jsonBigInt.js';

const r = Router();

/* список групп */
r.get('/', authMw(['MODERATOR']), async (_req, res) => {
  const groups = await prisma.group.findMany({
    include: { members: true },
    orderBy: { id: 'asc' },
  });
  res.json(
    json(
      groups.map((g) => ({
        id: g.id,
        name: g.name,
        count: g.members.length,
      })),
    ),
  );
});

/* создать группу */
r.post('/', authMw(['MODERATOR']), async (req, res) => {
  const { name, userIds = [] } = req.body;
  const grp = await prisma.group.create({
    data: {
      name,
      members: {
        create: userIds.map((uid) => ({ userId: +uid })),
      },
    },
  });
  res.status(201).json(json(grp));
});

/* обновить группу */
r.put('/:id', authMw(['MODERATOR']), async (req, res) => {
  const id = +req.params.id;
  const { name, addUserIds = [], removeUserIds = [] } = req.body;

  // оставляем только реально существующих пользователей
  const users = await prisma.user.findMany({
    where: { id: { in: addUserIds.map(Number) } },
    select: { id: true },
  });
  const existingIds = users.map((u) => u.id);

  await prisma.$transaction([
    name
      ? prisma.group.update({ where: { id }, data: { name } })
      : prisma.group.findUnique({ where: { id } }),

    prisma.membership.createMany({
      data: existingIds.map((u) => ({ userId: u, groupId: id })),
      skipDuplicates: true,
    }),

    prisma.membership.deleteMany({
      where: { groupId: id, userId: { in: removeUserIds.map(Number) } },
    }),
  ]);

  res.json({ ok: true });
});

/* удалить группу */
r.delete('/:id', authMw(['MODERATOR']), async (req, res) => {
  const id = +req.params.id;

  await prisma.$transaction([
    prisma.membership.deleteMany({ where: { groupId: id } }), // каскад
    prisma.group.delete({ where: { id } }),
  ]);

  res.status(204).end();
});

export default r;
