// src/pages/LessonPage/LessonPage.jsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getLesson } from '../../Services/lessons'
import Card from '../../components/Card/Card'
import RichEditor from '../../components/RichEditor'
import Button from '../../components/Button/Button'
import styles from './LessonPage.module.css'

export default function LessonPage() {
  // Если в вашем роуте параметр называется lessonId:
  const { courseId, lessonId } = useParams()
  // Или, если вы в роутинге прописали просто :id:
  // const { courseId, id: lessonId } = useParams()

  const [lesson, setLesson] = useState(null)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (!lessonId) return

    getLesson(lessonId)
      .then((data) => setLesson(data))
      .catch((e) => {
        console.error('Ошибка загрузки урока', e)
        setError('Не удалось загрузить урок')
      })
  }, [lessonId])

  if (error) {
    return <div className={styles.error}>{error}</div>
  }

  if (!lesson) {
    return <div>Загрузка урока…</div>
  }

  return (
    <div className={styles.container}>
      <Card>
        <h1 className={styles.title}>{lesson.title}</h1>

        {/* В зависимости от типа урока рендерим контент */}
        {lesson.checkType === 'VIEW' && (
          <RichEditor content={lesson.content} readOnly />
        )}

        {lesson.checkType === 'FILE' && (
          <div>
            <p>Загрузите файл по заданию:</p>
            {/* сюда ваш FileUploader */}
          </div>
        )}

        {lesson.checkType === 'TEST' && (
          <Button onClick={() => navigate(`/courses/${courseId}/lesson/${lessonId}/test`)}>
            Пройти тест
          </Button>
        )}

        <Button onClick={() => navigate(-1)}>Назад к списку уроков</Button>
      </Card>
    </div>
  )
}
