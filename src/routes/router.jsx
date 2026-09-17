import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';

import { Home } from '../pages/public/Home';
import { Tuitions } from '../pages/public/Tuitions';
import { TuitionDetails } from '../pages/public/TuitionDetails';
import { Tutors } from '../pages/public/Tutors';
import { TutorDetails } from '../pages/public/TutorDetails';
import { About } from '../pages/public/About';
import { Contact } from '../pages/public/Contact';
import { Login } from '../pages/public/Login';
import { Register } from '../pages/public/Register';
import { ForgotPassword } from '../pages/public/ForgotPassword';
import { NotFound } from '../pages/public/NotFound';

import { PrivateRoute } from './PrivateRoute';
import { StudentRoute } from './StudentRoute';
import { TutorRoute } from './TutorRoute';
import { AdminRoute } from './AdminRoute';

import { StudentDashboard } from '../pages/student/StudentDashboard';
import { StudentTuitions } from '../pages/student/StudentTuitions';
import { CreateTuition } from '../pages/student/CreateTuition';
import { EditTuition } from '../pages/student/EditTuition';
import { StudentApplications } from '../pages/student/StudentApplications';
import { StudentPayments } from '../pages/student/StudentPayments';

import { TutorDashboard } from '../pages/tutor/TutorDashboard';
import { TutorApplications } from '../pages/tutor/TutorApplications';
import { OngoingTuitions } from '../pages/tutor/OngoingTuitions';
import { TutorRevenue } from '../pages/tutor/TutorRevenue';

import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { AdminUsers } from '../pages/admin/AdminUsers';
import { AdminTuitions } from '../pages/admin/AdminTuitions';
import { AdminPayments } from '../pages/admin/AdminPayments';

import { Profile } from '../pages/student/Profile';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: 'tuitions', element: <Tuitions /> },
      { path: 'tuitions/:id', element: <TuitionDetails /> },
      { path: 'tutors', element: <Tutors /> },
      { path: 'tutors/:id', element: <TutorDetails /> },
      { path: 'about', element: <About /> },
      { path: 'contact', element: <Contact /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'forgot-password', element: <ForgotPassword /> },
      ],
  },
  {
    path: 'student',
    element: (
      <PrivateRoute>
        <StudentRoute>
          <DashboardLayout />
        </StudentRoute>
      </PrivateRoute>
    ),
    children: [
      { path: 'dashboard', element: <StudentDashboard /> },
      { path: 'tuitions', element: <StudentTuitions /> },
      { path: 'tuitions/create', element: <CreateTuition /> },
      { path: 'tuitions/:id/edit', element: <EditTuition /> },
      { path: 'applications', element: <StudentApplications /> },
      { path: 'payments', element: <StudentPayments /> },
      { path: 'profile', element: <Profile /> },
    ],
  },
  {
    path: 'tutor',
    element: (
      <PrivateRoute>
        <TutorRoute>
          <DashboardLayout />
        </TutorRoute>
      </PrivateRoute>
    ),
    children: [
      { path: 'dashboard', element: <TutorDashboard /> },
      { path: 'applications', element: <TutorApplications /> },
      { path: 'ongoing-tuitions', element: <OngoingTuitions /> },
      { path: 'revenue', element: <TutorRevenue /> },
      { path: 'profile', element: <Profile /> },
    ],
  },
  {
    path: 'admin',
    element: (
      <PrivateRoute>
        <AdminRoute>
          <DashboardLayout />
        </AdminRoute>
      </PrivateRoute>
    ),
    children: [
      { path: 'dashboard', element: <AdminDashboard /> },
      { path: 'users', element: <AdminUsers /> },
      { path: 'tuitions', element: <AdminTuitions /> },
      { path: 'payments', element: <AdminPayments /> },
      { path: 'profile', element: <Profile /> },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);
