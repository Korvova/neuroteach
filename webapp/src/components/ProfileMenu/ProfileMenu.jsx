import { useNavigate, useLocation } from 'react-router-dom';
import styles from './ProfileMenu.module.css';

export default function ProfileMenu({ open, close }) {
  const nav = useNavigate();
  const { pathname } = useLocation();
  if (!open) return null;

  const go = (p) => {
    nav(p);
    close();
  };

  // для модератора только «Выйти»
  if (pathname.startsWith('/moderator'))
    return (
      <ul className={styles.menu} onClick={(e) => e.stopPropagation()}>
        <li className={styles.sep} onClick={() => go('/')}>Выйти</li>
      </ul>
    );

  return (
    <ul className={styles.menu} onClick={(e) => e.stopPropagation()}>
      <li onClick={() => go('/profile/completed')}>Пройденные уроки</li>
      <li onClick={() => go('/profile/tasks')}>Задания</li>
      <li onClick={() => go('/profile/notifications')}>Уведомления</li>
      <li className={styles.sep} onClick={() => go('/')}>Выйти</li>
    </ul>
  );
}
