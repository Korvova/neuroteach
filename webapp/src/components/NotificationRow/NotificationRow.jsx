import styles from './NotificationRow.module.css';
import clsx from 'clsx';

export default function NotificationRow({ notif, onRead }) {
  const { id, text, date, read } = notif;

  return (
    <tr
      className={clsx(!read && styles.unread)}
      onClick={() => !read && onRead(id)}
    >
      <td>{text}</td>
      <td>{date}</td>
      <td>
        {read ? '✔︎' : <button className={styles.btn}>Прочитать</button>}
      </td>
    </tr>
  );
}
