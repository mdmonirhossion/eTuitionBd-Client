import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const TutorRoute = ({ children }) => {
  const { user, role, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (user && (role === 'tutor' || role === 'admin')) {
    return children;
  }

  return <Navigate to="/" replace />;
};
