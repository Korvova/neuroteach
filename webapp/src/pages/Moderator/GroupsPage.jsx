import { useState } from 'react';
import { useMod } from '../../context/ModeratorContext';
import Table from '../../components/Table/Table';
import GroupFormModal from '../../components/GroupFormModal';
import Button from '../../components/Button/Button';

export default function GroupsPage() {
  const { groups } = useMod();

  const [openAdd, setOpenAdd] = useState(false);  // «Добавить»
  const [editing, setEditing] = useState(null);   // редактируемая группа

  /* строки таблицы */
  const rows = groups.map((g) => [
    g.name,
    g.members.length,
    <Button
      key={g.id}
      variant="secondary"
      style={{ padding: '4px 10px' }}
      onClick={() => setEditing(g)}
    >
      Редактировать
    </Button>,
  ]);

  return (
    <>
      <Button onClick={() => setOpenAdd(true)} style={{ marginBottom: 16 }}>
        Добавить группу
      </Button>

      <Table head={['Название', 'Кол-во пользователей', '']} rows={rows} />

      {/* модалки */}
      <GroupFormModal open={openAdd} onClose={() => setOpenAdd(false)} />
      <GroupFormModal
        open={!!editing}
        onClose={() => setEditing(null)}
        edit={editing}
      />
    </>
  );
}
