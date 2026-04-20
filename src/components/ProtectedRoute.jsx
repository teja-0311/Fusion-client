/**
 * ProtectedRoute Component
 * Wraps routes that require specific RSPC roles
 * Redirects to permission denied page if user lacks required role
 * 
 * Usage:
 * <ProtectedRoute 
 *   component={ProjectCreate} 
 *   requiredRoles={['rspc_admin']}
 * />
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader, Center } from '@mantine/core';
import { hasRSPCRole } from '../helper/rspcRoleService';

const ProtectedRoute = ({ component: Component, requiredRoles = [], rspcRoles = null }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(!rspcRoles);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    if (!rspcRoles) {
      setIsLoading(true);
      return;
    }

    // Check if user has any of the required roles
    const userHasAccess = requiredRoles.some((role) => hasRSPCRole(rspcRoles, role));

    setHasAccess(userHasAccess);
    setIsLoading(false);

    if (!userHasAccess) {
      navigate('/rspc/permission-denied', { replace: true });
    }
  }, [rspcRoles, requiredRoles, navigate]);

  if (isLoading) {
    return (
      <Center style={{ height: '100vh' }}>
        <Loader />
      </Center>
    );
  }

  if (!hasAccess) {
    return null;
  }

  return <Component />;
};

export default ProtectedRoute;
