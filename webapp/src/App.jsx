import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage/LoginPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/forgot" element={<div>TODO: ForgotPasswordPage</div>} />
      <Route path="/courses" element={<div>TODO: CoursesPage</div>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
