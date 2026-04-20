/**
 * PermissionGuard Component
 * Conditionally renders children based on user role
 * Shows fallback UI if user lacks permission
 * 
 * Usage:
 * <PermissionGuard requiredRole="rspc_admin" fallback={<div>No access</div>}>
 *   <button>Create Project</button>
 * </PermissionGuard>
 */

import React from 'react';
import { Alert } from '@mantine/core';
import { Warning } from 'phosphor-react';
import { hasRSPCRole } from '../helper/rspcRoleService';

const PermissionGuard = ({
  children,
  requiredRoles = [],
  rspcRoles = null,
  fallback = null,
  showAlert = false,
}) => {
  if (!rspcRoles) {
    return fallback || null;
  }

  // Check if user has any of the required roles
  const hasPermission = requiredRoles.some((role) => hasRSPCRole(rspcRoles, role));

  if (!hasPermission) {
    if (showAlert) {
      return (
        <Alert icon={<Warning />} title="Access Denied" color="red">
          You do not have permission to access this feature. Please contact your administrator.
        </Alert>
      );
    }
    return fallback || null;
  }

  return children;
};

export default PermissionGuard;
