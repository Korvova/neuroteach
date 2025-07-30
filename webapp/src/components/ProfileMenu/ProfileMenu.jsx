import { useNavigate, useLocation } from 'react-router-dom';
import styles from './ProfileMenu.module.css';
import { logout } from '../../Services/auth';

export default function ProfileMenu({ open, close }) {
  const nav = useNavigate();
  const { pathname } = useLocation();
  if (!open) return null;

  const go = (p) => {
    nav(p);
    close();
  };

  const isStaff =
    pathname.startsWith('/moderator') ||
    pathname.startsWith('/teacher') ||
    pathname.startsWith('/creator');

  return (
    <ul className={styles.menu} onClick={(e) => e.stopPropagation()}>
      {!isStaff && (
        <>
          <li onClick={() => go('/profile/completed')}>Пройденные уроки</li>
          <li onClick={() => go('/profile/tasks')}>Задания</li>
          <li onClick={() => go('/profile/notifications')}>Уведомления</li>
         
        </>
      )}

<li className={styles.sep} onClick={() => { logout(); go('/'); }}>Выйти</li>


    </ul>
  );
}
