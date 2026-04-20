/**
 * ExpenditureManagement.jsx — Thin View
 * Read  → selectors.get_expenditures_for_user  GET /research_procedures/api/expenditures/
 * Read  → selectors.track_expenditure_status   GET /research_procedures/api/expenditures/<id>/track/
 * Write → services.create_expenditure_request  via ExpenditureForm
 * Write → services.approve_expenditure         via ExpendituresTable
 * Write → services.reject_expenditure          via ExpendituresTable
 */
import { useEffect, useState } from "react";
import { Tabs, Select, Group, Button, Title, Alert, Paper, Text, NumberInput, Loader } from "@mantine/core";
import { fetchExpenditures, trackExpenditure } from "./api";
import RSPCBreadcrumbs from "./components/RSPCBreadcrumbs";
import ExpendituresTable from "./components/ExpendituresTable";
import ExpenditureForm from "./components/ExpenditureForm";

const STATUS_OPTS = [
  { value:"", label:"All" },
  ...["PENDING","PI_APPROVED","HOD_APPROVED","APPROVED","REJECTED"].map(s=>({ value:s, label:s })),
];

export default function ExpenditureManagement() {
  const [activeTab, setActiveTab]   = useState("0");
  const [items, setItems]           = useState([]);
  const [loading, setLoading]       = useState(false);
  const [statusFilter, setFilter]   = useState("");
  const [trackId, setTrackId]       = useState("");
  const [trackData, setTrackData]   = useState(null);
  const [trackErr, setTrackErr]     = useState("");

  const load = () => {
    setLoading(true);
    const params = statusFilter ? { status: statusFilter } : {};
    fetchExpenditures(params)
      .then(r => setItems(Array.isArray(r.data) ? r.data : r.data?.results || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [statusFilter]);

  const handleTrack = async () => {
    setTrackErr(""); setTrackData(null);
    if (!trackId) return;
    try { const r = await trackExpenditure(trackId); setTrackData(r.data); }
    catch { setTrackErr("No expenditure found with that ID."); }
  };

  const tabItems = [
    {
      title: "All Expenditures",
      component: (
        <>
          <Group mb="md" gap="sm" align="flex-end" wrap="wrap">
            <Select
              label="Filter by Status"
              data={STATUS_OPTS}
              value={statusFilter}
              onChange={v => setFilter(v||"")}
              clearable style={{ width: 200 }}
            />
            <NumberInput
              label="Track by ID"
              value={trackId}
              onChange={v => setTrackId(String(v))}
              placeholder="Expenditure ID"
              style={{ width: 160 }}
            />
            <Button variant="light" mt={24} onClick={handleTrack}>Track</Button>
            <Button variant="light" mt={24} onClick={load}>Refresh</Button>
          </Group>

          {trackErr && <Alert color="red" mb="sm">{trackErr}</Alert>}
          {trackData && (
            <Paper withBorder p="sm" mb="sm" radius="md">
              <Text fw={600}>Track Result — Expenditure #{trackData.eid}</Text>
              <Text size="sm">Status: <b>{trackData.status}</b> | Approver: <b>{trackData.current_approver||"N/A"}</b> | Escalation: <b>{trackData.escalation_status}</b></Text>
              <Button size="xs" variant="subtle" mt={4} onClick={() => setTrackData(null)}>Close</Button>
            </Paper>
          )}

          {loading ? <Group justify="center" p="xl"><Loader /></Group>
            : <ExpendituresTable expenditures={items} onRefresh={load} />}
        </>
      ),
    },
    {
      title: "New Request",
      component: <ExpenditureForm onSuccess={() => { setActiveTab("0"); load(); }} />,
    },
  ];

  return (
    <>
      <RSPCBreadcrumbs />
      <Title order={3} mt="md" mb="xs">Expenditure Management</Title>
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List mb="md">
          {tabItems.map((t,i) => <Tabs.Tab key={i} value={String(i)}>{t.title}</Tabs.Tab>)}
        </Tabs.List>
        {tabItems.map((t,i) => <Tabs.Panel key={i} value={String(i)}>{t.component}</Tabs.Panel>)}
      </Tabs>
    </>
  );
}
