/**
 * useRSPCRole Hook
 * Custom hook for accessing RSPC role information and permissions
 * Provides role checking functions and state management
 * 
 * Usage:
 * const { roles, isPi, isHod, isRspcAdmin, canApprove, canRequestStaff } = useRSPCRole();
 */

import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { setRSPCRoles } from '../redux/userslice';
import rspcRoleService from './rspcRoleService';

export const useRSPCRole = () => {
  const dispatch = useDispatch();
  const rspcRoles = useSelector((state) => state.user.rspcRoles);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load roles if not already loaded
  useEffect(() => {
    if (!rspcRoles || (!rspcRoles.is_pi && !rspcRoles.is_hod && !rspcRoles.is_rspc_admin)) {
      const loadRoles = async () => {
        try {
          setLoading(true);
          const roles = await rspcRoleService.getRSPCRoles();
          dispatch(setRSPCRoles(roles));
        } catch (err) {
          setError(err);
          console.error('Failed to load RSPC roles:', err);
        } finally {
          setLoading(false);
        }
      };
      loadRoles();
    }
  }, [dispatch, rspcRoles]);

  return {
    roles: rspcRoles,
    isPi: rspcRoles?.is_pi || false,
    isHod: rspcRoles?.is_hod || false,
    isRspcAdmin: rspcRoles?.is_rspc_admin || false,
    department: rspcRoles?.department || null,
    piProjects: rspcRoles?.pi_projects || [],
    
    // Permission checks
    canApproveExpenditures: (amount) => rspcRoleService.canApproveExpenditures(rspcRoles, amount),
    canRequestStaff: () => rspcRoleService.canRequestStaff(rspcRoles),
    canCreateProject: () => rspcRoleService.canCreateProject(rspcRoles),
    hasRole: (role) => rspcRoleService.hasRSPCRole(rspcRoles, role),
    getRoleDisplayName: () => rspcRoleService.getRoleDisplayName(rspcRoles),
    
    // State
    loading,
    error,
  };
};

export default useRSPCRole;
