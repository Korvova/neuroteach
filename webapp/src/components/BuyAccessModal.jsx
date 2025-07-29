import Modal from './Modal/Modal';
import { useState } from 'react';
import { useMod } from '../context/ModeratorContext';
import Button from './Button/Button';

export default function BuyAccessModal({ open, onClose }) {
  const { buySlots } = useMod();
  const [qty, setQty] = useState(5);

  const price = qty * 2000;

  const buy = () => {
    buySlots(qty);
    onClose();
    window.location.href = '/payment?sum=' + price; // заглушка «страница оплаты»
  };

  return (
    <Modal open={open} onClose={onClose}>
      <h3>Купить доступы</h3>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <Button variant="secondary" onClick={() => setQty(Math.max(1, qty - 1))}>
          −
        </Button>
        <span style={{ fontSize: '1.2rem' }}>{qty}</span>
        <Button variant="secondary" onClick={() => setQty(qty + 1)}>
          +
        </Button>
      </div>

      <p style={{ marginTop: 12 }}>
        Итого: {price.toLocaleString()} ₽
      </p>

      <Button onClick={buy}>Купить</Button>
    </Modal>
  );
}
