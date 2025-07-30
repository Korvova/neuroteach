import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../Services/auth';
import Card from '../../components/Card/Card';
import TextField from '../../components/TextField/TextField';
import Button from '../../components/Button/Button';
import styles from './LessonPage.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const role = await login(email, pass);
      console.log('Роль:', role);
      if (!role) {
        setErr('Неверный e‑mail или пароль');
        return;
      }
      const home = {
        CREATOR: '/creator/courses',
        MODERATOR: '/moderator/participants',
        TEACHER: '/teacher/review',
        STUDENT: '/courses',
      }[role] || '/courses';
      nav(home);
    } catch (e) {
      console.error('Ошибка входа:', e);
      setErr('Ошибка сервера');
    }
  };

  return (
    <div className={styles.container}>
      <Card>
        <h1 className={styles.title}>Neuroteach</h1>
        <form onSubmit={handleSubmit}>
          <TextField label="E‑mail" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <TextField label="Пароль" type="password" required value={pass} onChange={(e) => setPass(e.target.value)} />
          {err && <p className={styles.error}>{err}</p>}
          <Button type="submit">Войти</Button>
        </form>
      </Card>
    </div>
  );
}