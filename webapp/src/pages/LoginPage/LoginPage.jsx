import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card/Card';
import TextField from '../../components/TextField/TextField';
import Button from '../../components/Button/Button';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: auth request
    navigate('/courses');
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
