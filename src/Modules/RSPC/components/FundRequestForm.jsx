import { useState, useEffect } from "react";
import { Select, NumberInput, Textarea, Button, Alert, Stack } from "@mantine/core";
import { requestFund, fetchProjectIds } from "../api";
import { useSelector } from "react-redux";

const INIT = { project_id:"", amount:"", description:"" };

export default function FundRequestForm({ onSuccess }) {
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
      await requestFund(form);
      setMsg({ type:"success", text:"Fund request submitted." });
      setForm(INIT); onSuccess?.();
    } catch(e) { setMsg({ type:"error", text: e.response?.data?.error || "Request failed." }); }
    finally { setLoading(false); }
  };

  return (
    <Stack gap="sm">
      {msg && <Alert color={msg.type==="success"?"green":"red"} withCloseButton onClose={()=>setMsg(null)}>{msg.text}</Alert>}
      <Select label="Project" required searchable data={projects} value={form.project_id} onChange={set("project_id")} placeholder="Select project" />
      <NumberInput label="Amount (₹)" required value={form.amount} onChange={set("amount")} min={0} />
      <Textarea label="Description / Justification" required value={form.description} onChange={e=>set("description")(e.target.value)} rows={4} />
      <Button onClick={handleSubmit} loading={loading} color="green">Submit Fund Request</Button>
    </Stack>
  );
}
