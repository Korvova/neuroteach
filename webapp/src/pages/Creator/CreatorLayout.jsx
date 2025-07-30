import { NavLink, Outlet } from 'react-router-dom';
import styles from './CreatorLayout.module.css';

export default function CreatorLayout() {
  return (
    <div className={styles.wrap}>
      <nav className={styles.nav}>
        <NavLink to="courses"  className={({isActive})=>isActive?styles.active:''}>Создать курс</NavLink>
        <NavLink to="lessons"  className={({isActive})=>isActive?styles.active:''}>Создать урок</NavLink>
        <NavLink to="tests"    className={({isActive})=>isActive?styles.active:''}>Создать тест</NavLink>
      </nav>
      <Outlet />
    </div>
  );
}
