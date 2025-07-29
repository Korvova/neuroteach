import Header from '../components/Header/Header';
import { Outlet } from 'react-router-dom';
import { NotificationsProvider } from '../context/NotificationsContext';
import styles from './AppLayout.module.css';

export default function AppLayout() {
  return (
    <NotificationsProvider>
      <div className={styles.root}>
        <Header />
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </NotificationsProvider>
  );
}
