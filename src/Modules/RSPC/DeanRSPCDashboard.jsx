import { Container, Stack, Title, Text, Group, Button, Card, SimpleGrid, Badge, Table, Alert } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { IconLogout, IconAlertCircle, IconCheck, IconFileText, IconCurrencyRupee, IconTrendingUp } from "@tabler/icons-react";

function DeanRSPCDashboard() {
  const navigate = useNavigate();

  const operations = [
    {
      title: "✅ Approve Research Proposals",
      description: "Review and approve/reject research proposals institute-wide",
      icon: IconCheck,
      actions: ["View Pending Proposals", "Approve/Reject", "Send Remarks", "Update Status"],
      link: "/rspc/projects?action=approve",
    },
    {
      title: "💰 Approve Fund Requests",
      description: "Final decision on all fund allocation requests",
      icon: IconCurrencyRupee,
      actions: ["View Fund Requests", "Approve/Reject", "Set Budget Limits"],
      link: "/rspc/funds?action=approve",
    },
    {
      title: "💵 Approve Large Expenditures (&gt; ₹200K)",
      description: "Final approval for expenditures exceeding ₹200,000",
      icon: IconCurrencyRupee,
      actions: ["View Pending Expenditures", "Approve/Reject", "Provide Remarks"],
      link: "/rspc/expenditures?level=dean",
    },
    {
      title: "🏆 Patent & IP Management",
      description: "Update patent status and notify faculty of IP updates",
      icon: IconFileText,
      actions: ["View Patents", "Update Status", "Notify Faculty", "Track Patents"],
      link: "/rspc/patents",
    },
    {
      title: "📊 Institute Analytics",
      description: "View institute-wide research statistics and summaries",
      icon: IconTrendingUp,
      actions: ["View Institute Stats", "Budget Summary", "Project Timeline", "Research Metrics"],
      link: "/rspc/reports?filter=institute",
    },
    {
      title: "🔍 Verify Proposals",
      description: "Pre-approval verification of proposal documentation",
      icon: IconCheck,
      actions: ["Verify Completeness", "Check Documents", "Return for Revision"],
      link: "/rspc/projects?action=verify",
    },
  ];

  const dataVisibility = [
    { label: "✓ All Proposals (Any Status)", status: "Visible" },
    { label: "✓ All Fund Requests", status: "Visible" },
    { label: "✓ Expenditures &gt; ₹200K", status: "Visible" },
    { label: "✓ Patent Records", status: "Visible" },
    { label: "✓ Committee Verdicts", status: "Visible" },
    { label: "✓ Institute-wide Statistics", status: "Visible" },
    { label: "✓ Budget Summaries (by Department)", status: "Visible" },
    { label: "✗ Faculty Personal Records", status: "Hidden" },
  ];

  const approvalLimits = [
    { range: "≤ ₹50,000", approval: "Not Dean's responsibility (PI approves)", level: "—" },
    { range: "₹50,001 - ₹200,000", approval: "Not Dean's responsibility (HOD approves)", level: "—" },
    { range: "&gt; ₹200,000", approval: "You (Dean RSPC) review & approve/reject", level: "Level 3 (Your Level)" },
  ];

  return (
    <Container size="lg" py="xl">
      {/* Header */}
      <Group justify="space-between" mb="xl">
        <div>
          <Title order={2}>Dean (RSPC) - RSPC Dashboard</Title>
          <Text c="dimmed" mt={4}>
            Final authority on proposals, funds, patents, and large expenditures
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
              As Dean RSPC, you have final decision authority on:
            </Text>
          </Card.Section>

          <Card.Section inheritPadding py="md">
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              {operations.map((op, idx) => {
                const Icon = op.icon;
                return (
                  <Card key={idx} withBorder p="md" radius="md">
                    <Group gap="md" mb="md">
                      <Icon size={24} color="red" />
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
                    <Button size="sm" fullWidth component="a" href={op.link} variant="light" color="red">
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
              Your final approval authority in the expenditure chain:
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
                      <Badge color={item.range === "&gt; ₹200,000" ? "red" : "gray"}>
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
        <Alert icon={<IconAlertCircle size={16} />} color="red" title="Important Notes - Dean RSPC Responsibilities">
          <Stack gap="xs">
            <Text size="sm" fw={600}>
              Decision Authority:
            </Text>
            <Text size="sm">
              • You have FINAL decision authority on research proposals (SANCTIONED or REJECTED)
            </Text>
            <Text size="sm">
              • You approve/reject all fund requests institute-wide
            </Text>
            <Text size="sm">
              • You approve large expenditures &gt; ₹200,000 (after PI and HOD approval)
            </Text>
            <Text size="sm" fw={600} mt="md">
              Additional Responsibilities:
            </Text>
            <Text size="sm">
              • Update patent status and notify faculty of IP changes
            </Text>
            <Text size="sm">
              • Pre-approve (verify) proposals before final approval
            </Text>
            <Text size="sm">
              • Access to all institute research statistics and budgets
            </Text>
          </Stack>
        </Alert>

        {/* Quick Navigation */}
        <Card withBorder padding="lg" radius="md" bg="gray.0">
          <Title order={4} mb="md">
            🚀 Quick Navigation
          </Title>
          <Group justify="center" wrap="wrap" gap="md">
            <Button component="a" href="/rspc/projects?action=approve" color="red">
              Approve Proposals
            </Button>
            <Button component="a" href="/rspc/funds?action=approve" variant="light">
              Approve Funds
            </Button>
            <Button component="a" href="/rspc/expenditures?level=dean" variant="light">
              Large Expenditures
            </Button>
            <Button component="a" href="/rspc/patents" variant="light">
              Patents
            </Button>
            <Button component="a" href="/rspc/reports?filter=institute" variant="light">
              Analytics
            </Button>
          </Group>
        </Card>
      </Stack>
    </Container>
  );
}

export default DeanRSPCDashboard;
