import { Container, Stack, Title, Text, Group, Button, Card, SimpleGrid, Badge, Table, Alert } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { IconLogout, IconAlertCircle, IconCheck, IconUsers } from "@tabler/icons-react";

function CommitteeDashboard() {
  const navigate = useNavigate();

  const operations = [
    {
      title: "📋 Review Staff Applications",
      description: "Review applications for staff positions on your committee",
      icon: IconUsers,
      actions: ["View Applications", "Review Credentials", "Submit Recommendation"],
      link: "/rspc/staff?action=review",
    },
    {
      title: "✅ Submit Committee Verdict",
      description: "Submit your recommendation (Approve/Reject/Abstain)",
      icon: IconCheck,
      actions: ["Approve", "Reject", "Abstain", "Provide Remarks"],
      link: "/rspc/staff?action=submit-verdict",
    },
    {
      title: "📝 Declare Conflict of Interest",
      description: "Declare any conflicts of interest for your committee assignment",
      icon: IconUsers,
      actions: ["Declare COI", "View Committee Details", "Track Status"],
      link: "/rspc/staff?action=declare-coi",
    },
  ];

  const dataVisibility = [
    { label: "✓ Staff Position Details", status: "Visible" },
    { label: "✓ Applications for Review", status: "Visible" },
    { label: "✓ Committee Assignments", status: "Visible" },
    { label: "✓ Your Committee Verdict Status", status: "Visible" },
    { label: "✗ Other Committee Members' Verdicts", status: "Hidden (Confidential)" },
    { label: "✗ Projects", status: "Hidden" },
    { label: "✗ Budget Data", status: "Hidden" },
  ];

  return (
    <Container size="lg" py="xl">
      {/* Header */}
      <Group justify="space-between" mb="xl">
        <div>
          <Title order={2}>Committee Member - Staff Selection</Title>
          <Text c="dimmed" mt={4}>
            Review staff applications and submit committee recommendation
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
              As a committee member, you can perform these operations:
            </Text>
          </Card.Section>

          <Card.Section inheritPadding py="md">
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              {operations.map((op, idx) => {
                const Icon = op.icon;
                return (
                  <Card key={idx} withBorder p="md" radius="md">
                    <Group gap="md" mb="md">
                      <Icon size={24} color="cyan" />
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
                    <Button size="sm" fullWidth component="a" href={op.link} variant="light" color="cyan">
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
                      <Badge color={item.status === "Visible" || item.status === "Visible (Read-only)" ? "green" : "gray"}>
                        {item.status}
                      </Badge>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Card.Section>
        </Card>

        {/* Committee Requirements */}
        <Card withBorder padding="lg" radius="md">
          <Card.Section inheritPadding py="md" withBorder>
            <Title order={4}>📋 Committee Requirements</Title>
          </Card.Section>

          <Card.Section inheritPadding py="md">
            <Stack gap="sm">
              <Text size="sm">
                <strong>✓ Minimum Committee Size:</strong> 3 PI-eligible faculty members
              </Text>
              <Text size="sm">
                <strong>✓ Eligibility:</strong> All committee members must be PI-eligible (Professor/Assoc. Prof/Asst. Prof)
              </Text>
              <Text size="sm">
                <strong>✓ Conflict of Interest:</strong> You MUST declare any conflicts with candidates
              </Text>
              <Text size="sm">
                <strong>✓ Confidentiality:</strong> You cannot see other members' verdicts (kept confidential)
              </Text>
            </Stack>
          </Card.Section>
        </Card>

        {/* Important Notes */}
        <Alert icon={<IconAlertCircle size={16} />} color="cyan" title="Important Notes - Committee Member Role">
          <Stack gap="xs">
            <Text size="sm">
              • You are part of a staff selection committee for one or more positions
            </Text>
            <Text size="sm">
              • Your recommendation (Approve/Reject/Abstain) is confidential
            </Text>
            <Text size="sm">
              • You MUST declare conflict of interest if you know the candidate
            </Text>
            <Text size="sm">
              • Your verdict goes to HOD for final approval
            </Text>
            <Text size="sm">
              • You cannot see other committee members' verdicts until submission is complete
            </Text>
            <Text size="sm">
              • You can only access applications for your assigned committee(s)
            </Text>
          </Stack>
        </Alert>

        {/* Quick Navigation */}
        <Card withBorder padding="lg" radius="md" bg="gray.0">
          <Title order={4} mb="md">
            🚀 Quick Navigation
          </Title>
          <Group justify="center" wrap="wrap" gap="md">
            <Button component="a" href="/rspc/staff?action=review" color="cyan">
              Review Applications
            </Button>
            <Button component="a" href="/rspc/staff?action=submit-verdict" variant="light">
              Submit Verdict
            </Button>
            <Button component="a" href="/rspc/staff?action=declare-coi" variant="light">
              Declare COI
            </Button>
          </Group>
        </Card>
      </Stack>
    </Container>
  );
}

export default CommitteeDashboard;
