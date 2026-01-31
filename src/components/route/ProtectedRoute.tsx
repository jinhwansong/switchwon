import { Navigate, Outlet } from 'react-router-dom';
import Header from '../common/Header';
import { useAuthStore } from '@/store/useAuthStore';

export default function ProtectedRoute() {
  const { isAuthenticated } = useAuthStore((state) => state);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
