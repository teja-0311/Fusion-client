import { useEffect, useState } from "react";
import { Modal, Text, Badge, Button, Group, Stack, Divider, Loader, Alert } from "@mantine/core";
import { fetchProjectDetails, registerProject, commenceProject, closeProject, verifyProposal, deanProjectAction, vetProposal } from "../api";

const STATUS_COLOR = {
  ONGOING: "green", COMPLETED: "blue", PROPOSED: "yellow",
  SANCTIONED: "grape", REJECTED: "red", DEFAULT: "gray",
};

export default function ProjectDetailModal({ projectId, opened, onClose }) {
  const [data, setData]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg]     = useState(null);

  useEffect(() => {
    if (!projectId || !opened) return;
    setLoading(true); setData(null); setMsg(null);
    fetchProjectDetails(projectId)
      .then((r) => {
        const payload = Array.isArray(r.data) ? r.data[0] : (r.data || {});
        const project = payload.project || {};
        // Normalize detail shape: many responses keep project fields inside `project`
        const normalized = { ...project, ...payload };
        setData(normalized);
      })
      .catch(() => setMsg({ type: "error", text: "Failed to load project." }))
      .finally(() => setLoading(false));
  }, [projectId, opened]);

  const act = async (fn, label) => {
    setMsg(null);
    try {
      await fn();
      setMsg({ type: "success", text: `${label} successful.` });
      fetchProjectDetails(projectId).then((r) => {
        const payload = Array.isArray(r.data) ? r.data[0] : (r.data || {});
        const project = payload.project || {};
        setData({ ...project, ...payload });
      });
    } catch (e) {
      const detail = e?.response?.data?.error || e?.response?.data?.details || e?.response?.data?.message;
      setMsg({ type: "error", text: detail ? `${label} failed: ${typeof detail === "string" ? detail : JSON.stringify(detail)}` : `${label} failed.` });
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Project Details" size="lg" centered>
      {msg && (
        <Alert color={msg.type === "success" ? "green" : "red"} mb="sm">
          {msg.text}
        </Alert>
      )}
      {loading && <Group justify="center" p="xl"><Loader /></Group>}
      {data && !loading && (
        <Stack gap="xs">
          <Text fw={700} size="lg">{data.name}</Text>
          <Badge color={STATUS_COLOR[data.status] || STATUS_COLOR.DEFAULT} variant="light" size="lg">
            {data.status}
          </Badge>
          <Divider />
          {[
            ["PI", data.pi_name || data.pi || data.piName || data.principalInvestigatorName || "—"],
            ["Department", data.dept || data.department || data.departmentName || "—"],
            ["Agency", data.sponsored_agency || data.agency || data.sponsoredAgency || data.fundingAgency || "—"],
            ["Scheme", data.scheme || "—"],
            ["Budget", `₹${Number(data.total_budget || 0).toLocaleString()}`],
            ["Duration", data.duration ? `${data.duration} months` : "—"],
            ["Start Date", data.start_date ? new Date(data.start_date).toLocaleDateString() : "—"],
          ].map(([label, value]) => (
            <Group key={label} gap="xs">
              <Text size="sm" fw={600} w={110}>{label}:</Text>
              <Text size="sm">{value}</Text>
            </Group>
          ))}
          {data.description && (
            <>
              <Divider my={4} />
              <Text size="sm" fw={600}>Description:</Text>
              <Text size="sm" c="dimmed">{data.description}</Text>
            </>
          )}
          <Divider my="xs" />
          <Group gap="sm" wrap="wrap">
            {data.available_actions?.can_verify_proposal && (
              <Button size="xs" color="grape" onClick={() => act(() => verifyProposal(projectId, { action: "Verify", remarks: "Verified" }), "Verify")}>
                Verify Proposal
              </Button>
            )}
            {data.available_actions?.can_vet_proposal && (
              <Button
                size="xs"
                color="teal"
                onClick={() =>
                  act(
                    () =>
                      vetProposal(projectId, {
                        technical_feasibility: "PASS",
                        academic_relevance: "PASS",
                        resource_adequacy: "PASS",
                        department_alignment: "PASS",
                        comments: "Vetted by HOD",
                      }),
                    "Vet Proposal"
                  )
                }
              >
                Vet Proposal
              </Button>
            )}
            {data.available_actions?.can_dean_approve_reject && (
              <>
                <Button
                  size="xs"
                  color="green"
                  onClick={() => act(() => deanProjectAction(projectId, { action: "approve", remarks: "Approved by Dean" }), "Dean Approve")}
                >
                  Dean Approve
                </Button>
                <Button
                  size="xs"
                  color="red"
                  onClick={() => act(() => deanProjectAction(projectId, { action: "reject", remarks: "Rejected by Dean" }), "Dean Reject")}
                >
                  Dean Reject
                </Button>
              </>
            )}
            {data.available_actions?.can_register && (
              <Button size="xs" color="green" onClick={() => act(() => registerProject(projectId, {}), "Register")}>
                Register
              </Button>
            )}
            {data.available_actions?.can_commence && (
              <Button size="xs" color="blue" onClick={() => act(() => commenceProject(projectId, {}), "Commence")}>
                Commence
              </Button>
            )}
            {data.available_actions?.can_close && (
              <Button size="xs" color="red" onClick={() => act(() => closeProject(projectId, {}), "Close")}>
                Close Project
              </Button>
            )}
          </Group>
        </Stack>
      )}
    </Modal>
  );
}
