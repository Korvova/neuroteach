import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ProfileMenu from '../ProfileMenu/ProfileMenu';
import { useNotifications } from '../../context/NotificationsContext';
import styles from './Header.module.css';

export default function Header() {
  const [open, setOpen] = useState(false);
  const nav = useNavigate();
  const { pathname } = useLocation();

  // колокольчик нужен только НЕ модератору
  const showBell = !pathname.startsWith('/moderator');
  const { unreadCount = 0 } = useNotifications() || {};

  return (
    <header className={styles.bar}>
      {/* логотип → /courses (или /moderator/participants если уже там) */}
      <h1
        className={styles.logo}
        onClick={() => nav(pathname.startsWith('/moderator') ? '/moderator/participants' : '/courses')}
      >
        Neuroteach
      </h1>

      <div className={styles.actions}>
        {showBell && (
          <div className={styles.bell} onClick={() => nav('/profile/notifications')}>
            🛎
            {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
          </div>
        )}

        {/* аватар + выпадающее меню */}
        <div className={styles.profile} onClick={() => setOpen((o) => !o)}>
          <span className={styles.avatar}>N</span>
          <span className={styles.caret} />
          <ProfileMenu open={open} close={() => setOpen(false)} />
        </div>
      </div>
    </header>
  );
}
