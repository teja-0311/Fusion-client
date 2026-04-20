import { Container, Stack, Title, Text, Group, Button, Card, SimpleGrid, Badge, Table, Alert } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { IconLogout, IconAlertCircle, IconPlus, IconFileText, IconUsers, IconCurrencyRupee, IconClipboardList } from "@tabler/icons-react";

function PIBasedDashboard({ role }) {
  const navigate = useNavigate();

  const operations = [
    {
      title: "📝 Submit Proposal",
      description: "Create and submit research or consultancy proposals",
      icon: IconFileText,
      actions: ["New Research Proposal", "New Consultancy Proposal", "Save as Draft"],
      link: "/rspc/projects?action=submit",
    },
    {
      title: "💼 Manage Projects",
      description: "View and manage your research projects",
      icon: IconClipboardList,
      actions: ["View My Projects", "Edit Project Details", "Resubmit Returned Proposal"],
      link: "/rspc/projects?filter=my",
    },
    {
      title: "👥 Request Staff",
      description: "Request research staff for your projects",
      icon: IconUsers,
      actions: ["Request Staff Appointment", "View Staff Requests", "Track Committee Status"],
      link: "/rspc/staff?action=request",
    },
    {
      title: "💰 Budget & Expenditure",
      description: "Manage project budget and track expenditures",
      icon: IconCurrencyRupee,
      actions: ["View Budget", "Create Expenditure Request", "Track Approval Status"],
      link: "/rspc/expenditures",
    },
  ];

  const dataVisibility = [
    { label: "✓ Own Projects", status: "Visible" },
    { label: "✓ Project Budget & Expenditures", status: "Visible" },
    { label: "✓ Co-PI Access Levels", status: "Visible" },
    { label: "✓ Staff Assignments", status: "Visible" },
    { label: "✓ Progress Reports", status: "Visible" },
    { label: "✗ Other Faculty Projects", status: "Hidden" },
    { label: "✗ Institute-wide Data", status: "Hidden" },
  ];

  const approvalLimits = [
    { range: "≤ ₹50,000", approval: "You (PI) approve", level: "Level 1" },
    { range: "₹50,001 - ₹200,000", approval: "You → HOD → Approve", level: "Level 2" },
    { range: "&gt; ₹200,000", approval: "You → HOD → RSPC Admin → Approve", level: "Level 3" },
  ];

  return (
    <Container size="lg" py="xl">
      {/* Header */}
      <Group justify="space-between" mb="xl">
        <div>
          <Title order={2}>Faculty (PI) - RSPC Dashboard</Title>
          <Text c="dimmed" mt={4}>
            {role === "faculty" ? "Faculty Member (Read-only access)" : "Principal Investigator - Full project management"}
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
              As a PI, you can perform these operations:
            </Text>
          </Card.Section>

          <Card.Section inheritPadding py="md">
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              {operations.map((op, idx) => {
                const Icon = op.icon;
                return (
                  <Card key={idx} withBorder p="md" radius="md">
                    <Group gap="md" mb="md">
                      <Icon size={24} color="blue" />
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
                    <Button size="sm" fullWidth component="a" href={op.link} variant="light">
                      {op.title.split(" ")[1]}
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
              Here's what you can and cannot see:
            </Text>
          </Card.Section>

          <Card.Section inheritPadding py="md">
            <Table striped>
              <Table.Tbody>
                {dataVisibility.map((item, idx) => (
                  <Table.Tr key={idx}>
                    <Table.Td>{item.label}</Table.Td>
                    <Table.Td>
                      <Badge color={item.status === "Visible" ? "green" : "gray"}>
                        {item.status}
                      </Badge>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Card.Section>
        </Card>

        {/* Expenditure Approval Limits */}
        <Card withBorder padding="lg" radius="md">
          <Card.Section inheritPadding py="md" withBorder>
            <Title order={4}>💵 Expenditure Approval Thresholds</Title>
            <Text size="sm" c="dimmed" mt={4}>
              Amount limits and approval chain based on expenditure size:
            </Text>
          </Card.Section>

          <Card.Section inheritPadding py="md">
            <Table striped>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Amount Range</Table.Th>
                  <Table.Th>Approval Chain</Table.Th>
                  <Table.Th>Level</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {approvalLimits.map((item, idx) => (
                  <Table.Tr key={idx}>
                    <Table.Td fw={600}>{item.range}</Table.Td>
                    <Table.Td>{item.approval}</Table.Td>
                    <Table.Td>
                      <Badge>{item.level}</Badge>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Card.Section>
        </Card>

        {/* Important Notes */}
        <Alert icon={<IconAlertCircle size={16} />} color="blue" title="Important Notes">
          <Stack gap="xs">
            <Text size="sm">
              • You cannot approve your own expenditures - they must go through the approval chain
            </Text>
            <Text size="sm">
              • Only you (as PI) can submit proposals and create projects
            </Text>
            <Text size="sm">
              • Co-PIs can be added with either 'Co' (modify rights) or 'noCo' (view-only) access levels
            </Text>
            <Text size="sm">
              • Progress reports must be submitted regularly (Quarterly, Half-yearly, Annual)
            </Text>
          </Stack>
        </Alert>

        {/* Quick Navigation */}
        <Card withBorder padding="lg" radius="md" bg="gray.0">
          <Title order={4} mb="md">
            🚀 Quick Navigation
          </Title>
          <Group justify="center" wrap="wrap" gap="md">
            <Button component="a" href="/rspc/projects?action=submit" leftSection={<IconPlus size={16} />}>
              Submit Proposal
            </Button>
            <Button component="a" href="/rspc/projects?filter=my" variant="light">
              My Projects
            </Button>
            <Button component="a" href="/rspc/staff?action=request" variant="light">
              Request Staff
            </Button>
            <Button component="a" href="/rspc/expenditures" variant="light">
              Expenditures
            </Button>
          </Group>
        </Card>
      </Stack>
    </Container>
  );
}

export default PIBasedDashboard;
