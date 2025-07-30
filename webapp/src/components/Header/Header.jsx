import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ProfileMenu from '../ProfileMenu/ProfileMenu';
import { useNotifications } from '../../context/NotificationsContext';
import styles from './Header.module.css';

export default function Header() {
  const [open, setOpen] = useState(false);
  const nav = useNavigate();
  const { pathname } = useLocation();

  /* staff‑роли: модератор, учитель, создатель */
  const isStaff =
    pathname.startsWith('/moderator') ||
    pathname.startsWith('/teacher') ||
    pathname.startsWith('/creator');

  /* колокольчик только у студентов */
  const { unreadCount = 0 } = useNotifications() || {};
  const showBell = !isStaff;

  /* переход по логотипу */
  const home = pathname.startsWith('/moderator')
    ? '/moderator/participants'
    : pathname.startsWith('/teacher')
    ? '/teacher/review'
    : pathname.startsWith('/creator')
    ? '/creator/courses'
    : '/courses';

  return (
    <header className={styles.bar}>
      <h1 className={styles.logo} onClick={() => nav(home)}>
        Neuroteach 
      </h1>

      <div className={styles.actions}>
        {showBell && (
          <div
            className={styles.bell}
            onClick={() => nav('/profile/notifications')}
          >
            🛎
            {unreadCount > 0 && (
              <span className={styles.badge}>{unreadCount}</span>
            )}
          </div>
        )}

        <div className={styles.profile} onClick={() => setOpen((o) => !o)}>
          <span className={styles.avatar}>N</span>
          <span className={styles.caret} />
          <ProfileMenu open={open} close={() => setOpen(false)} />
        </div>
      </div>
    </header>
  );
}
