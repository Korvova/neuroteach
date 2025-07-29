import styles from './Button.module.css';
import clsx from 'clsx';

export default function Button({ children, variant = 'primary', ...rest }) {
  return (
    <button
      className={clsx(styles.btn, styles[variant])}
      {...rest}
    >
      {children}
    </button>
  );
}
