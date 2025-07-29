import styles from './CourseTile.module.css';
import clsx from 'clsx';

/**
 * Плашка одного курса.
 * @param {string}  title    – название курса
 * @param {number}  lessons  – количество уроков
 * @param {boolean} disabled – true ⇒ курс закрыт
 * @param {Function} onClick – обработчик клика
 */
export default function CourseTile({ title, lessons, disabled, onClick }) {
  return (
    <button
      className={clsx(styles.tile, disabled && styles.disabled)}
      onClick={onClick}
      aria-disabled={disabled}          /* семантика: элемент “выключен” */
    >
      <span className={styles.name}>{title}</span>
      <span className={styles.count}>{lessons} уроков</span>
    </button>
  );
}
