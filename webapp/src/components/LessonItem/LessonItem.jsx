import styles from './LessonItem.module.css';

/**
 * Универсальный элемент списка уроков.
 *
 * Принимает:
 *  ▸ order        – порядковый номер (1, 2, 3…)
 *  ▸ title        – название
 *  ▸ unlocked     – открыт ли урок для студента
 *  ▸ statusCode   – строка статуса ('ON_REVIEW', 'COMPLETED', …)
 *    🔸 если пока отдаёте старый формат { code, label } – тоже сработает
 *  ▸ onClick      – обработчик клика
 */
export default function LessonItem({
  order,
  title,
  unlocked,
  statusCode,
  status,       // ← поддержим старый prop на всякий случай
  onClick,
}) {
  /* сопоставление «код → подпись» */
  const map = {
    ON_REVIEW   : 'ждёт проверки',
    NEED_CLARIFY: 'нужны уточнения',
    NEED_REWORK : 'вернули на доработку',
    COMPLETED   : 'пройден',
  };

  /* приводим к одному виду */
  const code  =
    statusCode ??
    (typeof status === 'string'
      ? status
      : status?.code || status?.status);          // {code}, {status} или строка

  const label = status?.label || map[code];

  /* css‑классы: базовый + заблокирован + «зелёный» если COMPLETED */
  const cls = [
    styles.item,
    !unlocked && styles.locked,
    code === 'COMPLETED' && styles.done,          // .done → светло‑зелёная заливка
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <li className={cls} onClick={unlocked ? onClick : undefined}>
      <span className={styles.text}>
        {order}.&nbsp;{title}
      </span>

      {code && code !== 'NOT_STARTED' && (
        <span className={`${styles.badge} ${styles[code]}`}>{label}</span>
      )}
    </li>
  );
}
