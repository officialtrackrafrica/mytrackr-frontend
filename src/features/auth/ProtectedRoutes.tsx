// src/components/auth/ProtectedRoute.tsx
import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../../hooks/useUser';

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user, isLoading, isError } = useUser();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue" />
      </div>
    );
  }

  if (isError || !user) {
    // Redirect them to login, but save where they were trying to go
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};