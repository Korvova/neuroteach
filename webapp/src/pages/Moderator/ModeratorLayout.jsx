import { NavLink, Outlet } from 'react-router-dom';
import styles from './ModeratorLayout.module.css';

export default function ModeratorLayout() {
  return (
    <div className={styles.wrap}>
      <nav className={styles.nav}>
        <NavLink to="participants" className={({isActive})=>isActive?styles.active:''}>Участники</NavLink>
        <NavLink to="groups"       className={({isActive})=>isActive?styles.active:''}>Группы</NavLink>
      </nav>
      <Outlet />
    </div>
  );
}
