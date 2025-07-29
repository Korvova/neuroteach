import { useState } from 'react';
import { useMod } from '../../context/ModeratorContext';
import Table from '../../components/Table/Table';
import Button from '../../components/Button/Button';

export default function PaymentPage() {
  const { buySlots, payments } = useMod();
  const [qty, setQty] = useState(5);
  const price = qty * 2000;

  /* строки для таблицы истории */
  const rows = payments.map((p) => [
    p.date,
    p.qty,
    p.amount.toLocaleString() + ' ₽',
    p.status,
  ]);

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '32px 16px 64px' }}>
      <h2>Купить доступы</h2>

      {/* выбор количества */}
      <div
        style={{
          display: 'flex',
          gap: 12,
          alignItems: 'center',
          margin: '16px 0',
        }}
      >
        <Button
          variant="secondary"
          onClick={() => setQty(Math.max(1, qty - 1))}
        >
          −
        </Button>
        <span style={{ fontSize: '1.4rem' }}>{qty}</span>
        <Button variant="secondary" onClick={() => setQty(qty + 1)}>
          +
        </Button>
      </div>

      <p>Итого: {price.toLocaleString()} ₽</p>

      <Button
        onClick={() => {
          buySlots(qty);
          window.location.href = '/payment?sum=' + price; // заглушка «оплата»
        }}
      >
        Купить
      </Button>

      {/* история платежей */}
      <h3 style={{ marginTop: 32 }}>История платежей</h3>
      <Table
        head={['Дата', 'Кол-во', 'Сумма', 'Статус']}
        rows={rows}
      />
    </div>
  );
}
