import {
  Button,
  Center,
  Container,
  Paper,
  PasswordInput,
  TextInput,
  Title,
  Select,
  Text,
  Stack,
  Grid,
  Card,
  Badge,
  Group,
  ThemeIcon,
  List,
  Tabs,
} from "@mantine/core";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { notifications } from "@mantine/notifications";
import { host } from "../routes/globalRoutes";
import {
  IconShield,
  IconUsers,
  IconFileText,
  IconChartBar,
  IconBriefcase,
  IconClipboardList,
} from "@tabler/icons-react";

const RSPC_ROLES = [
  {
    value: "dean_rspc",
    label: "Dean (RSPC)",
    icon: IconShield,
    color: "red",
    description: "Research Strategic Planning & Coordination",
    access: [
      "Project Proposals",
      "Staff Management",
      "Budget Allocation",
      "Expenditure Approval",
      "Fund Requests",
      "Reports & Analytics",
    ],
    capabilities: [
      "Approve/reject project proposals",
      "Manage staff assignments",
      "Allocate and reallocate budgets",
      "Approve fund requests",
      "Review expenditures",
      "Generate compliance reports",
    ],
  },
  {
    value: "hod",
    label: "Head of Department (HOD)",
    icon: IconUsers,
    color: "blue",
    description: "Department Research Oversight",
    access: [
      "Project Proposals (Departmental)",
      "Staff Coordination",
      "Budget Planning",
      "Expenditure Tracking",
    ],
    capabilities: [
      "Review departmental projects",
      "Coordinate staff assignments",
      "Plan departmental budget",
      "Track expenditures",
      "Submit to Dean for approval",
    ],
  },
  {
    value: "pi",
    label: "Principal Investigator (PI)",
    icon: IconBriefcase,
    color: "green",
    description: "Research Project Management",
    access: [
      "Project Proposals",
      "Staff Requests",
      "Expenditure Tracking",
      "Reports",
    ],
    capabilities: [
      "Submit project proposals",
      "Request staff assignments",
      "Track expenditures",
      "Submit progress reports",
      "Manage co-investigators",
    ],
  },
  {
    value: "faculty",
    label: "Faculty Member",
    icon: IconClipboardList,
    color: "violet",
    description: "Research Participation",
    access: ["My Projects", "Staff Details", "Reports"],
    capabilities: [
      "View assigned projects",
      "Access project resources",
      "View staff assignments",
      "Download reports",
    ],
  },
];

function RoleCard({ role, isSelected, onSelect }) {
  const IconComponent = role.icon;
  return (
    <Card
      padding="lg"
      radius="md"
      withBorder
      style={{
        cursor: "pointer",
        border: isSelected ? "2px solid var(--mantine-color-blue-6)" : "",
        backgroundColor: isSelected ? "var(--mantine-color-blue-0)" : "",
        transition: "all 0.3s ease",
      }}
      onClick={onSelect}
      className="role-card"
    >
      <Group justify="space-between" mb="md">
        <Group gap="xs">
          <ThemeIcon
            size="lg"
            radius="md"
            variant="light"
            color={role.color}
          >
            <IconComponent size={24} />
          </ThemeIcon>
          <div>
            <Text fw={600} size="sm">
              {role.label}
            </Text>
            <Text size="xs" c="dimmed">
              {role.description}
            </Text>
          </div>
        </Group>
        {isSelected && <Badge color="blue">Selected</Badge>}
      </Group>

      <Stack gap="xs" size="xs">
        <Text fw={500} size="xs">
          Access:
        </Text>
        <List size="xs" spacing="xs">
          {role.access.map((item, idx) => (
            <List.Item key={idx}>{item}</List.Item>
          ))}
        </List>
      </Stack>
    </Card>
  );
}

function RSPCComprehensiveLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("dean_rspc");
  const [loading, setLoading] = useState(false);
  const [showRoleInfo, setShowRoleInfo] = useState(true);
  const [activeTab, setActiveTab] = useState("roles");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const nextUrl = searchParams.get("next") || "/rspc-dashboard";

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      const rspcRole = sessionStorage.getItem("rspc_active_role");
      if (rspcRole) {
        navigate(nextUrl);
      }
    }
  }, [navigate, nextUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      notifications.show({
        title: "Validation Error",
        message: "Username and password are required.",
        color: "yellow",
        position: "top-center",
      });
      return;
    }

    if (!selectedRole) {
      notifications.show({
        title: "Validation Error",
        message: "Please select a role.",
        color: "yellow",
        position: "top-center",
      });
      return;
    }

    setLoading(true);

    try {
      // Call backend API to verify credentials and role
      const response = await axios.post(
        `${host}/spacs/api/rspc-login/`,
        {
          username,
          password,
          role: selectedRole,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        // Store RSPC role and details in session storage
        sessionStorage.setItem("rspc_active_role", selectedRole);
        const roleInfo = RSPC_ROLES.find((r) => r.value === selectedRole);
        sessionStorage.setItem(
          "rspc_active_role_label",
          roleInfo?.label || selectedRole
        );
        sessionStorage.setItem(
          "rspc_role_description",
          roleInfo?.description || ""
        );
        sessionStorage.setItem(
          "rspc_role_capabilities",
          JSON.stringify(roleInfo?.capabilities || [])
        );

        notifications.show({
          title: "RSPC Access Granted",
          message: `Welcome, ${roleInfo?.label}! You have been granted RSPC module access.`,
          color: "green",
          autoClose: 2000,
        });

        // Redirect to the appropriate dashboard
        navigate(nextUrl);
      }
    } catch (err) {
      console.error("RSPC login error:", err);

      let errorMessage = "Something went wrong. Please try again later.";
      if (err.response?.status === 401) {
        errorMessage =
          "Invalid username or password. Please check your credentials.";
      } else if (err.response?.status === 403) {
        errorMessage = `Your account does not have the ${
          RSPC_ROLES.find((r) => r.value === selectedRole)?.label
        } role. Please contact admin.`;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      }

      notifications.show({
        title: "RSPC Login Failed",
        message: errorMessage,
        color: "red",
        position: "top-center",
        withCloseButton: true,
        autoClose: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedRoleData = RSPC_ROLES.find((r) => r.value === selectedRole);

  return (
    <Center w="100%" min-height="100vh" py="xl">
      <Container size="xl" w="100%">
        <Stack gap="xl">
          {/* Header */}
          <div style={{ textAlign: "center" }}>
            <Title order={1} mb="xs">
              RSPC Module Access Portal
            </Title>
            <Text size="lg" c="dimmed">
              Research Strategic Planning & Coordination System
            </Text>
          </div>

          <Grid gutter="xl">
            {/* Left side: Role Selection & Info */}
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Paper withBorder shadow="sm" p="lg" radius="md">
                <Tabs value={activeTab} onChange={setActiveTab}>
                  <Tabs.List>
                    <Tabs.Tab value="roles">Available Roles</Tabs.Tab>
                    <Tabs.Tab value="details">Role Details</Tabs.Tab>
                  </Tabs.List>

                  <Tabs.Panel value="roles" pt="md">
                    <Stack gap="md">
                      <Text size="sm" c="dimmed">
                        Select your role to proceed with login:
                      </Text>
                      {RSPC_ROLES.map((role) => (
                        <RoleCard
                          key={role.value}
                          role={role}
                          isSelected={selectedRole === role.value}
                          onSelect={() => setSelectedRole(role.value)}
                        />
                      ))}
                    </Stack>
                  </Tabs.Panel>

                  <Tabs.Panel value="details" pt="md">
                    <Stack gap="md">
                      <div>
                        <Group gap="md" mb="md">
                          <ThemeIcon
                            size="lg"
                            radius="md"
                            variant="light"
                            color={selectedRoleData?.color}
                          >
                            {selectedRoleData?.icon &&
                              (() => {
                                const Icon = selectedRoleData.icon;
                                return <Icon size={24} />;
                              })()}
                          </ThemeIcon>
                          <div>
                            <Title order={4}>{selectedRoleData?.label}</Title>
                            <Text size="sm" c="dimmed">
                              {selectedRoleData?.description}
                            </Text>
                          </div>
                        </Group>

                        <Stack gap="lg">
                          <div>
                            <Text fw={600} mb="xs">
                              📋 Key Responsibilities:
                            </Text>
                            <List size="sm" spacing="xs">
                              {selectedRoleData?.capabilities.map((cap, idx) => (
                                <List.Item key={idx}>{cap}</List.Item>
                              ))}
                            </List>
                          </div>

                          <div>
                            <Text fw={600} mb="xs">
                              🔐 Module Access:
                            </Text>
                            <Group gap="xs" grow>
                              {selectedRoleData?.access.map((access, idx) => (
                                <Badge
                                  key={idx}
                                  size="lg"
                                  variant="light"
                                  color={selectedRoleData?.color}
                                >
                                  {access}
                                </Badge>
                              ))}
                            </Group>
                          </div>
                        </Stack>
                      </div>
                    </Stack>
                  </Tabs.Panel>
                </Tabs>
              </Paper>
            </Grid.Col>

            {/* Right side: Login Form */}
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Paper
                withBorder
                shadow="lg"
                p={30}
                radius="md"
                style={{ border: "2px solid #15ABFF" }}
              >
                <Stack gap="md" mb="lg">
                  <div style={{ textAlign: "center" }}>
                    <Title order={3}>RSPC Module Access</Title>
                    <Text size="sm" c="dimmed" mt={4}>
                      Activate the{" "}
                      <strong>{selectedRoleData?.label}</strong> role for this
                      session
                    </Text>
                  </div>
                </Stack>

                <form onSubmit={handleSubmit}>
                  <Stack gap="md">
                    {/* Display current role info */}
                    <Card
                      withBorder
                      padding="sm"
                      radius="md"
                      bg="blue.0"
                      style={{ borderLeft: "4px solid var(--mantine-color-blue-6)" }}
                    >
                      <Text size="xs" fw={500} mb={4}>
                        Selected Role:
                      </Text>
                      <Group gap="xs">
                        <Badge color={selectedRoleData?.color}>
                          {selectedRoleData?.label}
                        </Badge>
                        <Text size="xs" c="dimmed">
                          {selectedRoleData?.description}
                        </Text>
                      </Group>
                    </Card>

                    <TextInput
                      label="Username"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.currentTarget.value)}
                      required
                      size="md"
                    />

                    <PasswordInput
                      label="Password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.currentTarget.value)}
                      required
                      size="md"
                    />

                    <Stack gap="xs" mt="md">
                      <Button
                        fullWidth
                        type="submit"
                        loading={loading}
                        color="blue"
                        size="md"
                      >
                        Activate RSPC Access
                      </Button>

                      <Button
                        fullWidth
                        variant="subtle"
                        onClick={() => navigate("/dashboard")}
                      >
                        Back to Dashboard
                      </Button>
                    </Stack>
                  </Stack>
                </form>

                <Text
                  size="xs"
                  c="dimmed"
                  ta="center"
                  mt="lg"
                  style={{
                    borderTop: "1px solid var(--mantine-color-gray-2)",
                    paddingTop: "md",
                  }}
                >
                  ⚠️ This activates the RSPC role for this session only and does
                  not affect your login for other modules.
                </Text>
              </Paper>
            </Grid.Col>
          </Grid>

          {/* Footer Info */}
          <Paper withBorder p="md" radius="md" bg="gray.0">
            <Group justify="space-between" wrap="wrap">
              <div>
                <Text fw={500} size="sm">
                  🔐 Security Notice
                </Text>
                <Text size="xs" c="dimmed">
                  Your role determines which features and data you can access.
                  Unauthorized access attempts are logged and monitored.
                </Text>
              </div>
              <div>
                <Text fw={500} size="sm">
                  ❓ Need Help?
                </Text>
                <Text size="xs" c="dimmed">
                  Contact your system administrator if you believe you should
                  have access to a different role.
                </Text>
              </div>
            </Group>
          </Paper>
        </Stack>
      </Container>
    </Center>
  );
}

export default RSPCComprehensiveLogin;
