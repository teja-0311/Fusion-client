import { useState, useEffect } from "react";
import { TextInput, Textarea, Select, NumberInput, Button, Group, Alert, FileInput, Grid } from "@mantine/core";
import { submitProposal, submitConsultancy, saveDraft, fetchFacultyIds, resubmitProposal } from "../api";

const INITIAL = {
  name: "",
  pi_id: "",
  type: "Research",
  dept: "",
  category: "",
  sponsored_agency: "",
  scheme: "",
  description: "",
  duration: 12,
  total_budget: "",
  co_pis: "",
  client_name: "",
  contract_amount: "",
  file: null,
};

export default function ProposalForm({ onSuccess, initialData = null, editProjectId = null, onCancelEdit }) {
  const [form, setForm]       = useState(INITIAL);
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg]         = useState(null);
  const isEditMode = Boolean(editProjectId);

  useEffect(() => {
    fetchFacultyIds()
      .then(r => {
        // FIX: backend returns { success, count, faculty: [...] }
        // previously read r.data (the whole object) instead of r.data.faculty
        const list = Array.isArray(r.data?.faculty) ? r.data.faculty : [];
        setFaculty(
          list.map(f => ({
            value: f.username,
            label: `${f.name}${f.department ? ` (${f.department})` : ""}`,
          }))
        );
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!initialData) {
      setForm(INITIAL);
      return;
    }
    setForm(prev => ({
      ...prev,
      name: initialData.name || "",
      pi_id: initialData.pi_id || prev.pi_id,
      type: initialData.type || "Research",
      dept: initialData.dept || "",
      category: initialData.category || "",
      sponsored_agency: initialData.sponsored_agency || "",
      scheme: initialData.scheme || "",
      description: initialData.description || "",
      duration: initialData.duration || 12,
      total_budget: initialData.total_budget || "",
      co_pis: Array.isArray(initialData.co_pis) ? initialData.co_pis.join(", ") : "",
      client_name: initialData.client_name || "",
      contract_amount: initialData.contract_amount || "",
      file: null,
    }));
  }, [initialData]);

  const set = (k) => (v) => setForm(f => ({ ...f, [k]: v }));

  const buildFD = (isDraft = false) => {
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (v !== null && v !== "") fd.append(k, v);
    });
    // co_pis: send each username as a separate field entry
    form.co_pis
      .split(",")
      .map(s => s.trim())
      .filter(Boolean)
      .forEach(c => fd.append("co_pis", c));
    if (isDraft) fd.set("status", "DRAFT");
    return fd;
  };

  const handleSubmit = async () => {
    setLoading(true); setMsg(null);
    try {
      if (isEditMode) {
        const payload = {
          name: form.name,
          description: form.description,
          duration: form.duration,
          total_budget: form.total_budget,
          co_pis: form.co_pis
            .split(",")
            .map(s => s.trim())
            .filter(Boolean),
        };
        const res = await resubmitProposal(editProjectId, payload);
        setMsg({ type: "success", text: res.data.message || "Proposal updated and resubmitted." });
        onSuccess?.(editProjectId);
        return;
      }
      // FIX: submitProposal → POST /proposals/submit/
      //      submitConsultancy → POST /consultancy/submit/
      const isConsultancy = (form.type || "Research") === "Consultancy";
      const fn = isConsultancy ? submitConsultancy : submitProposal;
      const res = await fn(buildFD());
      setMsg({ type: "success", text: res.data.message || "Submitted!" });
      setForm(INITIAL);
      onSuccess?.(res.data.project_id);
    } catch (e) {
      // Show validation detail if available
      const detail = e.response?.data?.details;
      const errText = detail
        ? Object.entries(detail).map(([k, v]) => `${k}: ${v}`).join(" | ")
        : e.response?.data?.error || "Submission failed.";
      setMsg({ type: "error", text: errText });
    } finally {
      setLoading(false);
    }
  };

  const handleDraft = async () => {
    setLoading(true); setMsg(null);
    try {
      // FIX: saveDraft → POST /proposals/draft/
      const res = await saveDraft(buildFD(true));
      setMsg({ type: "success", text: res.data.message || "Draft saved." });
    } catch (e) {
      const detail = e.response?.data?.details;
      const errText = detail
        ? Object.entries(detail).map(([k, v]) => `${k}: ${v}`).join(" | ")
        : "Draft save failed.";
      setMsg({ type: "error", text: errText });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {msg && (
        <Alert
          color={msg.type === "success" ? "green" : "red"}
          mb="sm"
          withCloseButton
          onClose={() => setMsg(null)}
        >
          {msg.text}
        </Alert>
      )}
      <Grid gutter="sm">
        <Grid.Col span={8}>
          <TextInput label="Project Title" required value={form.name} onChange={e => set("name")(e.target.value)} />
        </Grid.Col>
        <Grid.Col span={4}>
          <Select label="Type" data={["Research", "Consultancy"]} value={form.type} onChange={set("type")} />
        </Grid.Col>
        <Grid.Col span={6}>
          {/* FIX: PI dropdown now populated from utils/faculty-ids/ */}
          <Select
            label="Principal Investigator"
            required
            searchable
            data={faculty}
            value={form.pi_id}
            onChange={set("pi_id")}
            placeholder={faculty.length === 0 ? "Loading faculty…" : "Search & select PI"}
            nothingFoundMessage="No faculty found"
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput label="Department" value={form.dept} onChange={e => set("dept")(e.target.value)} />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput label="Sponsoring Agency" value={form.sponsored_agency} onChange={e => set("sponsored_agency")(e.target.value)} />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput label="Scheme" value={form.scheme} onChange={e => set("scheme")(e.target.value)} />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput label="Category" value={form.category} onChange={e => set("category")(e.target.value)} />
        </Grid.Col>
        {form.type === "Consultancy" && (
          <>
            <Grid.Col span={6}>
              <TextInput label="Client Name" required value={form.client_name} onChange={e => set("client_name")(e.target.value)} />
            </Grid.Col>
            <Grid.Col span={6}>
              <NumberInput label="Contract Amount (₹)" required value={form.contract_amount} onChange={set("contract_amount")} min={1} />
            </Grid.Col>
          </>
        )}
        <Grid.Col span={3}>
          <NumberInput label="Duration (months)" value={form.duration} onChange={set("duration")} min={6} max={60} />
        </Grid.Col>
        <Grid.Col span={3}>
          <NumberInput label="Total Budget (₹)" required value={form.total_budget} onChange={set("total_budget")} min={0} />
        </Grid.Col>
        <Grid.Col span={12}>
          <TextInput
            label="Co-PIs (comma-separated usernames)"
            value={form.co_pis}
            onChange={e => set("co_pis")(e.target.value)}
            placeholder="user1, user2"
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <Textarea label="Description" required value={form.description} onChange={e => set("description")(e.target.value)} rows={4} />
        </Grid.Col>
        <Grid.Col span={12}>
          <FileInput label="Proposal Document (PDF)" accept=".pdf" value={form.file} onChange={set("file")} clearable />
        </Grid.Col>
      </Grid>
      <Group mt="md" gap="sm">
        <Button onClick={handleSubmit} loading={loading}>{isEditMode ? "Update Proposal" : "Submit Proposal"}</Button>
        {!isEditMode && (
          <Button variant="outline" onClick={handleDraft} loading={loading}>Save as Draft</Button>
        )}
        {isEditMode && (
          <Button variant="outline" color="gray" onClick={() => onCancelEdit?.()} disabled={loading}>Cancel Edit</Button>
        )}
      </Group>
    </div>
  );
}
