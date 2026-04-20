/**
 * RSPC Role Detection Service
 * Fetches user's RSPC roles and permissions from backend
 * Implements role-based access control (RBAC) for the RSPC module
 */

import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000';

/**
 * Get current user's RSPC roles and permissions
 * @returns {Promise} {is_pi, is_hod, is_rspc_admin, department, pi_projects}
 */
export const getRSPCRoles = async () => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await axios.get(`${API_BASE}/rspc/utils/get-user-roles/`, {
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch RSPC roles:', error);
    throw error;
  }
};

/**
 * Get PI-specific data
 * @returns {Promise} List of projects where user is PI
 */
export const getMyProjects = async () => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await axios.get(`${API_BASE}/rspc/projects/`, {
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
      params: { pi_only: true },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch PI projects:', error);
    throw error;
  }
};

/**
 * Get pending approvals for current user
 * Filters based on user's role (PI/HOD/RSPC Admin)
 * @returns {Promise} List of expenditures pending approval
 */
export const getPendingApprovals = async () => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await axios.get(
      `${API_BASE}/rspc/expenditures/pending-approvals/`,
      {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Failed to fetch pending approvals:', error);
    throw error;
  }
};

/**
 * Get staff requests requiring action from current user
 * @returns {Promise} List of staff requests
 */
export const getPendingStaffRequests = async () => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await axios.get(`${API_BASE}/rspc/staff/pending/`, {
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch pending staff requests:', error);
    throw error;
  }
};

/**
 * Validate if user can perform an action on a project
 * @param {number} projectId - Project ID to check
 * @param {string} action - Action to validate (create_expenditure, request_staff, etc.)
 * @returns {Promise} {can_perform: boolean, reason: string}
 */
export const validateProjectPermission = async (projectId, action) => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await axios.get(
      `${API_BASE}/rspc/projects/${projectId}/validate-permission/`,
      {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        params: { action },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Failed to validate project permission:', error);
    throw error;
  }
};

/**
 * Get committee member info if user is a committee member
 * @param {number} staffId - Staff request ID
 * @returns {Promise} Committee member details
 */
export const getCommitteeInfo = async (staffId) => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await axios.get(
      `${API_BASE}/rspc/staff/${staffId}/committee-member/`,
      {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Failed to fetch committee info:', error);
    throw error;
  }
};

/**
 * Check if user has specific RSPC role
 * Useful for frontend permission checking
 * @param {Object} userRoles - Object returned from getRSPCRoles()
 * @param {string} role - Role to check ('pi', 'hod', 'rspc_admin')
 * @returns {boolean}
 */
export const hasRSPCRole = (userRoles, role) => {
  if (!userRoles) return false;
  
  const roleMap = {
    pi: userRoles.is_pi,
    hod: userRoles.is_hod,
    rspc_admin: userRoles.is_rspc_admin,
  };
  
  return roleMap[role] || false;
};

/**
 * Check if user can approve expenditure
 * PI can approve expenditures <= 50K
 * HOD can approve 50K-200K
 * RSPC Admin can approve any amount
 * @param {Object} userRoles - User roles from getRSPCRoles()
 * @param {number} amount - Expenditure amount
 * @returns {boolean}
 */
export const canApproveExpenditures = (userRoles, amount) => {
  if (!userRoles) return false;
  
  if (userRoles.is_rspc_admin) return true; // Can approve any amount
  if (userRoles.is_hod && amount <= 200000) return true; // HOD up to 200K
  if (userRoles.is_pi && amount <= 50000) return true; // PI up to 50K
  
  return false;
};

/**
 * Check if user can request staff
 * Only PI and Co-PI can request staff
 * @param {Object} userRoles - User roles from getRSPCRoles()
 * @returns {boolean}
 */
export const canRequestStaff = (userRoles) => {
  if (!userRoles) return false;
  return userRoles.is_pi; // Only PI can request staff
};

/**
 * Check if user can create project
 * Only RSPC Admin can create projects
 * @param {Object} userRoles - User roles from getRSPCRoles()
 * @returns {boolean}
 */
export const canCreateProject = (userRoles) => {
  if (!userRoles) return false;
  return userRoles.is_rspc_admin;
};

/**
 * Get user's role display name
 * @param {Object} userRoles - User roles from getRSPCRoles()
 * @returns {string} Display name for current role
 */
export const getRoleDisplayName = (userRoles) => {
  if (!userRoles) return 'Guest';
  
  if (userRoles.is_rspc_admin) return 'RSPC Admin';
  if (userRoles.is_hod) return 'HOD';
  if (userRoles.is_pi) return 'Principal Investigator (PI)';
  
  return 'Faculty';
};

/**
 * Check if user is committee member for a staff request
 * @param {Object} userRoles - User roles from getRSPCRoles()
 * @returns {boolean}
 */
export const isCommitteeMember = (userRoles) => {
  if (!userRoles) return false;
  return userRoles.is_committee_member || false;
};

export default {
  getRSPCRoles,
  getMyProjects,
  getPendingApprovals,
  getPendingStaffRequests,
  validateProjectPermission,
  getCommitteeInfo,
  hasRSPCRole,
  canApproveExpenditures,
  canRequestStaff,
  canCreateProject,
  getRoleDisplayName,
  isCommitteeMember,
};
