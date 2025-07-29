import { useNavigate } from 'react-router-dom';
import Table from '../../components/Table/Table';
import StatusTag from '../../components/StatusTag/StatusTag';
import styles from './TasksPage.module.css';

/* мок‑данные */
const tasks = [
  {
    id: 't1',
    title: 'Подготовить презентацию по Midjourney',
    status: { code: 'pending', label: 'Ждёт выполнения' },
  },
  {
    id: 't2',
    title: 'Сдать PDF‑отчёт «Промптинг»',
    status: { code: 'review', label: 'На проверке' },
  },
  {
    id: 't3',
    title: 'Исправить замечания по ДЗ №1',
    status: { code: 'redo', label: 'Возврат на доработку' },
  },
];

export default function TasksPage() {
  const navigate = useNavigate();

  const rows = tasks.map((t) => [
    <button
      key={t.id}
      className={styles.link}
      onClick={() => navigate(`/profile/tasks/${t.id}`)}
    >
      {t.title}
    </button>,
    <StatusTag {...t.status} key="s" />,
  ]);

  return (
    <div className={styles.wrap}>
      <h2>Задания</h2>
      <Table head={['Задание', 'Статус']} rows={rows} />
    </div>
  );
}
