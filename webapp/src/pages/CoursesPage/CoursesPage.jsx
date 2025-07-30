import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CourseTile from '../../components/CourseTile/CourseTile';
import Modal from '../../components/Modal/Modal';
import { getCourses } from '../../Services/courses';
import styles from './CoursesPage.module.css';

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getCourses().then(setCourses);
  }, []);

  const handleTileClick = (c) => {
    // правило: только курс id = 1 открыт, остальные серые
    if (c.id !== 1) return setModalOpen(true);
    navigate(`/courses/${c.id}`);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Доступные курсы</h2>

 <div className={styles.grid}>
  {courses.map((c) => (
    <CourseTile
      key={c.id}
      title={c.title}
      lessons={c.price ?? 0}   // Если позже добавите lessons.length — замените здесь
      disabled={c.id !== 1}
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
