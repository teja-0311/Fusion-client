import { host } from "../globalRoutes";

// ========================================================================
// PROJECT PROPOSALS
// ========================================================================
export const submitProposalRoute = `${host}/research_procedures/api/proposals/submit/`;
export const submitConsultancyRoute = `${host}/research_procedures/api/consultancy/submit/`;
export const saveDraftRoute = `${host}/research_procedures/api/proposals/draft/`;
export const resubmitProposalRoute = (projectId) =>
  `${host}/research_procedures/api/proposals/${projectId}/resubmit/`;

// ========================================================================
// PROJECT MANAGEMENT
// ========================================================================
export const fetchProjectsRoute = `${host}/research_procedures/api/projects/`;
export const projectDetailsRoute = (projectId) =>
  `${host}/research_procedures/api/projects/${projectId}/`;

export const registerProjectRoute = (projectId) =>
  `${host}/research_procedures/api/projects/${projectId}/register/`;

export const commenceProjectRoute = (projectId) =>
  `${host}/research_procedures/api/projects/${projectId}/commence/`;

export const closeProjectRoute = (projectId) =>
  `${host}/research_procedures/api/projects/${projectId}/close/`;

// ========================================================================
// STAFF MANAGEMENT
// ========================================================================
export const requestStaffRoute = `${host}/research_procedures/api/staff/request/`;

export const addAdCommitteeRoute = `${host}/research_procedures/api/staff/ad-committee/`;

export const staffSelectionReportRoute = `${host}/research_procedures/api/staff/selection-report/`;

export const committeeActionRoute = (staffId) =>
  `${host}/research_procedures/api/staff/${staffId}/recommend/`;

export const staffDecisionRoute = (staffId) =>
  `${host}/research_procedures/api/staff/${staffId}/decision/`;

export const staffDocumentUploadRoute = (staffId) =>
  `${host}/research_procedures/api/staff/${staffId}/documents/`;

export const fetchStaffRoute = `${host}/research_procedures/api/staff/`;

export const fetchStaffPositionsRoute = `${host}/research_procedures/api/staff/positions/`;

// ========================================================================
// BUDGET MANAGEMENT
// ========================================================================
export const fetchBudgetRoute = (projectId) =>
  `${host}/research_procedures/api/budget/${projectId}/`;

export const reallocateBudgetRoute = (projectId) =>
  `${host}/research_procedures/api/budget/${projectId}/reallocate/`;

// ========================================================================
// EXPENDITURE MANAGEMENT
// ========================================================================
export const createExpenditureRoute = `${host}/research_procedures/api/expenditures/`;

export const fetchExpendituresRoute = `${host}/research_procedures/api/expenditures/`;

export const expenditureDetailsRoute = (id) =>
  `${host}/research_procedures/api/expenditures/${id}/`;

export const trackExpenditureRoute = (id) =>
  `${host}/research_procedures/api/expenditures/${id}/track/`;

export const approveExpenditureRoute = (id) =>
  `${host}/research_procedures/api/expenditures/${id}/approve/`;

export const rejectExpenditureRoute = (id) =>
  `${host}/research_procedures/api/expenditures/${id}/reject/`;

export const expenditureHistoryRoute = (id) =>
  `${host}/research_procedures/api/expenditures/${id}/history/`;

// ========================================================================
// FUND REQUEST
// ========================================================================
export const requestFundRoute = `${host}/research_procedures/api/funds/request/`;

export const deanFundActionRoute = (fundId) =>
  `${host}/research_procedures/api/funds/${fundId}/dean-action/`;

export const directorApproveFundRoute = (fundId) =>
  `${host}/research_procedures/api/funds/${fundId}/director-approve/`;

// ========================================================================
// REPORTS
// ========================================================================
export const submitProgressReportRoute = `${host}/research_procedures/api/reports/submit/`;

export const generateReportRoute = `${host}/research_procedures/api/reports/generate/`;

export const scheduleReportRoute = `${host}/research_procedures/api/reports/schedule/`;

export const scheduledReportsRoute = `${host}/research_procedures/api/reports/scheduled/`;

// ========================================================================
// APPROVAL WORKFLOW
// ========================================================================
export const verifyProposalRoute = (projectId) =>
  `${host}/research_procedures/api/proposals/${projectId}/verify/`;

export const deanProposalActionRoute = (projectId) =>
  `${host}/research_procedures/api/proposals/${projectId}/dean-action/`;

// ========================================================================
// COMMITTEE
// ========================================================================
export const extendCommitteeDeadlineRoute = (committeeId) =>
  `${host}/research_procedures/api/committees/${committeeId}/extend-deadline/`;

// ========================================================================
// NOTIFICATIONS
// ========================================================================
export const fetchNotificationsRoute = `${host}/research_procedures/api/notifications/`;

export const markNotificationReadRoute = (id) =>
  `${host}/research_procedures/api/notifications/${id}/mark-read/`;

// ========================================================================
// UTILITIES
// ========================================================================
export const fetchCoPIsRoute = `${host}/research_procedures/api/utils/co-pis/`;

export const fetchFacultyIdsRoute = `${host}/research_procedures/api/utils/faculty-ids/`;

export const fetchProjectIdsRoute = `${host}/research_procedures/api/utils/project-ids/`;

// ========================================================================
// DASHBOARD
// ========================================================================
export const dashboardRoute = `${host}/research_procedures/api/dashboard/`;