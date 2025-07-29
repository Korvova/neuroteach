import Header from '../components/Header/Header';
import { Outlet } from 'react-router-dom';
import styles from './AppLayout.module.css';

export default function AppLayout() {
  return (
    <div className={styles.root}>
      <Header />
      <main className={styles.main}>
        <Outlet />          {/* ← здесь будут рисоваться вложенные страницы */}
      </main>
    </div>
  );
}
