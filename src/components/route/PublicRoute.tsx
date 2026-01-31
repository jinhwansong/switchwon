import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

export default function PublicRoute() {
  const {isAuthenticated} = useAuthStore((state) => state);

  if (isAuthenticated) {
    return <Navigate to="/exchange" replace />;
  }

  return <Outlet />;
}
