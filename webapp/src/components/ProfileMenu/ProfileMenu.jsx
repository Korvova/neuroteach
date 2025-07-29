import { useNavigate } from 'react-router-dom';
import styles from './ProfileMenu.module.css';

export default function ProfileMenu({ open, close }) {
  const navigate = useNavigate();
  if (!open) return null;

  const go = (path) => {
    navigate(path);
    close();
  };

  return (
    <ul className={styles.menu} onClick={(e) => e.stopPropagation()}>
      <li onClick={() => go('/profile/completed')}>Пройденные уроки</li>
      <li onClick={() => go('/profile/tasks')}>Задания</li>
      <li onClick={() => go('/profile/notifications')}>Уведомления</li>
      <li className={styles.sep} onClick={() => go('/')}>Выйти</li>
    </ul>
  );
}
