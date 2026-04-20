/**
 * RSPC Module — API Layer
 * Uses FusionERP's existing auth token + host from globalRoutes.
 */
import axios from "axios";
import { host } from "../../routes/globalRoutes";

const getToken = () => localStorage.getItem("authToken");
const authHeader = () => ({
  Authorization: `Token ${getToken()}`,
  "Content-Type": "application/json",
});
const multipartHeader = () => ({
  Authorization: `Token ${getToken()}`,
});
const BASE = `${host}/research_procedures`;  // NOTE: no trailing /api — urls.py paths are directly under this
const cfg = {};

// ── Dashboard ──────────────────────────────────────────────────────────────
export const fetchDashboard        = ()        => axios.get(`${BASE}/dashboard/`,                           { headers: authHeader(), ...cfg });

// ── Projects ───────────────────────────────────────────────────────────────
export const fetchProjects         = (p={})    => axios.get(`${BASE}/projects/`,                            { headers: authHeader(), params: p, ...cfg });
export const fetchProjectDetails   = (pid)     => axios.get(`${BASE}/projects/${pid}/`,                     { headers: authHeader(), ...cfg });

// ── Proposals ──────────────────────────────────────────────────────────────
// FIX 1: was /add-project/ → correct endpoints below
export const submitProposal        = (d)       => axios.post(`${BASE}/proposals/submit/`, d,                { headers: multipartHeader(), ...cfg });
export const submitConsultancy     = (d)       => axios.post(`${BASE}/consultancy/submit/`, d,              { headers: multipartHeader(), ...cfg });
export const saveDraft             = (d)       => axios.post(`${BASE}/proposals/draft/`, d,                 { headers: multipartHeader(), ...cfg });
export const resubmitProposal      = (pid, d)  => axios.post(`${BASE}/proposals/${pid}/resubmit/`, d,       { headers: authHeader(), ...cfg });
export const verifyProposal        = (pid, d)  => axios.post(`${BASE}/proposals/${pid}/verify/`, d,         { headers: authHeader(), ...cfg });
export const vetProposal           = (pid, d)  => axios.post(`${BASE}/proposals/${pid}/vet/`, d,            { headers: authHeader(), ...cfg });
export const deanProjectAction     = (pid, d)  => axios.post(`${BASE}/proposals/${pid}/dean-action/`, d,    { headers: authHeader(), ...cfg });

// ── Project lifecycle ──────────────────────────────────────────────────────
export const registerProject       = (pid, d)  => axios.post(`${BASE}/projects/${pid}/register/`, d,        { headers: multipartHeader(), ...cfg });
export const commenceProject       = (pid, d)  => axios.post(`${BASE}/projects/${pid}/commence/`, d,        { headers: authHeader(), ...cfg });
export const closeProject          = (pid, d)  => axios.post(`${BASE}/projects/${pid}/close/`, d,           { headers: multipartHeader(), ...cfg });

// ── Staff ──────────────────────────────────────────────────────────────────
// FIX 2: was /add-project/ for requestStaff, /get-staff/ etc.
export const fetchStaff            = (p={})    => axios.get(`${BASE}/staff/`,                               { headers: authHeader(), params: p, ...cfg });
export const fetchStaffPositions   = (p={})    => axios.get(`${BASE}/staff/positions/`,                     { headers: authHeader(), params: p, ...cfg });
export const requestStaff          = (d)       => axios.post(`${BASE}/staff/request/`, d,                   { headers: authHeader(), ...cfg });
export const addAdCommittee        = (d)       => axios.post(`${BASE}/staff/ad-committee/`, d,              { headers: multipartHeader(), ...cfg });
export const staffSelectionReport  = (d)       => axios.post(`${BASE}/staff/selection-report/`, d,          { headers: multipartHeader(), ...cfg });
export const submitCommitteeAction = (sid, d)  => axios.post(`${BASE}/staff/${sid}/recommend/`, d,          { headers: authHeader(), ...cfg });
export const staffDecision         = (sid, d)  => axios.post(`${BASE}/staff/${sid}/decision/`, d,           { headers: authHeader(), ...cfg });
export const withdrawStaffRequest  = (sid)     => axios.post(`${BASE}/staff/${sid}/withdraw/`, {},          { headers: authHeader(), ...cfg });
export const uploadStaffDocuments  = (sid, d)  => axios.post(`${BASE}/staff/${sid}/documents/`, d,          { headers: multipartHeader(), ...cfg });

