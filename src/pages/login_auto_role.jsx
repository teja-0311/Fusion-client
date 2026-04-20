import {
  Button,
  Center,
  Container,
  Paper,
  PasswordInput,
  TextInput,
  Title,
  Stack,
  Loader,
} from "@mantine/core";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { notifications } from "@mantine/notifications";
import { useDispatch } from "react-redux";
import { setName } from "../redux/userslice";
import { loginRoute, host } from "../routes/globalRoutes";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [autoLoginInProgress, setAutoLoginInProgress] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setAutoLoginInProgress(true);

    try {
      // First, verify credentials with standard login
      const credentialResponse = await axios.post(loginRoute, {
        username,
        password,
      });

      if (credentialResponse.status === 200) {
        // Credentials verified, now get automatic role assignment
        const autoLoginResponse = await axios.post(
          `${host}/research_procedures/api/rspc-auto-login/`,
          {
            username,
            password,
          }
        );

        if (autoLoginResponse.data.success) {
          // Auto role assignment successful
          const assignedRole = autoLoginResponse.data.role;
          const roleLabel = autoLoginResponse.data.role_label;

          // Store auth token and active role
          dispatch(setName(username));
          localStorage.setItem("authToken", credentialResponse.data.token);
          sessionStorage.setItem("rspc_active_role", assignedRole);

          notifications.show({
            title: "Login Successful",
            message: `Logged in as ${roleLabel}`,
            color: "green",
          });

          // Route to appropriate dashboard
          navigate("/rspc/dashboard");
        }
      }
    } catch (err) {
      console.error("Login error:", err);

      let errorMessage = "Something went wrong. Please try again later.";

      if (
        err.response?.status === 401 ||
        err.response?.data?.error?.includes("Invalid")
      ) {
        errorMessage =
          "Invalid username or password! Please use correct credentials.";
      } else if (err.response?.status === 403) {
        errorMessage =
          err.response.data?.error ||
          "You do not have any RSPC roles assigned.";
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      }

      notifications.show({
        title: "Login Failed",
        message: errorMessage,
        color: "red",
        position: "top-center",
      });
    } finally {
      setLoading(false);
      setAutoLoginInProgress(false);
    }
  };

  return (
    <Center style={{ height: "100vh" }}>
      <Container size={420}>
        <Paper radius="md" p="xl" withBorder>
          <Title
            align="center"
            sx={(theme) => ({
              fontFamily: `${theme.fontFamily}`,
              fontWeight: 900,
              marginBottom: "xl",
            })}
          >
            RSPC Login
          </Title>

          <form onSubmit={handleLogin}>
            <Stack spacing="lg">
              <TextInput
                label="Username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.currentTarget.value)}
                disabled={loading}
                required
              />

              <PasswordInput
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.currentTarget.value)}
                disabled={loading}
                required
              />

              <Button
                fullWidth
                type="submit"
                disabled={loading}
                loading={loading}
              >
                {loading ? (
                  <>
                    <Loader size="xs" mr={8} />
                    {autoLoginInProgress
                      ? "Assigning Role..."
                      : "Verifying Credentials..."}
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </Stack>
          </form>

          <div
            style={{
              marginTop: "20px",
              padding: "10px",
              backgroundColor: "#f0f0f0",
              borderRadius: "4px",
              fontSize: "12px",
              color: "#666",
            }}
          >
            <p style={{ marginBottom: "5px" }}>
              <strong>Test Credentials:</strong>
            </p>
            <p style={{ margin: "2px 0" }}>Username: pi_user</p>
            <p style={{ margin: "2px 0" }}>Password: password123</p>
            <p style={{ margin: "2px 0" }}>(Auto-assigns Faculty/PI role)</p>
          </div>
        </Paper>
      </Container>
    </Center>
  );
}

export default LoginPage;
