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


import PaymentPage from './pages/Moderator/PaymentPage.jsx';


import { ModeratorProvider } from './context/ModeratorContext';
import ModeratorLayout from './pages/Moderator/ModeratorLayout.jsx';
import ParticipantsPage from './pages/Moderator/ParticipantsPage.jsx';
import GroupsPage from './pages/Moderator/GroupsPage.jsx';





export default function App() {
  return (
    <Routes>
      {/* ---------- публичная зона ---------- */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/forgot" element={<div>TODO: ForgotPasswordPage</div>} />

      {/* ---------- зона обычного пользователя (с Header) ---------- */}
      <Route element={<AppLayout />}>
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:courseId" element={<CourseDetailPage />} />
        <Route path="/courses/:courseId/lesson/:lessonId" element={<LessonPage />} />

        <Route path="/profile/completed" element={<CompletedLessonsPage />} />
        <Route path="/profile/tasks" element={<TasksPage />} />
        <Route path="/profile/tasks/:taskId" element={<TaskDetailPage />} />
        <Route path="/profile/notifications" element={<NotificationsPage />} />
      </Route>

      {/* ---------- зона модератора (тоже внутри AppLayout) ---------- */}
      <Route
        element={<AppLayout />}          /* <- даёт Header */
      >
        <Route
          path="/moderator/*"
          element={
            <ModeratorProvider>
              <ModeratorLayout />
            </ModeratorProvider>
          }
        >
          <Route path="participants" element={<ParticipantsPage />} />
          <Route path="groups" element={<GroupsPage />} />
          <Route path="payment" element={<PaymentPage />} />
        </Route>
      </Route>

      {/* ---------- fallback ---------- */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
