import Table from '../../components/Table/Table';
import styles from './CompletedLessonsPage.module.css';

/* мок‑данные */
const rows = [
  ['Введение (просмотр)',      '29.07.2025', '✔︎'],
  ['Введение (файл)',          '29.07.2025', '✔︎'],
  ['Введение (тест)',          '29.07.2025', '✔︎'],
];

export default function CompletedLessonsPage() {
  return (
    <div className={styles.wrap}>
      <h2>Пройденные уроки</h2>
      <Table
        head={['Урок', 'Дата', 'Статус']}
        rows={rows}
      />
    </div>
  );
}
