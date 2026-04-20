import { useState, useEffect } from "react";
import { TextInput, NumberInput, Select, Textarea, Checkbox, Button, Group, Alert, Grid } from "@mantine/core";
import { requestStaff, fetchProjectIds } from "../api";
import { useSelector } from "react-redux";

const TYPES = ["JRF","SRF","RA","PROJECT_ASSISTANT","PROJECT_SCIENTIST","OTHER"];
const INIT = { project_id:"", person:"", biodata_number:"", start_date:"", duration:12, eligibility:"", type:"JRF", salary:"", has_funds:false, post_on_website:false };

export default function StaffRequestForm({ onSuccess }) {
  const [form, setForm]     = useState(INIT);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [msg, setMsg]           = useState(null);
  const role = useSelector(s => s.user.role);

  useEffect(() => {
    fetchProjectIds(role).then(r => {
      const list = Array.isArray(r.data) ? r.data : [];
      setProjects(list.map(p => ({ value: String(p.pid), label: p.name })));
    }).catch(()=>{});
  }, [role]);

  const set = (k) => (v) => setForm(f=>({...f,[k]:v}));

  const handleSubmit = async () => {
    setLoading(true); setMsg(null);
    try {
      await requestStaff(form);
      setMsg({ type:"success", text:"Staff request submitted." });
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
        <Grid.Col span={6}><TextInput label="Person Name" value={form.person} onChange={e=>set("person")(e.target.value)} /></Grid.Col>
        <Grid.Col span={6}><TextInput label="Biodata Number" value={form.biodata_number} onChange={e=>set("biodata_number")(e.target.value)} /></Grid.Col>
        <Grid.Col span={4}>
          <Select label="Position Type" required data={TYPES} value={form.type} onChange={set("type")} />
        </Grid.Col>
        <Grid.Col span={4}><NumberInput label="Salary (₹/month)" required value={form.salary} onChange={set("salary")} min={0} /></Grid.Col>
        <Grid.Col span={4}><NumberInput label="Duration (months)" value={form.duration} onChange={set("duration")} min={1} /></Grid.Col>
        <Grid.Col span={6}><TextInput label="Start Date" type="date" value={form.start_date} onChange={e=>set("start_date")(e.target.value)} /></Grid.Col>
        <Grid.Col span={12}><Textarea label="Eligibility Criteria" value={form.eligibility} onChange={e=>set("eligibility")(e.target.value)} rows={3} /></Grid.Col>
        <Grid.Col span={6}><Checkbox label="Funds Available" checked={form.has_funds} onChange={e=>set("has_funds")(e.currentTarget.checked)} /></Grid.Col>
        <Grid.Col span={6}><Checkbox label="Post on Website" checked={form.post_on_website} onChange={e=>set("post_on_website")(e.currentTarget.checked)} /></Grid.Col>
      </Grid>
      <Group mt="md">
        <Button onClick={handleSubmit} loading={loading}>Submit Staff Request</Button>
      </Group>
    </div>
  );
}
