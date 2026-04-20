/**
 * Projects.jsx — Thin View
 * Read  → selectors.get_projects_for_user   GET /research_procedures/api/get-projects/
 * Write → services.submit_research_proposal via ProposalForm
 * Write → services.register/commence/close  via ProjectDetailModal
 */
import { useEffect, useState } from "react";
import { Tabs, Select, Group, Button, Title, Loader } from "@mantine/core";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { fetchProjects } from "./api";
import RSPCBreadcrumbs from "./components/RSPCBreadcrumbs";
import ProjectsTable from "./components/ProjectsTable";
import ProposalForm from "./components/ProposalForm";
import ProjectDetailModal from "./components/ProjectDetailModal";

const STATUS_OPTS = [
  { value: "", label: "All" },
  ...["PROPOSED","UNDER_REVIEW","SANCTIONED","ONGOING","COMPLETED","REJECTED","TERMINATED"]
    .map(s => ({ value: s, label: s })),
];

export default function Projects() {
  const [activeTab, setActiveTab]   = useState("0");
  const [projects, setProjects]     = useState([]);
  const [loading, setLoading]       = useState(false);
  const [statusFilter, setFilter]   = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [modalOpen, setModalOpen]   = useState(false);
  const [apiRole, setApiRole]       = useState(null);
  const [editProject, setEditProject] = useState(null);
  const role = useSelector(s => s.user.role);
  const [searchParams] = useSearchParams();

  const load = () => {
    setLoading(true);
    const params = {};
    if (statusFilter) params.status = statusFilter;
    const deptFilter = searchParams.get("dept");
    if (deptFilter) params.dept = deptFilter;
    fetchProjects(params)
      .then((r) => {
        const payload = r.data || {};
        setApiRole(payload.role || null);
        setProjects(Array.isArray(payload) ? payload : payload?.results || payload?.projects || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [statusFilter, searchParams]);

  const handleView = (pid) => { setSelectedId(pid); setModalOpen(true); };
  const handleEdit = (project) => { setEditProject(project); setActiveTab(canCreateProposal ? "1" : "0"); };

  const canCreateProposal = ['pi', 'rspc_admin'].includes((apiRole || role || '').toLowerCase());

  const tabItems = [
    {
      title: "All Projects",
      component: (
        <>
          <Group mb="md" gap="sm">
            <Select
              placeholder="Filter by Status"
              data={STATUS_OPTS}
              value={statusFilter}
              onChange={v => setFilter(v || "")}
              clearable
              style={{ width: 200 }}
            />
            <Button variant="light" onClick={load}>Refresh</Button>
          </Group>
          {loading ? <Group justify="center" p="xl"><Loader /></Group>
            : <ProjectsTable projects={projects} onView={handleView} onEdit={handleEdit} />}
        </>
      ),
    },
    canCreateProposal ? {
      title: editProject ? "Edit Proposal" : "New Proposal",
      component: (
        <ProposalForm
          initialData={editProject}
          editProjectId={editProject?.pid}
          onCancelEdit={() => { setEditProject(null); setActiveTab("0"); }}
          onSuccess={() => { setEditProject(null); setActiveTab("0"); load(); }}
        />
      ),
    } : null,
  ].filter(Boolean);

  return (
    <>
      <RSPCBreadcrumbs />
      <Title order={3} mt="md" mb="xs">Projects</Title>

      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List mb="md">
          {tabItems.map((t, i) => (
            <Tabs.Tab key={i} value={String(i)}>{t.title}</Tabs.Tab>
          ))}
        </Tabs.List>
        {tabItems.map((t, i) => (
          <Tabs.Panel key={i} value={String(i)}>{t.component}</Tabs.Panel>
        ))}
      </Tabs>

      <ProjectDetailModal
        projectId={selectedId}
        opened={modalOpen}
        onClose={() => { setModalOpen(false); load(); }}
      />
    </>
  );
}
