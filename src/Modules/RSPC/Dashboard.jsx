import { useEffect, useState } from "react";
import { Loader, Center, Card, Stack, Text } from "@mantine/core";

import PIBasedDashboard from "./PIBasedDashboard";
import HODBasedDashboard from "./HODBasedDashboard";
import DeanRSPCDashboard from "./DeanRSPCDashboard";
import DirectorDashboard from "./DirectorDashboard";
import RSPCAdminDashboard from "./RSPCAdminDashboard";
import CommitteeDashboard from "./CommitteeDashboard";

export default function Dashboard() {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState("");

  useEffect(() => {
    // Get active RSPC role from sessionStorage
    const role = sessionStorage.getItem("rspc_active_role");
    console.log("=== DASHBOARD DEBUG ===");
    console.log("Role from sessionStorage:", role);
    console.log("Role type:", typeof role);
    console.log("Role is null?", role === null);
    console.log("Role is undefined?", role === undefined);
    console.log("Role length:", role?.length);
    console.log("Role === 'pi'?", role === "pi");
    console.log("Role === 'hod'?", role === "hod");
    console.log("All sessionStorage:", {...sessionStorage});
    console.log("======================");
    
    setUserRole(role);
    setDebugInfo(`Role: "${role}" | Type: ${typeof role} | Null: ${role === null}`);
    setLoading(false);
  }, []);

  // Show loading while getting role
  if (loading) {
    return (
      <Center p="xl">
        <Loader />
      </Center>
    );
  }

  // Show debug info if no role
  if (!userRole) {
    return (
      <Center p="xl">
        <Card withBorder p="lg" style={{ maxWidth: 500 }}>
          <Stack gap="md">
            <Text fw={700} size="lg" c="red">⚠️ No Role Assigned</Text>
            <Text>Debug Information:</Text>
            <Card withBorder p="sm" bg="gray.1">
              <Text size="sm" ff="monospace">{debugInfo}</Text>
            </Card>
            <Text size="sm" c="dimmed">Please login again</Text>
          </Stack>
        </Card>
      </Center>
    );
  }

  console.log("Dispatching to role:", userRole);

  // Dispatch to role-specific dashboard component
  switch (userRole) {
    case "pi":
      console.log("✅ Rendering PIBasedDashboard");
      return <PIBasedDashboard />;
    case "hod":
      console.log("✅ Rendering HODBasedDashboard");
      return <HODBasedDashboard />;
    case "dean_rspc":
      console.log("✅ Rendering DeanRSPCDashboard");
      return <DeanRSPCDashboard />;
    case "director":
      console.log("✅ Rendering DirectorDashboard");
      return <DirectorDashboard />;
    case "rspc_admin":
      console.log("✅ Rendering RSPCAdminDashboard");
      return <RSPCAdminDashboard />;
    case "committee":
      console.log("✅ Rendering CommitteeDashboard");
      return <CommitteeDashboard />;
    default:
      console.error("❌ No matching role for:", userRole);
      return (
        <Center p="xl">
          <Card withBorder p="lg" style={{ maxWidth: 500 }}>
            <Stack gap="md">
              <Text fw={700} size="lg" c="red">⚠️ Unrecognized Role</Text>
              <Text>Debug Information:</Text>
              <Card withBorder p="sm" bg="gray.1">
                <Text size="sm" ff="monospace">
                  Role: "{userRole}" doesn't match any case in switch statement.
                  <br />Valid roles: pi, hod, dean_rspc, director, rspc_admin, committee
                </Text>
              </Card>
              <Text size="sm" c="dimmed">Please try logging in with a different account</Text>
            </Stack>
          </Card>
        </Center>
      );
  }
}
