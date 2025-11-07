import { Navigate } from 'react-router';
import useAuthStore from '@/store/authStore';
import type React from 'react';

type ProtectedRouteProps = {
  children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());

  if (!isAuthenticated) {
    return <Navigate to="/register" replace />;
  }
  return (
    <>
      {children}
    </>
  )
}

export default ProtectedRoute


