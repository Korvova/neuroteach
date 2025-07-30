import { Router } from 'express';
import { prisma } from '../prisma/client.js';
import { authMw } from './_auth.js';
import { json } from '../utils/jsonBigInt.js';

const r = Router();
const PRICE_PER_SLOT = 2000;

/* история оплат */
r.get('/', authMw(['MODERATOR']), async (req, res) => {
  const rows = await prisma.payment.findMany({
    where: { buyerId: req.user.id },
    orderBy: { createdAt: 'desc' },
  });
  res.json(json(rows));
});

/* создать "счёт" */
r.post('/', authMw(['MODERATOR']), async (req, res) => {
  const { quantity } = req.body; // 5, 10…
  const pay = await prisma.payment.create({
    data: {
      buyerId: req.user.id,
      quantity: +quantity,
      amount: +quantity * PRICE_PER_SLOT,
      status: 'PENDING',
    },
  });

  // Здесь можно возвратить ссылку на платёжный шлюз
  res.status(201).json({
    paymentId: pay.id,
    amount: pay.amount,
    payUrl: `https://pay.example.com/${pay.id}`,
  });
});

export default r;
