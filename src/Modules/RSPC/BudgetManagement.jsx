/**
 * BudgetManagement.jsx — Thin View
 * Read  → selectors.get_budget_summary   GET /research_procedures/api/get-budget/
 * Write → services.reallocate_budget     POST /research_procedures/api/get-budget/
 */
import { useEffect, useState } from "react";
import { Select, NumberInput, Textarea, Button, Group, Title, Alert, Paper, Text, Loader, Grid } from "@mantine/core";
import { useSelector } from "react-redux";
import { fetchBudget, reallocateBudget, fetchProjectIds } from "./api";
import RSPCBreadcrumbs from "./components/RSPCBreadcrumbs";
import BudgetCard from "./components/BudgetCard";

const CATS = ["manpower","travel","contingency","consumables","equipments"].map(c=>({value:c,label:c.charAt(0).toUpperCase()+c.slice(1)}));

export default function BudgetManagement() {
  const [projects, setProjects]     = useState([]);
  const [pid, setPid]               = useState("");
  const [budget, setBudget]         = useState(null);
  const [loading, setLoading]       = useState(false);
  const [showForm, setShowForm]     = useState(false);
  const [msg, setMsg]               = useState(null);
  const [realloc, setRealloc]       = useState({ from_category:"", to_category:"", amount:"", justification:"" });
  const role = useSelector(s => s.user.role);

  useEffect(() => {
    fetchProjectIds(role)
      .then(r => setProjects((Array.isArray(r.data)?r.data:[]).map(p=>({ value:String(p.pid), label:p.name }))))
      .catch(()=>{});
  }, [role]);

  const loadBudget = (id) => {
    if (!id) return;
    setLoading(true); setBudget(null); setMsg(null);
    fetchBudget(id)
      .then(r => setBudget(r.data))
      .catch(() => setMsg({ type:"error", text:"Failed to load budget." }))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadBudget(pid); }, [pid]);

  const handleRealloc = async () => {
    setMsg(null);
    try {
      await reallocateBudget(pid, realloc);
      setMsg({ type:"success", text:"Budget reallocated successfully." });
      setShowForm(false); loadBudget(pid);
    } catch(e) { setMsg({ type:"error", text: e.response?.data?.error || "Reallocation failed." }); }
  };

  const setR = k => v => setRealloc(r=>({...r,[k]:v}));

  return (
    <>
      <RSPCBreadcrumbs />
      <Title order={3} mt="md" mb="xs">Budget Management</Title>

      {msg && <Alert color={msg.type==="success"?"green":"red"} mb="sm" withCloseButton onClose={()=>setMsg(null)}>{msg.text}</Alert>}

      <Group mb="lg" align="flex-end">
        <Select
          label="Select Project"
          placeholder="Choose a project"
          data={projects}
          value={pid}
          onChange={v => setPid(v||"")}
          searchable
          style={{ minWidth: 300 }}
        />
      </Group>

      {loading && <Group justify="center" p="xl"><Loader /></Group>}

      {!pid && !loading && (
        <Text c="dimmed" ta="center" mt="xl">Select a project to view its budget.</Text>
      )}

      {budget && !loading && (
        <>
          <BudgetCard budget={budget} />
          <Group mt="md">
            <Button color="grape" variant="light" onClick={() => setShowForm(v=>!v)}>
              {showForm ? "Cancel Reallocation" : "Reallocate Budget"}
            </Button>
          </Group>

          {showForm && (
            <Paper withBorder p="md" mt="md" radius="md">
              <Text fw={600} mb="sm">Budget Reallocation</Text>
              <Grid gutter="sm">
                <Grid.Col span={6}>
                  <Select label="From Category" required data={CATS} value={realloc.from_category} onChange={setR("from_category")} />
                </Grid.Col>
                <Grid.Col span={6}>
                  <Select label="To Category" required data={CATS} value={realloc.to_category} onChange={setR("to_category")} />
                </Grid.Col>
                <Grid.Col span={6}>
                  <NumberInput label="Amount (₹)" required value={realloc.amount} onChange={setR("amount")} min={0} />
                </Grid.Col>
                <Grid.Col span={12}>
                  <Textarea label="Justification" value={realloc.justification} onChange={e=>setR("justification")(e.target.value)} rows={3} />
                </Grid.Col>
              </Grid>
              <Button mt="md" color="grape" onClick={handleRealloc}>Confirm Reallocation</Button>
            </Paper>
          )}
        </>
      )}
    </>
  );
}
