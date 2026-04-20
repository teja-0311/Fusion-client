import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    name: "",
    username: "User",
    roll_no: "",
    roles: ["Guest-User"],
    role: "Guest-User",
    accessibleModules: {}, // Format---> {role: {module: true}}
    currentAccessibleModules: {}, // Format---> {module: true}
    totalNotifications: 0,
    // RSPC Role-Based Access Control
    rspcRoles: {
      is_pi: false,
      is_hod: false,
      is_rspc_admin: false,
      department: null,
      pi_projects: [],
    },
    rspcApprovals: [], // Pending approvals for user
    rspcPermissions: [], // Fine-grained permissions
  },
  reducers: {
    setUserName: (state, action) => {
      state.username = action.payload;
    },
    setName: (state, action) => {
      state.name = action.payload;
    },
    setRollNo: (state, action) => {
      state.roll_no = action.payload;
    },
    setRoles: (state, action) => {
      state.roles = action.payload;
    },
    setRole: (state, action) => {
      state.role = action.payload;
    },
    setAccessibleModules: (state, action) => {
      state.accessibleModules = action.payload;
    },
    setCurrentAccessibleModules: (state) => {
      state.currentAccessibleModules =
        state.accessibleModules[state.role] || {};
    },
    setTotalNotifications: (state, action) => {
      state.totalNotifications = action.payload;
    },
    clearUserName: (state) => {
      state.username = "User";
    },
    clearRoles: (state) => {
      state.roles = null;
    },
    // RSPC Role-based reducers
    setRSPCRoles: (state, action) => {
      state.rspcRoles = action.payload;
    },
    setRSPCApprovals: (state, action) => {
      state.rspcApprovals = action.payload;
    },
    setRSPCPermissions: (state, action) => {
      state.rspcPermissions = action.payload;
    },
    clearRSPCRoles: (state) => {
      state.rspcRoles = {
        is_pi: false,
        is_hod: false,
        is_rspc_admin: false,
        department: null,
        pi_projects: [],
      };
      state.rspcApprovals = [];
      state.rspcPermissions = [];
    },
  },
});

export const {
  setUserName,
  setName,
  setRollNo,
  setRoles,
  setRole,
  setAccessibleModules,
  setCurrentAccessibleModules,
  setTotalNotifications,
  clearUserName,
  clearRoles,
  setRSPCRoles,
  setRSPCApprovals,
  setRSPCPermissions,
  clearRSPCRoles,
} = userSlice.actions;
export default userSlice.reducer;
