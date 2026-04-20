/**
 * Reports.jsx — Thin View
 * Write → services.submit_progress_report  POST /research_procedures/api/reports/submit/
 * Write → services.generate_report         POST /research_procedures/api/reports/generate/
 * Write → services.schedule_report         POST /research_procedures/api/reports/schedule/
 * Read  → selectors.get_scheduled_reports  GET  /research_procedures/api/reports/scheduled/
 */
import { useEffect, useState } from "react";
import { Tabs, Select, FileInput, Textarea, Button, Group, Title, Alert,
         Table, ScrollArea, Text, Loader, Grid, NumberInput, Code } from "@mantine/core";
import { useSelector } from "react-redux";
import {
  submitProgressReport, generateReport, scheduleReport,
  fetchScheduledReports, fetchProjectIds,
} from "./api";
import RSPCBreadcrumbs from "./components/RSPCBreadcrumbs";

const REPORT_TYPES = ["QUARTERLY","HALF_YEARLY","ANNUAL","FINAL","UTILIZATION"].map(v=>({value:v,label:v}));
const FREQUENCIES   = ["Daily","Weekly","Monthly","Quarterly"].map(v=>({value:v,label:v}));

export default function Reports() {
  const [activeTab, setActiveTab]   = useState("0");
  const [projects, setProjects]     = useState([]);
  const [scheduled, setScheduled]   = useState([]);
  const [schedLoading, setSchedLoad]= useState(false);
  const [msg, setMsg]               = useState(null);
  const role = useSelector(s => s.user.role);

  // Progress report form state
  const [pr, setPr] = useState({ project_id:"", report_type:"QUARTERLY", period_from:"", period_to:"", summary:"", report_file:null });
  // Generate report state
  const [gen, setGen] = useState({ report_type:"project_summary", project_id:"", format:"PDF" });
  const [genResult, setGenResult]   = useState(null);
  // Schedule report state
  const [sched, setSched] = useState({ report_type:"project_summary", frequency:"Monthly", next_run:"", recipients:"" });

  const setP = k => v => setPr(f=>({...f,[k]:v}));
  const setG = k => v => setGen(f=>({...f,[k]:v}));
  const setS = k => v => setSched(f=>({...f,[k]:v}));

  useEffect(() => {
    fetchProjectIds(role)
      .then(r => setProjects((Array.isArray(r.data)?r.data:[]).map(p=>({ value:String(p.pid), label:p.name }))))
      .catch(()=>{});
    loadScheduled();
  }, [role]);

  const loadScheduled = () => {
    setSchedLoad(true);
    fetchScheduledReports()
      .then(r => setScheduled(Array.isArray(r.data)?r.data:r.data?.results||[]))
      .catch(()=>{})
      .finally(()=>setSchedLoad(false));
  };

  const handleProgressSubmit = async () => {
    setMsg(null);
    const fd = new FormData();
    Object.entries(pr).forEach(([k,v])=>{ if(v) fd.append(k,v); });
    try {
      await submitProgressReport(fd);
      setMsg({ type:"success", text:"Progress report submitted." });
      setPr({ project_id:"", report_type:"QUARTERLY", period_from:"", period_to:"", summary:"", report_file:null });
    } catch(e) { setMsg({ type:"error", text: e.response?.data?.error||"Submission failed." }); }
  };

  const handleGenerate = async () => {
    setMsg(null); setGenResult(null);
    try {
      const r = await generateReport(gen);
      setGenResult(r.data);
      setMsg({ type:"success", text:"Report generated." });
    } catch { setMsg({ type:"error", text:"Report generation failed." }); }
  };

  const handleSchedule = async () => {
    setMsg(null);
    const payload = { ...sched, recipients: sched.recipients.split(",").map(s=>s.trim()).filter(Boolean) };
    try {
      await scheduleReport(payload);
      setMsg({ type:"success", text:"Report scheduled." });
      loadScheduled();
    } catch { setMsg({ type:"error", text:"Scheduling failed." }); }
  };

  const tabItems = [
    {
      title: "Progress Report",
      component: (
        <Grid gutter="sm" maw={600}>
          <Grid.Col span={12}>
            <Select label="Project" required searchable data={projects} value={pr.project_id} onChange={setP("project_id")} placeholder="Select project" />
          </Grid.Col>
          <Grid.Col span={6}>
            <Select label="Report Type" data={REPORT_TYPES} value={pr.report_type} onChange={setP("report_type")} />
          </Grid.Col>
          <Grid.Col span={3}>
            <Text size="sm" fw={500} mb={4}>Period From</Text>
            <input type="date" value={pr.period_from} onChange={e=>setP("period_from")(e.target.value)}
              style={{ width:"100%", padding:"8px 10px", border:"1px solid #ced4da", borderRadius:4, fontSize:14 }} />
          </Grid.Col>
          <Grid.Col span={3}>
            <Text size="sm" fw={500} mb={4}>Period To</Text>
            <input type="date" value={pr.period_to} onChange={e=>setP("period_to")(e.target.value)}
              style={{ width:"100%", padding:"8px 10px", border:"1px solid #ced4da", borderRadius:4, fontSize:14 }} />
          </Grid.Col>
          <Grid.Col span={12}>
            <Textarea label="Summary" required value={pr.summary} onChange={e=>setP("summary")(e.target.value)} rows={4} />
          </Grid.Col>
          <Grid.Col span={12}>
            <FileInput label="Report File (PDF)" accept=".pdf" value={pr.report_file} onChange={setP("report_file")} clearable />
          </Grid.Col>
          <Grid.Col span={12}>
            <Button onClick={handleProgressSubmit}>Submit Progress Report</Button>
          </Grid.Col>
        </Grid>
      ),
    },
    {
      title: "Generate Report",
      component: (
        <div>
          <Grid gutter="sm" maw={500}>
            <Grid.Col span={6}>
              <Select label="Report Type" data={[{value:"project_summary",label:"Project Summary"},{value:"department_stats",label:"Department Stats"}]}
                value={gen.report_type} onChange={setG("report_type")} />
            </Grid.Col>
            <Grid.Col span={6}>
              <Select label="Project" searchable data={projects} value={gen.project_id} onChange={setG("project_id")} placeholder="Select project" clearable />
            </Grid.Col>
            <Grid.Col span={4}>
              <Select label="Format" data={["PDF","EXCEL","JSON"].map(v=>({value:v,label:v}))} value={gen.format} onChange={setG("format")} />
            </Grid.Col>
            <Grid.Col span={12}><Button onClick={handleGenerate}>Generate</Button></Grid.Col>
          </Grid>
          {genResult && (
            <Code block mt="md">{JSON.stringify(genResult, null, 2)}</Code>
          )}

          <Title order={5} mt="xl" mb="sm">Schedule Automated Report</Title>
          <Grid gutter="sm" maw={500}>
            <Grid.Col span={6}>
              <Select label="Type" data={[{value:"project_summary",label:"Project Summary"},{value:"department_stats",label:"Dept Stats"}]}
                value={sched.report_type} onChange={setS("report_type")} />
            </Grid.Col>
            <Grid.Col span={6}>
              <Select label="Frequency" data={FREQUENCIES} value={sched.frequency} onChange={setS("frequency")} />
            </Grid.Col>
            <Grid.Col span={6}>
              <Text size="sm" fw={500} mb={4}>Next Run</Text>
              <input type="datetime-local" value={sched.next_run} onChange={e=>setS("next_run")(e.target.value)}
                style={{ width:"100%", padding:"8px 10px", border:"1px solid #ced4da", borderRadius:4, fontSize:14 }} />
            </Grid.Col>
            <Grid.Col span={12}>
              <Textarea label="Recipients (comma-separated usernames)" value={sched.recipients}
                onChange={e=>setS("recipients")(e.target.value)} rows={2} />
            </Grid.Col>
            <Grid.Col span={12}><Button color="grape" onClick={handleSchedule}>Schedule Report</Button></Grid.Col>
          </Grid>
        </div>
      ),
    },
    {
      title: "Scheduled Reports",
      component: (
        <>
          <Group justify="flex-end" mb="sm">
            <Button variant="light" size="xs" onClick={loadScheduled}>Refresh</Button>
          </Group>
          {schedLoading ? <Group justify="center" p="xl"><Loader /></Group>
            : scheduled.length === 0
              ? <Text c="dimmed" size="sm">No scheduled reports.</Text>
              : (
                <ScrollArea>
                  <Table withTableBorder withColumnBorders>
                    <Table.Thead>
                      <Table.Tr>
                        {["ID","Type","Frequency","Next Run","Created By"].map(h=>(
                          <Table.Th key={h}>{h}</Table.Th>
                        ))}
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {scheduled.map(r => (
                        <Table.Tr key={r.sid}>
                          <Table.Td>{r.sid}</Table.Td>
                          <Table.Td>{r.report_type}</Table.Td>
                          <Table.Td>{r.frequency}</Table.Td>
                          <Table.Td>{new Date(r.next_run).toLocaleString()}</Table.Td>
                          <Table.Td>{r.created_by}</Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </ScrollArea>
              )}
        </>
      ),
    },
  ];

  return (
    <>
      <RSPCBreadcrumbs />
      <Title order={3} mt="md" mb="xs">Reports</Title>
      {msg && (
        <Alert color={msg.type==="success"?"green":"red"} mb="sm"
          withCloseButton onClose={()=>setMsg(null)}>
          {msg.text}
        </Alert>
      )}
      <Tabs value={activeTab} onChange={v=>{ setActiveTab(v); setMsg(null); setGenResult(null); }}>
        <Tabs.List mb="md">
          {tabItems.map((t,i) => <Tabs.Tab key={i} value={String(i)}>{t.title}</Tabs.Tab>)}
        </Tabs.List>
        {tabItems.map((t,i) => <Tabs.Panel key={i} value={String(i)}>{t.component}</Tabs.Panel>)}
      </Tabs>
    </>
  );
}
