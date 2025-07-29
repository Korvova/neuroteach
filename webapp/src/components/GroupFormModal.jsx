import Modal from './Modal/Modal';
import { useState } from 'react';
import { useMod } from '../context/ModeratorContext';
import Button from './Button/Button';          // ← добавили

export default function GroupFormModal({ open, onClose, edit }) {
  const { participants, addGroup } = useMod();

  const [name, setName] = useState(edit?.name || '');
  const [members, setMembers] = useState(edit?.members || []);

  const toggle = (id) =>
    setMembers((arr) =>
      arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id]
    );

  const save = () => {
    if (edit) {
      alert('Сохранено (mock)');
    } else {
      addGroup({ name });
    }
    onClose();
  };

  const remove = () => {
    if (window.confirm('Удалить группу?')) {
      alert('Группа удалена (mock)');
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <h3>{edit ? 'Редактировать группу' : 'Новая группа'}</h3>

      <input
        placeholder="Название группы"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ margin: 6 }}
      />

      <p>Участники:</p>
      <div style={{ maxHeight: 120, overflow: 'auto', border: '1px solid var(--border)', padding: 6 }}>
        {participants.map((p) => (
          <label key={p.id} style={{ display: 'block' }}>
            <input
              type="checkbox"
              checked={members.includes(p.id)}
              onChange={() => toggle(p.id)}
            />
            {p.first} {p.last}
          </label>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
        <Button onClick={save}>Сохранить</Button>

        {edit && (
          <Button variant="secondary" onClick={remove}>
            Удалить
          </Button>
        )}

        <Button variant="secondary" onClick={onClose}>
          Отмена
        </Button>
      </div>
    </Modal>
  );
}
