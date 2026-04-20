import { useState, useEffect } from "react";
import { Select, NumberInput, Textarea, Button, Alert, Grid } from "@mantine/core";
import { createExpenditure, fetchProjectIds } from "../api";
import { useSelector } from "react-redux";

const CATS = ["MANPOWER","EQUIPMENT","CONSUMABLES","TRAVEL","CONTINGENCY","OVERHEAD","OTHER"];
const INIT = { project_id:"", category:"MANPOWER", amount:"", purpose:"" };

export default function ExpenditureForm({ onSuccess }) {
  const [form, setForm]     = useState(INIT);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [msg, setMsg]           = useState(null);
  const role = useSelector(s => s.user.role);

  useEffect(() => {
    fetchProjectIds(role).then(r => {
      setProjects((Array.isArray(r.data)?r.data:[]).map(p=>({ value:String(p.pid), label:p.name })));
    }).catch(()=>{});
  }, [role]);

  const set = k => v => setForm(f=>({...f,[k]:v}));

  const handleSubmit = async () => {
    setLoading(true); setMsg(null);
    try {
      await createExpenditure(form);
      setMsg({ type:"success", text:"Expenditure request created." });
      setForm(INIT); onSuccess?.();
    } catch(e) { setMsg({ type:"error", text: e.response?.data?.error || "Request failed." }); }
    finally { setLoading(false); }
  };

  return (
    <div>
      {msg && <Alert color={msg.type==="success"?"green":"red"} mb="sm" withCloseButton onClose={()=>setMsg(null)}>{msg.text}</Alert>}
      <Grid gutter="sm">
        <Grid.Col span={12}>
          <Select label="Project" required searchable data={projects} value={form.project_id} onChange={set("project_id")} placeholder="Select project" />
        </Grid.Col>
        <Grid.Col span={6}>
          <Select label="Category" required data={CATS} value={form.category} onChange={set("category")} />
        </Grid.Col>
        <Grid.Col span={6}>
          <NumberInput label="Amount (₹)" required value={form.amount} onChange={set("amount")} min={0} />
        </Grid.Col>
        <Grid.Col span={12}>
          <Textarea label="Purpose / Justification" required value={form.purpose} onChange={e=>set("purpose")(e.target.value)} rows={4} />
        </Grid.Col>
      </Grid>
      <Button mt="md" onClick={handleSubmit} loading={loading}>Create Expenditure Request</Button>
    </div>
  );
}
