import styles from './Modal.module.css';

export default function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div
        className={styles.card}
        onClick={(e) => e.stopPropagation()}   /* чтобы клик по карточке не закрывал */
      >
        {children}
    {/*  <button className={styles.btn} onClick={onClose}>Ок</button> */} 
      </div>
    </div>
  );
}
