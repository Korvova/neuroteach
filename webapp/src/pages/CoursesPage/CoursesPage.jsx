import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CourseTile from '../../components/CourseTile/CourseTile';
import Modal from '../../components/Modal/Modal';
import styles from './CoursesPage.module.css';

const list = [
  { id: 'intro',   title: 'Вход в нейросети',         lessons: 10, disabled: false },
  { id: 'mkt',     title: 'Маркетинг и нейросети',    lessons: 10, disabled: true  },
  { id: 'msa',     title: 'Микросерверная архитектура', lessons: 8, disabled: true  },
  { id: 'tg',      title: 'Телеграм‑боты и Web App',  lessons: 8,  disabled: true  },
];

export default function CoursesPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleTileClick = (course) => {
    if (course.disabled) {
      setModalOpen(true);
    } else {
      navigate(`/courses/${course.id}`);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Доступные курсы</h2>

      <div className={styles.grid}>
        {list.map((c) => (
          <CourseTile
            key={c.id}
            title={c.title}
            lessons={c.lessons}
            disabled={c.disabled}
            onClick={() => handleTileClick(c)}
          />
        ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <p>Доступ к курсу закрыт.</p>
        <p style={{ marginTop: 6 }}>
          Свяжитесь с администратором:<br />
          <a href="https://t.me/your_admin" target="_blank" rel="noreferrer">
            @your_admin
          </a>
        </p>
      </Modal>
    </div>
  );
}
