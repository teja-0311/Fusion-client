import { Container, Stack, Title, Text, Group, Button, Card, SimpleGrid, Badge, Table, Alert } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { IconLogout, IconAlertCircle, IconCheck, IconCurrencyRupee, IconTrendingUp } from "@tabler/icons-react";

function DirectorDashboard() {
  const navigate = useNavigate();

  const operations = [
    {
      title: "💰 Approve Fund Allocation",
      description: "Final fund allocation authority for institute",
      icon: IconCurrencyRupee,
      actions: ["View Fund Requests", "Final Approval/Rejection", "Set Budget Limits"],
      link: "/rspc/funds?action=approve-director",
    },
    {
      title: "📊 Institute Dashboard",
      description: "View institute-wide research and financial summaries",
      icon: IconTrendingUp,
      actions: ["Research Summaries", "Budget Overview", "Key Metrics", "Trends Analysis"],
      link: "/rspc/reports?filter=institute",
    },
  ];

  const dataVisibility = [
    { label: "✓ Institute Fund Allocations", status: "Visible" },
    { label: "✓ Research Project Summaries", status: "Visible" },
    { label: "✓ Budget Overview (by Dept)", status: "Visible" },
    { label: "✓ Key Performance Metrics", status: "Visible" },
    { label: "✓ Dean RSPC Dashboard Link", status: "Visible" },
    { label: "✗ Individual Project Details", status: "Hidden" },
    { label: "✗ Detailed Expenditures", status: "Hidden" },
    { label: "✗ Staff Records", status: "Hidden" },
  ];

  return (
    <Container size="lg" py="xl">
      {/* Header */}
      <Group justify="space-between" mb="xl">
        <div>
          <Title order={2}>Director - Institute Dashboard</Title>
          <Text c="dimmed" mt={4}>
            Strategic oversight of research and financial allocations
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
              As Director, you have these key responsibilities:
            </Text>
          </Card.Section>

          <Card.Section inheritPadding py="md">
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              {operations.map((op, idx) => {
                const Icon = op.icon;
                return (
                  <Card key={idx} withBorder p="md" radius="md">
                    <Group gap="md" mb="md">
                      <Icon size={24} color="purple" />
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
                    <Button size="sm" fullWidth component="a" href={op.link} variant="light" color="purple">
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

        {/* Important Notes */}
        <Alert icon={<IconAlertCircle size={16} />} color="purple" title="Important Notes - Director Role">
          <Stack gap="xs">
            <Text size="sm">
              • You are the FINAL authority on fund allocation institute-wide
            </Text>
            <Text size="sm">
              • You see institute-wide summaries, not individual project details
            </Text>
            <Text size="sm">
              • Detailed project management is delegated to Dean RSPC
            </Text>
            <Text size="sm">
              • You have access to key performance metrics and research trends
            </Text>
          </Stack>
        </Alert>

        {/* Quick Navigation */}
        <Card withBorder padding="lg" radius="md" bg="gray.0">
          <Title order={4} mb="md">
            🚀 Quick Navigation
          </Title>
          <Group justify="center" wrap="wrap" gap="md">
            <Button component="a" href="/rspc/funds?action=approve-director" color="purple">
              Approve Funds
            </Button>
            <Button component="a" href="/rspc/reports?filter=institute" variant="light">
              Institute Dashboard
            </Button>
          </Group>
        </Card>
      </Stack>
    </Container>
  );
}

export default DirectorDashboard;
