import styles from './LessonItem.module.css';
import clsx from 'clsx';

export default function LessonItem({ title, unlocked, onClick }) {
  return (
    <li
      className={clsx(styles.item, !unlocked && styles.locked)}
      onClick={onClick}
      aria-disabled={!unlocked}
    >
      {title}
    </li>
  );
}