// ── Budget ─────────────────────────────────────────────────────────────────
// FIX 3: was /get-budget/ → budget/<pid>/
export const fetchBudget           = (pid)     => axios.get(`${BASE}/budget/${pid}/`,                       { headers: authHeader(), ...cfg });
export const reallocateBudget      = (pid, d)  => axios.post(`${BASE}/budget/${pid}/reallocate/`, d,        { headers: authHeader(), ...cfg });

// ── Expenditures ───────────────────────────────────────────────────────────
export const fetchExpenditures     = (p={})    => axios.get(`${BASE}/expenditures/`,                        { headers: authHeader(), params: p, ...cfg });
export const createExpenditure     = (d)       => axios.post(`${BASE}/expenditures/`, d,                    { headers: authHeader(), ...cfg });
export const fetchExpenditureDetails = (eid)   => axios.get(`${BASE}/expenditures/${eid}/`,                 { headers: authHeader(), ...cfg });
export const trackExpenditure      = (eid)     => axios.get(`${BASE}/expenditures/${eid}/track/`,           { headers: authHeader(), ...cfg });
export const approveExpenditure    = (eid, d)  => axios.post(`${BASE}/expenditures/${eid}/approve/`, d,     { headers: authHeader(), ...cfg });
export const rejectExpenditure     = (eid, d)  => axios.post(`${BASE}/expenditures/${eid}/reject/`, d,      { headers: authHeader(), ...cfg });

// ── Funds ──────────────────────────────────────────────────────────────────
export const requestFund           = (d)       => axios.post(`${BASE}/funds/request/`, d,                   { headers: authHeader(), ...cfg });
export const directorApproveFund   = (fid, d)  => axios.post(`${BASE}/funds/${fid}/director-approve/`, d,   { headers: authHeader(), ...cfg });
export const deanFundAction        = (fid, d)  => axios.post(`${BASE}/funds/${fid}/dean-action/`, d,        { headers: authHeader(), ...cfg });

// ── Reports ────────────────────────────────────────────────────────────────
export const submitProgressReport  = (d)       => axios.post(`${BASE}/reports/submit/`, d,                  { headers: multipartHeader(), ...cfg });
export const generateReport        = (d)       => axios.post(`${BASE}/reports/generate/`, d,                { headers: authHeader(), ...cfg });
export const scheduleReport        = (d)       => axios.post(`${BASE}/reports/schedule/`, d,                { headers: authHeader(), ...cfg });
export const fetchScheduledReports = ()        => axios.get(`${BASE}/reports/scheduled/`,                   { headers: authHeader(), ...cfg });

// ── Notifications ──────────────────────────────────────────────────────────
export const fetchNotifications    = (p={})    => axios.get(`${BASE}/notifications/`,                       { headers: authHeader(), params: p, ...cfg });
export const markNotificationRead  = (nid)     => axios.post(`${BASE}/notifications/${nid}/mark-read/`, {}, { headers: authHeader(), ...cfg });

// ── Utils ──────────────────────────────────────────────────────────────────
// FIX 4: was /get-profIDs/ → utils/faculty-ids/  (also response shape: data.faculty not data)
export const fetchFacultyIds       = ()        => axios.get(`${BASE}/utils/faculty-ids/`,                   { headers: authHeader(), ...cfg });
// FIX 5: was /get-PIDs/ → utils/project-ids/
export const fetchProjectIds       = (p={})    => {
  const params = (p && typeof p === "object" && !Array.isArray(p)) ? p : {};
  return axios
    .get(`${BASE}/utils/project-ids/`, { headers: authHeader(), params, ...cfg })
    .then((r) => {
      const projects = Array.isArray(r.data) ? r.data : (Array.isArray(r.data?.projects) ? r.data.projects : []);
      return { ...r, data: projects };
    });
};
export const fetchCoPIs            = ()        => axios.get(`${BASE}/utils/co-pis/`,                        { headers: authHeader(), ...cfg });
