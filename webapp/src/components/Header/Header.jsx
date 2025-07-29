import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileMenu from '../ProfileMenu/ProfileMenu';
import styles from './Header.module.css';

export default function Header() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className={styles.bar}>
      <h1 className={styles.logo} onClick={() => navigate('/courses')}>
        Neuroteach
      </h1>

      <div className={styles.profile} onClick={() => setOpen((o) => !o)}>
        <span className={styles.avatar}>N</span>
        <span className={styles.caret} />
        <ProfileMenu open={open} close={() => setOpen(false)} />
      </div>
    </header>
  );
}
