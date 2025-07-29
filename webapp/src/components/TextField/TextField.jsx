import styles from './TextField.module.css';

export default function TextField({ label, type = 'text', ...rest }) {
  return (
    <label className={styles.wrap}>
      <span>{label}</span>
      <input type={type} {...rest} />
    </label>
  );
}
