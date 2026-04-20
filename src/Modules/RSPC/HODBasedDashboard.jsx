import { Container, Stack, Title, Text, Group, Button, Card, SimpleGrid, Badge, Table, Alert } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { IconLogout, IconAlertCircle, IconPlus, IconCheck, IconUsers, IconCurrencyRupee } from "@tabler/icons-react";

function HODBasedDashboard() {
  const navigate = useNavigate();

  const operations = [
    {
      title: "📊 Departmental Projects",
      description: "Review all projects submitted from your department",
      icon: IconCheck,
      actions: ["View Department Projects", "Track Proposal Status", "Send Feedback to Faculty"],
      link: "/rspc/projects?dept=mine",
    },
    {
      title: "👥 Staff Approvals",
      description: "Approve or reject staff appointment recommendations",
      icon: IconUsers,
      actions: ["View Staff Requests", "Approve/Reject Recommendations", "Track Committee Verdicts"],
      link: "/rspc/staff?action=approve",
    },
    {
      title: "💰 Expenditure Approvals (₹50K-200K)",
      description: "Approve expenditure requests in the ₹50K-200K range",
      icon: IconCurrencyRupee,
      actions: ["View Pending Expenditures", "Approve/Reject Requests", "Provide Remarks"],
      link: "/rspc/expenditures?level=hod",
    },
    {
      title: "📈 Department Analytics",
      description: "View department research statistics and fund allocation",
      icon: IconPlus,
      actions: ["View Department Statistics", "Budget Summary", "Project Timeline"],
      link: "/rspc/reports?filter=department",
    },
  ];

  const dataVisibility = [
    { label: "✓ Department Projects", status: "Visible" },
    { label: "✓ Staff Requests (Department)", status: "Visible" },
    { label: "✓ Expenditure Requests (Level 2)", status: "Visible" },
    { label: "✓ Committee Verdicts", status: "Visible" },
    { label: "✓ Department Statistics", status: "Visible" },
    { label: "✗ Other Departments", status: "Hidden" },
    { label: "✗ Expenditures &gt; ₹200K", status: "Hidden" },
  ];

  const approvalLimits = [
    { range: "≤ ₹50,000", approval: "Not HOD's responsibility (PI approves)", level: "—" },
    { range: "₹50,001 - ₹200,000", approval: "You (HOD) review & approve/reject", level: "Level 2 (Your Level)" },
    { range: "&gt; ₹200,000", approval: "Goes to RSPC Admin (Not your approval)", level: "—" },
  ];

  return (
    <Container size="lg" py="xl">
      {/* Header */}
      <Group justify="space-between" mb="xl">
        <div>
          <Title order={2}>Head of Department (HOD) - RSPC Dashboard</Title>
          <Text c="dimmed" mt={4}>
            Department research oversight and approvals
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
              As HOD, you can perform these operations:
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
              Your approval authority in the expenditure chain:
            </Text>
          </Card.Section>

          <Card.Section inheritPadding py="md">
            <Table striped>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Amount Range</Table.Th>
                  <Table.Th>Your Role</Table.Th>
                  <Table.Th>Level</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {approvalLimits.map((item, idx) => (
                  <Table.Tr key={idx}>
                    <Table.Td fw={600}>{item.range}</Table.Td>
                    <Table.Td>{item.approval}</Table.Td>
                    <Table.Td>
                      <Badge color={item.range === "₹50,001 - ₹200,000" ? "blue" : "gray"}>
                        {item.level}
                      </Badge>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Card.Section>
        </Card>

        {/* Important Notes */}
        <Alert icon={<IconAlertCircle size={16} />} color="blue" title="Important Notes - HOD Responsibilities">
          <Stack gap="xs">
            <Text size="sm">
              • You approve expenditures ONLY in the ₹50,001-₹200,000 range (Level 2)
            </Text>
            <Text size="sm">
              • You review and approve/reject staff appointment recommendations from committees
            </Text>
            <Text size="sm">
              • You can see all projects submitted by faculty in your department
            </Text>
            <Text size="sm">
              • You CANNOT create, submit, or approve proposals (Faculty/PI responsibility)
            </Text>
            <Text size="sm">
              • Expenditures &gt; ₹200,000 go directly to RSPC Admin (not your level)
            </Text>
          </Stack>
        </Alert>

        {/* Quick Navigation */}
        <Card withBorder padding="lg" radius="md" bg="gray.0">
          <Title order={4} mb="md">
            🚀 Quick Navigation
          </Title>
          <Group justify="center" wrap="wrap" gap="md">
            <Button component="a" href="/rspc/projects?dept=mine">
              Department Projects
            </Button>
            <Button component="a" href="/rspc/staff?action=approve" variant="light">
              Staff Approvals
            </Button>
            <Button component="a" href="/rspc/expenditures?level=hod" variant="light">
              Expenditure Approvals
            </Button>
            <Button component="a" href="/rspc/reports?filter=department" variant="light">
              Analytics
            </Button>
          </Group>
        </Card>
      </Stack>
    </Container>
  );
}

export default HODBasedDashboard;
