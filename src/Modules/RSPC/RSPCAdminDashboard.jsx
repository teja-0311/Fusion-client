import { Container, Stack, Title, Text, Group, Button, Card, SimpleGrid, Badge, Table, Alert } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { IconLogout, IconAlertCircle, IconCheck, IconFileText, IconUsers } from "@tabler/icons-react";

function RSPCAdminDashboard() {
  const navigate = useNavigate();

  const operations = [
    {
      title: "📝 Create Research Projects",
      description: "Create and submit research projects on behalf of faculty",
      icon: IconFileText,
      actions: ["New Project", "Edit Project", "Submit to Dean"],
      link: "/rspc/projects?action=create-admin",
    },
    {
      title: "👥 Staff Management",
      description: "Manage staff positions, advertisements, and committees",
      icon: IconUsers,
      actions: ["Create Staff Position", "Create Advertisement", "Setup Committee", "View Verdicts"],
      link: "/rspc/staff?action=manage",
    },
    {
      title: "💰 Budget Management",
      description: "Manage budget allocations and track utilization",
      icon: IconCheck,
      actions: ["View All Budgets", "Update Utilized Amounts", "Reallocate Budgets"],
      link: "/rspc/budget",
    },
    {
      title: "🔍 Proposal Verification",
      description: "Verify proposal documentation before Dean approval",
      icon: IconCheck,
      actions: ["Verify Completeness", "Check Documentation", "Request Revisions"],
      link: "/rspc/projects?action=verify-admin",
    },
    {
      title: "📊 Full System Access",
      description: "View all projects, budgets, staff, and approvals",
      icon: IconFileText,
      actions: ["View All Data", "Generate Reports", "Access All Workflows"],
      link: "/rspc/reports?filter=all",
    },
  ];

  const dataVisibility = [
    { label: "✓ All Projects", status: "Visible" },
    { label: "✓ All Budgets & Financial Records", status: "Visible" },
    { label: "✓ All Staff Records", status: "Visible" },
    { label: "✓ All Approval Workflows", status: "Visible" },
    { label: "✓ Committee Memberships", status: "Visible" },
    { label: "✓ Utilized Amounts", status: "Visible (Can Update)" },
    { label: "✓ All Expenditures", status: "Visible" },
    { label: "✓ All Proposals", status: "Visible" },
  ];

  return (
    <Container size="lg" py="xl">
      {/* Header */}
      <Group justify="space-between" mb="xl">
        <div>
          <Title order={2}>RSPC Administrator - Full System Access</Title>
          <Text c="dimmed" mt={4}>
            Complete management and oversight of RSPC module
          </Text>
        </div>
        <Button
          variant="subtle"
          leftSection={<IconLogout size={16} />}
          onClick={() => {
            sessionStorage.removeItem("rspc_active_role");
            sessionStorage.removeItem("rspc_active_role_label");
            navigate("/rspc-login");
          }}
        >
          Switch Role
        </Button>
      </Group>

      <Stack gap="lg">
        {/* Operations Section */}
        <Card withBorder padding="lg" radius="md">
          <Card.Section inheritPadding py="md" withBorder>
            <Title order={4}>📌 Available Operations</Title>
            <Text size="sm" c="dimmed" mt={4}>
              As RSPC Admin, you have full system management capabilities:
            </Text>
          </Card.Section>

          <Card.Section inheritPadding py="md">
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              {operations.map((op, idx) => {
                const Icon = op.icon;
                return (
                  <Card key={idx} withBorder p="md" radius="md">
                    <Group gap="md" mb="md">
                      <Icon size={24} color="orange" />
                      <div>
                        <Text fw={600} size="sm">
                          {op.title}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {op.description}
                        </Text>
                      </div>
                    </Group>
                    <Stack gap="xs" mb="md">
                      {op.actions.map((action, aIdx) => (
                        <Text key={aIdx} size="xs">
                          • {action}
                        </Text>
                      ))}
                    </Stack>
                    <Button size="sm" fullWidth component="a" href={op.link} variant="light" color="orange">
                      Access
                    </Button>
                  </Card>
                );
              })}
            </SimpleGrid>
          </Card.Section>
        </Card>

        {/* Data Visibility Section */}
        <Card withBorder padding="lg" radius="md">
          <Card.Section inheritPadding py="md" withBorder>
            <Title order={4}>👁️ Data Visibility</Title>
            <Text size="sm" c="dimmed" mt={4}>
              You have unrestricted access to all RSPC data:
            </Text>
          </Card.Section>

          <Card.Section inheritPadding py="md">
            <Table striped>
              <Table.Tbody>
                {dataVisibility.map((item, idx) => (
                  <Table.Tr key={idx}>
                    <Table.Td>{item.label}</Table.Td>
                    <Table.Td>
                      <Badge color="green">
                        {item.status}
                      </Badge>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Card.Section>
        </Card>

        {/* Important Notes */}
        <Alert icon={<IconAlertCircle size={16} />} color="orange" title="Important Notes - Admin Responsibilities">
          <Stack gap="xs">
            <Text size="sm" fw={600}>
              Key Responsibilities:
            </Text>
            <Text size="sm">
              • Create and manage research projects on behalf of faculty
            </Text>
            <Text size="sm">
              • Setup staff selection committees and advertisements
            </Text>
            <Text size="sm">
              • Update budget utilization amounts across all projects
            </Text>
            <Text size="sm">
              • Verify proposal documentation before Dean RSPC approval
            </Text>
            <Text size="sm">
              • Manage budget reallocations within 20% limit
            </Text>
            <Text size="sm" fw={600} mt="md">
              System Access:
            </Text>
            <Text size="sm">
              • You have UNRESTRICTED access to all RSPC data and workflows
            </Text>
            <Text size="sm">
              • You can view all projects, budgets, staff, and approval chains
            </Text>
          </Stack>
        </Alert>

        {/* Quick Navigation */}
        <Card withBorder padding="lg" radius="md" bg="gray.0">
          <Title order={4} mb="md">
            🚀 Quick Navigation
          </Title>
          <Group justify="center" wrap="wrap" gap="md">
            <Button component="a" href="/rspc/projects?action=create-admin" color="orange">
              Create Project
            </Button>
            <Button component="a" href="/rspc/staff?action=manage" variant="light">
              Staff Management
            </Button>
            <Button component="a" href="/rspc/budget" variant="light">
              Budget Management
            </Button>
            <Button component="a" href="/rspc/projects?action=verify-admin" variant="light">
              Verify Proposals
            </Button>
            <Button component="a" href="/rspc/reports?filter=all" variant="light">
              Full Reports
            </Button>
          </Group>
        </Card>
      </Stack>
    </Container>
  );
}

export default RSPCAdminDashboard;
