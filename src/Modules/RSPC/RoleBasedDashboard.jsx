import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Stack, Loader, Center, Alert } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";

// Import role-specific dashboard components
import PIBasedDashboard from "./PIBasedDashboard";
import HODBasedDashboard from "./HODBasedDashboard";
import DeanRSPCDashboard from "./DeanRSPCDashboard";
import DirectorDashboard from "./DirectorDashboard";
import RSPCAdminDashboard from "./RSPCAdminDashboard";
import CommitteeDashboard from "./CommitteeDashboard";

function RoleBasedDashboard() {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedRole = sessionStorage.getItem("rspc_active_role");
    const authToken = localStorage.getItem("authToken");

    // Check authentication and role
    if (!authToken) {
      setError("Not authenticated. Redirecting to login...");
      setTimeout(() => navigate("/accounts/login"), 2000);
      return;
    }

    if (!storedRole) {
      setError("RSPC role not activated. Redirecting to RSPC login...");
      setTimeout(() => navigate("/rspc-login"), 2000);
      return;
    }

    setRole(storedRole);
    setLoading(false);
  }, [navigate]);

  if (loading) {
    return (
      <Center h="100vh">
        <Stack align="center">
          <Loader size="lg" />
        </Stack>
      </Center>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert icon={<IconAlertCircle size={16} />} color="red" mt="lg">
          {error}
        </Alert>
      </Container>
    );
  }

  // Render role-specific dashboard
  switch (role) {
    case "pi":
    case "faculty":
      return <PIBasedDashboard role={role} />;
    case "hod":
      return <HODBasedDashboard />;
    case "dean_rspc":
      return <DeanRSPCDashboard />;
    case "director":
      return <DirectorDashboard />;
    case "rspc_admin":
      return <RSPCAdminDashboard />;
    case "committee":
      return <CommitteeDashboard />;
    default:
      return (
        <Container>
          <Alert icon={<IconAlertCircle size={16} />} color="yellow" mt="lg">
            Unknown role: {role}. Please log in again.
          </Alert>
        </Container>
      );
  }
}

export default RoleBasedDashboard;
