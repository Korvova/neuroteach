import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileMenu from '../ProfileMenu/ProfileMenu';
import { useNotifications } from '../../context/NotificationsContext';
import styles from './Header.module.css';

export default function Header() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { unreadCount } = useNotifications();

  return (
    <header className={styles.bar}>
      <h1 className={styles.logo} onClick={() => navigate('/courses')}>
        Neuroteach
      </h1>

      <div className={styles.actions}>
        {/* колокольчик */}
        <div className={styles.bell} onClick={() => navigate('/profile/notifications')}>
          🛎
          {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
        </div>

        {/* профиль */}
        <div className={styles.profile} onClick={() => setOpen((o) => !o)}>
          <span className={styles.avatar}>N</span>
          <span className={styles.caret} />
          <ProfileMenu open={open} close={() => setOpen(false)} />
        </div>
      </div>
    </header>
  );
}
