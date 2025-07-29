import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage/LoginPage.jsx';
import CoursesPage from './pages/CoursesPage/CoursesPage.jsx';
import CourseDetailPage from './pages/CourseDetailPage/CourseDetailPage.jsx';
import LessonPage from './pages/LessonPage/LessonPage.jsx';
import CompletedLessonsPage from './pages/CompletedLessonsPage/CompletedLessonsPage.jsx';
import AppLayout from './layout/AppLayout.jsx';

import TasksPage from './pages/TasksPage/TasksPage.jsx';
import TaskDetailPage from './pages/TaskDetailPage/TaskDetailPage.jsx';
import NotificationsPage from './pages/NotificationsPage/NotificationsPage.jsx';



export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />

      {/* защищённая область */}
      <Route element={<AppLayout />}>
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:courseId" element={<CourseDetailPage />} />
        <Route path="/courses/:courseId/lesson/:lessonId" element={<LessonPage />} />





        <Route path="/profile/completed" element={<CompletedLessonsPage />} />
        

  <Route path="/profile/tasks" element={<TasksPage />} />
  <Route path="/profile/tasks/:taskId" element={<TaskDetailPage />} />

 <Route path="/profile/notifications" element={<NotificationsPage />} />

      </Route>

      <Route path="/forgot" element={<div>TODO: ForgotPasswordPage</div>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
