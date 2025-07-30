// src/pages/LoginPage/LoginPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card/Card';
import TextField from '../../components/TextField/TextField';
import Button from '../../components/Button/Button';
import { login, logout } from '../../Services/auth';
import styles from './LoginPage.module.css';


export default function LoginPage() {
  const [email, setEmail]     = useState('');
  const [pass, setPass]       = useState('');
  const [error, setError]     = useState('');
  const navigate               = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
     console.log('🔑 handleSubmit called', { email, pass });
    setError('');
    logout(); // на всякий случай очистим старый токен

try {


    const role = await login(email, pass);
    if (!role) {
      setError('Неверный e‑mail или пароль');
      return;
    }
    // Редирект по роли
    switch (role) {
      case 'CREATOR':
        navigate('/creator/courses');
        break;
      case 'MODERATOR':
        navigate('/moderator/participants');
        break;
      case 'TEACHER':
        navigate('/teacher/review');
        break;
      default: // STUDENT
        navigate('/courses');
    }


   


   } catch (err) {
     console.error('🔑 handleSubmit unexpected error', err);
     setError('Ошибка при попытке войти, смотрите консоль');
   }


  };

  return (
    <div className={styles.container}>
      <Card>
        <h1 className={styles.title}>Neuroteach</h1>
        <form onSubmit={handleSubmit}>
          <TextField
            label="E‑mail"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Пароль"
            type="password"
            required
            autoComplete="current-password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          />
          {error && <p className={styles.error}>{error}</p>}
          <Button type="submit">Войти</Button>
          <Button
            type="button"
            variant="link"
            onClick={() => navigate('/forgot')}
          >
            Забыли пароль?
          </Button>
        </form>
      </Card>
    </div>
  );
}
