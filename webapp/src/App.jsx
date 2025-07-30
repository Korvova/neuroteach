import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage/LoginPage.jsx';

/* —–– студент —–– */
import CoursesPage from './pages/CoursesPage/CoursesPage.jsx';
import CourseDetailPage from './pages/CourseDetailPage/CourseDetailPage.jsx';
import LessonPage from './pages/LessonPage/LessonPage.jsx';
import CompletedLessonsPage from './pages/CompletedLessonsPage/CompletedLessonsPage.jsx';
import TasksPage from './pages/TasksPage/TasksPage.jsx';
import TaskDetailPage from './pages/TaskDetailPage/TaskDetailPage.jsx';
import NotificationsPage from './pages/NotificationsPage/NotificationsPage.jsx';

/* —–– layout —–– */
import AppLayout from './layout/AppLayout.jsx';

/* —–– модератор —–– */
import PaymentPage from './pages/Moderator/PaymentPage.jsx';
import { ModeratorProvider } from './context/ModeratorContext';
import ModeratorLayout from './pages/Moderator/ModeratorLayout.jsx';
import ParticipantsPage from './pages/Moderator/ParticipantsPage.jsx';
import GroupsPage from './pages/Moderator/GroupsPage.jsx';

/* —–– учитель —–– */
import { TeacherProvider } from './context/TeacherContext';
import TeacherLayout   from './pages/Teacher/TeacherLayout.jsx';
import ReviewPage      from './pages/Teacher/ReviewPage.jsx';
import ClarifyPage     from './pages/Teacher/ClarifyPage.jsx';

/* —–– создатель —–– */
import { CreatorProvider } from './context/CreatorContext';
import CreatorLayout        from './pages/Creator/CreatorLayout.jsx';
import CreatorCoursesPage   from './pages/Creator/CoursesPage.jsx';
import CreatorLessonsPage   from './pages/Creator/LessonsPage.jsx';
import CreatorTestsPage     from './pages/Creator/TestsPage.jsx';
import TestBuilderPage      from './pages/Creator/TestBuilderPage.jsx';
import LessonBuilderPage    from './pages/Creator/LessonBuilderPage.jsx';

export default function App() {
  return (
    <Routes>
      {/* ---------- публичная зона ---------- */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/forgot" element={<div>TODO: ForgotPasswordPage</div>} />

      {/* ---------- студент (AppLayout) ---------- */}
      <Route element={<AppLayout />}>
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:courseId" element={<CourseDetailPage />} />
        <Route path="/courses/:courseId/lesson/:lessonId" element={<LessonPage />} />

        <Route path="/profile/completed" element={<CompletedLessonsPage />} />
        <Route path="/profile/tasks" element={<TasksPage />} />
        <Route path="/profile/tasks/:taskId" element={<TaskDetailPage />} />
        <Route path="/profile/notifications" element={<NotificationsPage />} />
      </Route>

      {/* ---------- модератор ---------- */}
      <Route element={<AppLayout />}>
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

      {/* ---------- учитель ---------- */}
      <Route element={<AppLayout />}>
        <Route
          path="/teacher/*"
          element={
            <TeacherProvider>
              <TeacherLayout />
            </TeacherProvider>
          }
        >
          <Route path="review"  element={<ReviewPage />} />
          <Route path="clarify" element={<ClarifyPage />} />
        </Route>
      </Route>

      {/* ---------- создатель ---------- */}
      <Route element={<AppLayout />}>
        <Route
          path="/creator/*"
          element={
            <CreatorProvider>
              <CreatorLayout />
            </CreatorProvider>
          }
        >
          <Route path="courses" element={<CreatorCoursesPage />} />
          <Route path="lessons" element={<CreatorLessonsPage />} />
          <Route path="tests"   element={<CreatorTestsPage />} />
          <Route path="tests/:testId" element={<TestBuilderPage />} />
           <Route path="lessons/:lessonId" element={<LessonBuilderPage />} />
        </Route>
      </Route>

      {/* ---------- fallback ---------- */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
