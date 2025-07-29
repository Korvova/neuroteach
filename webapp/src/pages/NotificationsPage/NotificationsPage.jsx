import { useState } from 'react';
import Table from '../../components/Table/Table';
import NotificationRow from '../../components/NotificationRow/NotificationRow';
import styles from './NotificationsPage.module.css';

/* мок‑уведомления */
const initial = [
  { id: 1, text: 'Файл по задаче «Промптинг» проверен', date: '29.07.2025', read: false },
  { id: 2, text: 'Урок «Демонстрация ChatGPT» открыт',     date: '29.07.2025', read: false },
  { id: 3, text: 'Подписка оплачена',                      date: '28.07.2025', read: true  },
];

export default function NotificationsPage() {
  const [list, setList] = useState(initial);

  const markRead = (id) =>
    setList(list.map((n) => (n.id === id ? { ...n, read: true } : n)));

  return (
    <div className={styles.wrap}>
      <h2>Уведомления</h2>

      <Table
        head={['Сообщение', 'Дата', '']}
        rows={list.map((n) => [
          <NotificationRow key={n.id} notif={n} onRead={markRead} />,
        ])}
      />
    </div>
  );
}
