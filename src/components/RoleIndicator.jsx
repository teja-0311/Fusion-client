/**
 * RoleIndicator Component
 * Displays current user's RSPC role with badge/icon
 * Shows in header or dashboard for context
 * 
 * Usage:
 * <RoleIndicator rspcRoles={userRoles} />
 */

import React from 'react';
import { Badge, Group, Tooltip } from '@mantine/core';
import { ShieldCheck, User, Crown } from 'phosphor-react';
import { getRoleDisplayName } from '../helper/rspcRoleService';

const RoleIndicator = ({ rspcRoles }) => {
  if (!rspcRoles) {
    return null;
  }

  const getRoleBadge = () => {
    if (rspcRoles.is_rspc_admin) {
      return (
        <Tooltip label="RSPC Administrator - Full system access">
          <Badge leftSection={<Crown size={12} />} color="red" variant="filled">
            RSPC Admin
          </Badge>
        </Tooltip>
      );
    }
    if (rspcRoles.is_hod) {
      return (
        <Tooltip label={`Head of Department (${rspcRoles.department || 'N/A'})`}>
          <Badge leftSection={<ShieldCheck size={12} />} color="blue" variant="filled">
            HOD
          </Badge>
        </Tooltip>
      );
    }
    if (rspcRoles.is_pi) {
      return (
        <Tooltip label="Principal Investigator - Can manage own projects">
          <Badge leftSection={<User size={12} />} color="green" variant="filled">
            PI
          </Badge>
        </Tooltip>
      );
    }

    return (
      <Badge color="gray" variant="light">
        Faculty
      </Badge>
    );
  };

  const getRolePermissions = () => {
    const permissions = [];
    if (rspcRoles.is_pi) permissions.push('Create Projects');
    if (rspcRoles.is_pi) permissions.push('Request Staff');
    if (rspcRoles.is_pi) permissions.push('Submit Expenditures');
    if (rspcRoles.is_hod) permissions.push('Approve Expenditures');
    if (rspcRoles.is_hod) permissions.push('View Department Projects');
    if (rspcRoles.is_rspc_admin) permissions.push('System Administration');
    if (rspcRoles.is_rspc_admin) permissions.push('View All Projects');

    return permissions;
  };

  return (
    <Group spacing="md">
      {getRoleBadge()}
      {rspcRoles.department && (
        <Badge color="cyan" variant="outline">
          {rspcRoles.department}
        </Badge>
      )}
    </Group>
  );
};

export default RoleIndicator;
