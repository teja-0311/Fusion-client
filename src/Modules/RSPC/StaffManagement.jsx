/**
 * StaffManagement.jsx — Thin View
 * Read  → selectors.get_staff_for_user     GET /research_procedures/api/get-staff/
 * Read  → selectors.get_staff_positions    GET /research_procedures/api/get-staff-positions/
 * Write → services.request_staff           via StaffRequestForm
 * Write → services.staff_decision          POST /research_procedures/api/staff-decision/
 * Write → services.committee_action        POST /research_procedures/api/committee-action/
 */
import { useEffect, useState } from "react";
import { Tabs, Button, Group, Title, Alert, Paper, Text, Loader, Table, ScrollArea } from "@mantine/core";
import { useSelector } from "react-redux";
import { fetchStaff, fetchStaffPositions, staffDecision, submitCommitteeAction, withdrawStaffRequest } from "./api";
import RSPCBreadcrumbs from "./components/RSPCBreadcrumbs";
import StaffTable from "./components/StaffTable";
import StaffRequestForm from "./components/StaffRequestForm";

export default function StaffManagement() {
  const [activeTab, setActiveTab]   = useState("0");
  const [staff, setStaff]           = useState([]);
  const [positions, setPositions]   = useState([]);
  const [staffRecords, setStaffRecords] = useState([]);
  const [positionsMeta, setPositionsMeta] = useState({});
  const [loading, setLoading]       = useState(false);
  const [selected, setSelected]     = useState(null);
  const [msg, setMsg]               = useState(null);
  const role = String(useSelector(s => s.user.role) || "").toLowerCase().replace(/\s+/g, "_");
  const isPiRole = role.includes("pi");
  const isHodRole = role.includes("hod") || role.includes("head_of_department");
  const isRspcAuthority = role.includes("rspc_admin") || (role.includes("dean") && role.includes("rspc"));

  const loadStaff = () => {
    setLoading(true);
    fetchStaff()
      .then((r) => {
        const payload = r.data || {};
        setStaff(Array.isArray(payload) ? payload : payload?.staff || payload?.results || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadStaff();
    fetchStaffPositions()
      .then((r) => {
        const payload = r.data || {};
        setPositions(Array.isArray(payload) ? payload : payload?.positions || payload?.results || []);
        setStaffRecords(Array.isArray(payload?.staff_records) ? payload.staff_records : []);
        setPositionsMeta({
          scope: payload?.scope || null,
          department_employee_summary: payload?.department_employee_summary || null,
          institute_employee_summary: payload?.institute_employee_summary || null,
        });
      })
      .catch(() => {});
  }, []);

  const handleDecision = async (action) => {
    setMsg(null);
    try {
      await staffDecision(selected.sid, { action });
      const actionWord = action === "Approve" ? "approved" : "rejected";
      setMsg({ type: "success", text: `Staff ${actionWord} successfully.` });
      setSelected(null); loadStaff();
    } catch { setMsg({ type: "error", text: "Action failed." }); }
  };

  const handleRecommend = async (recommendation) => {
    setMsg(null);
    try {
      await submitCommitteeAction(selected.sid, { recommendation });
      setMsg({ type: "success", text: "Recommendation submitted." });
      loadStaff();
    } catch { setMsg({ type: "error", text: "Failed to submit recommendation." }); }
  };

  const handleWithdraw = async (item) => {
    setMsg(null);
    try {
      await withdrawStaffRequest(item.sid);
      setMsg({ type: "success", text: "Staff request withdrawn successfully." });
      loadStaff();
    } catch (e) {
      setMsg({ type: "error", text: e.response?.data?.error || "Withdraw failed." });
    }
  };

  const tabItems = [
    {
      title: "Staff List",
      component: (
        <>
          <Group justify="flex-end" mb="sm">
            <Button variant="light" size="xs" onClick={loadStaff}>Refresh</Button>
          </Group>
          {loading ? <Group justify="center" p="xl"><Loader /></Group>
            : (
              <StaffTable
                staff={staff}
                actionLabel={isPiRole ? "Withdraw" : "Manage"}
                actionColor={isPiRole ? "red" : "blue"}
                canAction={(s) => {
                  if (!isPiRole) return true;
                  return ["DRAFT", "COMMITTEE_PENDING", "HOD_PENDING", "RSPC_PENDING"].includes(s.approval_status);
                }}
                onAction={(s) => {
                  setMsg(null);
                  if (isPiRole) {
                    handleWithdraw(s);
                    return;
                  }
                  setSelected(s);
                }}
              />
            )}

          {selected && !isPiRole && (
            <Paper withBorder p="md" mt="md" radius="md">
                <Text fw={600} mb="xs">
                  Actions for: {selected.person} ({selected.type}) —{" "}
                  <Text span c="dimmed">{selected.approval_status}</Text>
                </Text>
                <Group gap="sm" wrap="wrap">
                  {((selected.approval_status === "HOD_PENDING" && isHodRole) ||
                    (selected.approval_status === "RSPC_PENDING" && isRspcAuthority)) && (
                    <>
                      <Button color="green" size="xs" onClick={() => handleDecision("Approve")}>Approve</Button>
                      <Button color="red"   size="xs" onClick={() => handleDecision("Reject")}>Reject</Button>
                    </>
                  )}
                {selected.approval_status === "COMMITTEE_PENDING" && (
                  <>
                    <Button color="green" size="xs" onClick={() => handleRecommend("APPROVE")}>Recommend Approve</Button>
                    <Button color="red"   size="xs" onClick={() => handleRecommend("REJECT")}>Recommend Reject</Button>
                  </>
                )}
                <Button variant="default" size="xs" onClick={() => setSelected(null)}>Cancel</Button>
              </Group>
            </Paper>
          )}
        </>
      ),
    },
    {
      title: "Request Staff",
      component: <StaffRequestForm onSuccess={() => { setActiveTab("0"); loadStaff(); }} />,
    },
    {
      title: "Positions",
      component: (
          <>
            <Text size="sm" mb="xs" c="dimmed">
              Scope: {(positionsMeta.scope?.role || "user").toUpperCase()}
              {positionsMeta.scope?.department ? ` • Department: ${positionsMeta.scope.department}` : ""}
            </Text>

            {positions.length === 0 ? (
              <Text c="dimmed" size="sm" mb="md">No position data available.</Text>
            ) : (
              <ScrollArea mb="md">
                <Table withTableBorder withColumnBorders>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Project ID</Table.Th>
                      <Table.Th>Project Name</Table.Th>
                      <Table.Th>PI</Table.Th>
                      <Table.Th>Department</Table.Th>
                      <Table.Th>Positions</Table.Th>
                      <Table.Th>Incumbents</Table.Th>
                      <Table.Th>Vacancy</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {positions.map(p => (
                      <Table.Tr key={p.spid}>
                        <Table.Td>{p.pid}</Table.Td>
                        <Table.Td>{p.project_name || "-"}</Table.Td>
                        <Table.Td>{p.project_pi || "-"}</Table.Td>
                        <Table.Td>{p.project_dept || "-"}</Table.Td>
                        <Table.Td>{JSON.stringify(p.positions || {})}</Table.Td>
                        <Table.Td>{JSON.stringify(p.incumbents || {})}</Table.Td>
                        <Table.Td>{p.vacancy}</Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </ScrollArea>
            )}

            {staffRecords.length > 0 && (
              <>
                <Text fw={600} mb={6}>Staff Under Visible Projects</Text>
                <ScrollArea mb="md">
                  <Table withTableBorder withColumnBorders>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Staff ID</Table.Th>
                        <Table.Th>Project</Table.Th>
                        <Table.Th>Person</Table.Th>
                        <Table.Th>Type</Table.Th>
                        <Table.Th>Status</Table.Th>
                        <Table.Th>Salary</Table.Th>
                        <Table.Th>Duration (mo)</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {staffRecords.map((s) => (
                        <Table.Tr key={`sr-${s.sid}`}>
                          <Table.Td>{s.sid}</Table.Td>
                          <Table.Td>{s.project_name || s.project_id}</Table.Td>
                          <Table.Td>{s.person || "-"}</Table.Td>
                          <Table.Td>{s.type || "-"}</Table.Td>
                          <Table.Td>{s.approval_status || "-"}</Table.Td>
                          <Table.Td>₹{Number(s.salary || 0).toLocaleString()}</Table.Td>
                          <Table.Td>{s.duration || "-"}</Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </ScrollArea>
              </>
            )}

            {positionsMeta.department_employee_summary && (
              <>
                <Text fw={600} mb={6}>
                  Department Employee Summary ({positionsMeta.department_employee_summary.department || "N/A"})
                </Text>
                <Text size="sm" mb="xs">
                  Total: {positionsMeta.department_employee_summary.total_employees} | PI: {positionsMeta.department_employee_summary.pi_count} | HOD: {positionsMeta.department_employee_summary.hod_count} | Staff: {positionsMeta.department_employee_summary.staff_count}
                </Text>
                <ScrollArea mb="md">
                  <Table withTableBorder withColumnBorders>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Username</Table.Th>
                        <Table.Th>Name</Table.Th>
                        <Table.Th>User Type</Table.Th>
                        <Table.Th>Department</Table.Th>
                        <Table.Th>Roles</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {(positionsMeta.department_employee_summary.employee_details || []).map((e) => (
                        <Table.Tr key={e.username}>
                          <Table.Td>{e.username}</Table.Td>
                          <Table.Td>{e.name}</Table.Td>
                          <Table.Td>{e.user_type || "-"}</Table.Td>
                          <Table.Td>{e.department || "-"}</Table.Td>
                          <Table.Td>{(e.roles || []).join(", ") || "-"}</Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </ScrollArea>
              </>
            )}

            {positionsMeta.institute_employee_summary && (
              <>
                <Text fw={600} mb={6}>Institute Employee Summary</Text>
                <Text size="sm" mb="xs">
                  Total: {positionsMeta.institute_employee_summary.total_employees} | PI: {positionsMeta.institute_employee_summary.pi_count} | HOD: {positionsMeta.institute_employee_summary.hod_count} | Staff: {positionsMeta.institute_employee_summary.staff_count}
                </Text>
                <ScrollArea mb="md">
                  <Table withTableBorder withColumnBorders>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Username</Table.Th>
                        <Table.Th>Name</Table.Th>
                        <Table.Th>User Type</Table.Th>
                        <Table.Th>Department</Table.Th>
                        <Table.Th>Roles</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {(positionsMeta.institute_employee_summary.employee_details || []).map((e) => (
                        <Table.Tr key={`all-${e.username}`}>
                          <Table.Td>{e.username}</Table.Td>
                          <Table.Td>{e.name}</Table.Td>
                          <Table.Td>{e.user_type || "-"}</Table.Td>
                          <Table.Td>{e.department || "-"}</Table.Td>
                          <Table.Td>{(e.roles || []).join(", ") || "-"}</Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </ScrollArea>
                <ScrollArea>
                  <Table withTableBorder withColumnBorders>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Department</Table.Th>
                        <Table.Th>Total Employees</Table.Th>
                        <Table.Th>PI</Table.Th>
                        <Table.Th>HOD</Table.Th>
                        <Table.Th>Staff</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {(positionsMeta.institute_employee_summary.departments || []).map((d) => (
                        <Table.Tr key={d.department}>
                          <Table.Td>{d.department}</Table.Td>
                          <Table.Td>{d.total_employees}</Table.Td>
                          <Table.Td>{d.pi_count}</Table.Td>
                          <Table.Td>{d.hod_count}</Table.Td>
                          <Table.Td>{d.staff_count}</Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </ScrollArea>
              </>
            )}
          </>
        ),
    },
  ];

  return (
    <>
      <RSPCBreadcrumbs />
      <Title order={3} mt="md" mb="xs">Staff Management</Title>
      {msg && (
        <Alert color={msg.type === "success" ? "green" : "red"} mb="sm"
          withCloseButton onClose={() => setMsg(null)}>
          {msg.text}
        </Alert>
      )}
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List mb="md">
          {tabItems.map((t, i) => <Tabs.Tab key={i} value={String(i)}>{t.title}</Tabs.Tab>)}
        </Tabs.List>
        {tabItems.map((t, i) => (
          <Tabs.Panel key={i} value={String(i)}>{t.component}</Tabs.Panel>
        ))}
      </Tabs>
    </>
  );
}
