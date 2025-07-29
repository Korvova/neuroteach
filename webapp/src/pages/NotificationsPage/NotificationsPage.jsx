import { useNotifications } from '../../context/NotificationsContext';
import NotificationRow from '../../components/NotificationRow/NotificationRow';
import styles from './NotificationsPage.module.css';

export default function NotificationsPage() {
  const { list, markRead, markAllRead } = useNotifications();

  return (
    <div className={styles.wrap}>
      <h2>Уведомления</h2>

      {list.some((n) => !n.read) && (
        <button className={styles.readAll} onClick={markAllRead}>
          Прочитать все
        </button>
      )}

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Сообщение</th>
            <th>Дата</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {list.map((n) => (
            <NotificationRow key={n.id} notif={n} onRead={markRead} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
