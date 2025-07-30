import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card/Card';
import TextField from '../../components/TextField/TextField';
import Button from '../../components/Button/Button';
import { login } from '../../Services/auth';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [pass,  setPass]  = useState('');
  const [err,   setErr]   = useState('');
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();


    const role = await login(email, pass);
    if (!role) return setErr('Неверный e‑mail или пароль');

    const home = {
      CREATOR:   '/creator/courses',
      MODERATOR: '/moderator/participants',
      TEACHER:   '/teacher/review',
      STUDENT:   '/courses',
    }[role] || '/courses';

    nav(home);


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
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          />

          {err && <p className={styles.error}>{err}</p>}

          <Button type="submit">Войти</Button>

          <Button
            type="button"
            variant="link"
            onClick={() => nav('/forgot')}
          >
            Забыли пароль?
          </Button>
        </form>
      </Card>
    </div>
  );
}
