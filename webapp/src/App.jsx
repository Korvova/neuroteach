import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage/LoginPage.jsx';

import CoursesPage from './pages/CoursesPage/CoursesPage.jsx';
import CourseDetailPage from './pages/CourseDetailPage/CourseDetailPage.jsx';


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/courses" element={<CoursesPage />} />
      {/* заглушка для конкретного курса */}
      <Route path="/courses/:courseId" element={<CourseDetailPage />} />

      <Route path="/forgot" element={<div>TODO: ForgotPasswordPage</div>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
