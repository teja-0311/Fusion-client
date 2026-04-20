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
} from "@mantine/core";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { notifications } from "@mantine/notifications";
import { host } from "../routes/globalRoutes";

function RSPCLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [availableRoles, setAvailableRoles] = useState([]);
  const navigate = useNavigate();

  // Fetch available roles on component mount
  useEffect(() => {
    const roles = [
      { value: "dean_rspc", label: "Dean (RSPC)" },
      { value: "hod", label: "Head of Department (HOD)" },
      { value: "pi", label: "Principal Investigator (PI)" },
      { value: "faculty", label: "Faculty Member" },
    ];
    setAvailableRoles(roles);
  }, []);

  // Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      const rspcRole = sessionStorage.getItem("rspc_active_role");
      if (rspcRole) {
        navigate("/rspc-dashboard");
      }
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password || !role) {
      notifications.show({
        title: "Validation Error",
        message: "Please fill in all fields and select a role.",
        color: "yellow",
        position: "top-center",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${host}/research_procedures/api/rspc-login/`,
        {
          username,
          password,
          role,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        sessionStorage.setItem("rspc_active_role", response.data.role);
        sessionStorage.setItem(
          "rspc_active_role_label",
          response.data.role_label
        );
        sessionStorage.setItem(
          "rspc_role_description",
          response.data.role_description || ""
        );

        notifications.show({
          title: "Login Successful",
          message: `Logged in as ${response.data.role_label}`,
          color: "green",
          autoClose: 2000,
        });

        navigate("/rspc-dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);

      let errorMessage = "Something went wrong. Please try again later.";
      if (err.response?.status === 401) {
        errorMessage = "Invalid username or password.";
      } else if (err.response?.status === 403) {
        errorMessage = "Your account does not have this role.";
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      }

      notifications.show({
        title: "Login Failed",
        message: errorMessage,
        color: "red",
        position: "top-center",
        withCloseButton: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Center w="100%" min-height="100vh">
      <Container w={400}>
        <Paper withBorder shadow="lg" p={30} radius="md">
          <Stack gap="lg">
            <div>
              <Title order={2} ta="center">
                RSPC Module
              </Title>
              <Text ta="center" size="sm" c="dimmed" mt={8}>
                Research Strategic Planning & Coordination
              </Text>
            </div>

            <form onSubmit={handleSubmit}>
              <Stack gap="md">
                <TextInput
                  label="Username"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.currentTarget.value)}
                  required
                />

                <PasswordInput
                  label="Password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.currentTarget.value)}
                  required
                />

                <Select
                  label="Select Role"
                  placeholder="Choose a role"
                  data={availableRoles}
                  value={role}
                  onChange={(val) => setRole(val || "")}
                  required
                  searchable
                />

                <Button
                  fullWidth
                  type="submit"
                  loading={loading}
                  color="blue"
                >
                  Login
                </Button>
              </Stack>
            </form>

            <Button
              fullWidth
              variant="subtle"
              onClick={() => navigate("/dashboard")}
            >
              Back to Dashboard
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Center>
  );
}

export default RSPCLogin;
