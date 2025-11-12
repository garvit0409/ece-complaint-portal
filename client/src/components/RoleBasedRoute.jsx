import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const RoleBasedRoute = ({ children, allowedRoles }) => {
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkRole = () => {
      const role = localStorage.getItem('role');
      if (role) {
        setUserRole(role);
      } else {
        setUserRole(null);
      }
      setIsLoading(false);
    };

    checkRole();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!userRole) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    // Redirect to appropriate dashboard based on role
    const roleRedirects = {
      student: '/student/dashboard',
      teacher: '/teacher/dashboard',
      mentor: '/mentor/dashboard',
      hod: '/hod/dashboard'
    };

    return <Navigate to={roleRedirects[userRole] || '/login'} replace />;
  }

  return children;
};

export default RoleBasedRoute;
