import Modal from './Modal/Modal';
import { useState } from 'react';
import { useMod } from '../context/ModeratorContext';
import Button from './Button/Button';

export default function ParticipantFormModal({ open, onClose, edit }) {
  const { groups, addParticipant, editParticipant, slots } = useMod();

  // начальное состояние формы
  const [form, setF] = useState(
    edit || {
      first: '',
      last: '',
      email: '',
      password: '',
      group: groups[0]?.name || '',
      cert: null,           // файл‑сертификат
    }
  );

  // универсальный сеттер
  const set = (key) => (e) =>
    setF({ ...form, [key]: key === 'cert' ? e.target.files[0] : e.target.value });

  // сохранить
  const save = () => {
    if (!edit && slots <= 0) {
      alert('Нет свободных доступов!');
      return;
    }

    edit ? editParticipant(form) : addParticipant(form);
    if (!edit) alert('После создания спишется 1 доступ');
    onClose();
  };

  // удалить (только в режиме edit)
  const remove = () => {
    if (window.confirm('Удалить участника?')) {
      alert('Участник удалён (mock).');
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <h3 style={{ marginBottom: 12 }}>
        {edit ? 'Редактировать участника' : 'Новый участник'}
      </h3>

      {/* текстовые поля */}
      {['first', 'last', 'email', 'password'].map((f) => (
        <input
          key={f}
          placeholder={f === 'first' ? 'Имя' : f === 'last' ? 'Фамилия' : f}
          type={f === 'password' ? 'password' : 'text'}
          value={form[f]}
          onChange={set(f)}
          style={{ margin: '6px 0', padding: 8, width: '100%' }}
        />
      ))}

      {/* выбор группы */}
      <select value={form.group} onChange={set('group')} style={{ width: '100%', margin: '6px 0', padding: 8 }}>
        {groups.map((g) => (
          <option key={g.id}>{g.name}</option>
        ))}
      </select>

      {/* сертификат */}
      <input
        type="file"
        accept=".pdf,image/*"
        onChange={set('cert')}
        style={{ margin: '6px 0' }}
      />

      {/* кнопки */}
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
