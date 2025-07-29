import styles from './StatusTag.module.css';
import clsx from 'clsx';

const palette = {
  pending:  styles.yellow,
  ready:    styles.green,
  clarify:  styles.blue,
  review:   styles.purple,
  redo:     styles.red,
};

export default function StatusTag({ code, label }) {
  return (
    <span className={clsx(styles.tag, palette[code])}>{label}</span>
  );
}
