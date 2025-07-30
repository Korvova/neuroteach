import styles from './LessonItem.module.css';

const MAP = {
  ON_REVIEW   : 'ждёт проверки',
  NEED_CLARIFY: 'нужны уточнения',
  NEED_REWORK : 'вернули на доработку',
  COMPLETED   : 'пройден',
};

export default function LessonItem({ order, title, unlocked,
                                     statusCode, onClick }) {
  const label = MAP[statusCode];         // подпись или undefined

  return (
    <li
      className={`${styles.item}
                  ${!unlocked && styles.locked}
                  ${statusCode === 'COMPLETED' && styles.done}`}
      onClick={unlocked ? onClick : undefined}
    >
      <span className={styles.text}>{order}. {title}</span>

      {label && (
        <span className={`${styles.badge} ${styles[statusCode]}`}>
          {label}
        </span>
      )}
    </li>
  );
}
