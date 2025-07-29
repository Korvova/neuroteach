import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMod } from '../../context/ModeratorContext';
import Table from '../../components/Table/Table';
import ParticipantFormModal from '../../components/ParticipantFormModal';
import BuyAccessModal from '../../components/BuyAccessModal';
import Button from '../../components/Button/Button';

export default function ParticipantsPage() {
  const { participants, slots } = useMod();
  const nav = useNavigate();

  const [openAdd, setOpenAdd] = useState(false);
  const [openBuy, setOpenBuy] = useState(false);
  const [editing, setEditing] = useState(null);

  /* строки таблицы */
  const rows = participants.map((p) => [
    `${p.first} ${p.last}`,
    p.group,
    p.lastLogin,
    p.lessons,
    p.courses,
    <Button
      key={p.id}
      variant="secondary"
      style={{ padding: '4px 10px' }}
      onClick={() => setEditing(p)}
    >
      Редактировать
    </Button>,
  ]);

  return (
    <>
      {/* верхняя панель действий */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
        <Button onClick={() => setOpenAdd(true)}>Добавить участника</Button>

        <span style={{ alignSelf: 'center' }}>
          Свободно: <strong>{slots}</strong>
        </span>

        <Button variant="secondary" onClick={() => nav('/moderator/payment')}>
          Купить
        </Button>
      </div>

      {/* таблица участников */}
      <Table
        head={[
          'ФИО',
          'Группа',
          'Последний вход',
          'Уроков',
          'Курсов',
          '',
        ]}
        rows={rows}
      />

      {/* модалки */}
      <ParticipantFormModal open={openAdd} onClose={() => setOpenAdd(false)} />
      <ParticipantFormModal
        open={!!editing}
        onClose={() => setEditing(null)}
        edit={editing}
      />
      <BuyAccessModal open={openBuy} onClose={() => setOpenBuy(false)} />
    </>
  );
}
