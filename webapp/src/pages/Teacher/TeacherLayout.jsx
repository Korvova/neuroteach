import { NavLink, Outlet } from 'react-router-dom';
import styles from './TeacherLayout.module.css';

export default function TeacherLayout() {
  return (
    <div className={styles.wrap}>
      <nav className={styles.nav}>
        <NavLink to="review"   className={({isActive})=>isActive?styles.active:''}>Ждут подтверждения</NavLink>
        <NavLink to="clarify"  className={({isActive})=>isActive?styles.active:''}>Ждут уточнения</NavLink>
      </nav>
      <Outlet />
    </div>
  );
}
