import { Container, Paper, Title, Stack, Group, Badge, Button, Alert } from "@mantine/core";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle } from "tabler-icons-react";

function RSPCDashboard() {
  const [role, setRole] = useState(null);
  const [roleLabel, setRoleLabel] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Get role from sessionStorage
    const activeRole = sessionStorage.getItem("rspc_active_role");
    const token = localStorage.getItem("authToken");

    if (!token || !activeRole) {
      navigate("/accounts/login");
      return;
    }

    // Role labels mapping
    const roleLabels = {
      pi: "Faculty/PI",
      hod: "Head of Department",
      dean_rspc: "Dean (RSPC)",
      director: "Director",
      rspc_admin: "RSPC Administrator",
      committee: "Committee Member",
    };

    setRole(activeRole);
    setRoleLabel(roleLabels[activeRole] || activeRole);
    setLoading(false);
  }, [navigate]);

  if (loading) {
    return (
      <Container py="xl">
        <Title>Loading...</Title>
      </Container>
    );
  }

  // Role-specific content
  const getRoleContent = () => {
    switch (role) {
      case "pi":
        return {
          title: "Faculty/PI Dashboard",
          description: "Manage your research projects, budgets, and collaborations",
          color: "blue",
          actions: [
            { label: "My Projects", href: "#" },
            { label: "Budgets", href: "#" },
            { label: "Reports", href: "#" },
            { label: "Collaborators", href: "#" },
          ],
        };
      case "hod":
        return {
          title: "Head of Department Dashboard",
          description: "Oversee departmental research activities and approvals",
          color: "green",
          actions: [
            { label: "Department Projects", href: "#" },
            { label: "Approvals Pending", href: "#" },
            { label: "Budget Summary", href: "#" },
            { label: "Department Reports", href: "#" },
          ],
        };
      case "dean_rspc":
        return {
          title: "Dean (RSPC) Dashboard",
          description: "Manage RSPC operations and institutional policies",
          color: "purple",
          actions: [
            { label: "All Projects", href: "#" },
            { label: "Policy Management", href: "#" },
            { label: "Strategic Planning", href: "#" },
            { label: "Compliance", href: "#" },
          ],
        };
      case "director":
        return {
          title: "Director Dashboard",
          description: "Institutional-level research oversight",
          color: "orange",
          actions: [
            { label: "Institution Overview", href: "#" },
            { label: "Strategic Initiatives", href: "#" },
            { label: "Resource Allocation", href: "#" },
            { label: "Analytics", href: "#" },
          ],
        };
      case "rspc_admin":
        return {
          title: "RSPC Administrator Dashboard",
          description: "System administration and user management",
          color: "red",
          actions: [
            { label: "User Management", href: "#" },
            { label: "System Configuration", href: "#" },
            { label: "Reports & Analytics", href: "#" },
            { label: "Audit Logs", href: "#" },
          ],
        };
      case "committee":
        return {
          title: "Committee Member Dashboard",
          description: "Review and evaluate research proposals",
          color: "cyan",
          actions: [
            { label: "My Reviews", href: "#" },
            { label: "Pending Proposals", href: "#" },
            { label: "Committee Meetings", href: "#" },
            { label: "Guidelines", href: "#" },
          ],
        };
      default:
        return {
          title: "RSPC Dashboard",
          description: "Welcome to the RSPC system",
          color: "gray",
          actions: [],
        };
    }
  };

  const content = getRoleContent();

  return (
    <Container size="lg" py="xl">
      <Paper withBorder shadow="md" p="lg" radius="md" mb="lg">
        <Group position="apart" mb="md">
          <div>
            <Title order={2}>{content.title}</Title>
            <p style={{ marginTop: 8, color: "#666" }}>{content.description}</p>
          </div>
          <Badge size="lg" color={content.color} variant="filled">
            {roleLabel}
          </Badge>
        </Group>

        <Alert icon={<AlertCircle size={16} />} title="Active Role" color="blue">
          You are logged in as <strong>{roleLabel}</strong>. All activities will be tracked under
          this role.
        </Alert>
      </Paper>

      <Stack spacing="lg">
        <div>
          <Title order={3} mb="md">
            Quick Actions
          </Title>
          <Group spacing="sm" grow>
            {content.actions.map((action, idx) => (
              <Button
                key={idx}
                color={content.color}
                variant="default"
                onClick={() => (window.location.href = action.href)}
              >
                {action.label}
              </Button>
            ))}
          </Group>
        </div>

        <Paper withBorder p="md" radius="md">
          <Title order={4} mb="sm">
            Recent Activity
          </Title>
          <p style={{ color: "#999", textAlign: "center" }}>
            No recent activity to display
          </p>
        </Paper>
      </Stack>
    </Container>
  );
}

export default RSPCDashboard;
