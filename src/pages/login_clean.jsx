import {
  Button,
  Center,
  Container,
  Paper,
  PasswordInput,
  TextInput,
  Title,
  Stack,
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

    try {
      // Verify credentials with standard login
      const credResponse = await axios.post(loginRoute, {
        username,
        password,
      });

      if (credResponse.status === 200) {
        // Credentials verified, now auto-assign role
        const roleResponse = await axios.post(
          `${host}/research_procedures/api/rspc-auto-login/`,
          {
            username,
            password,
          }
        );

        if (roleResponse.data.success) {
          const assignedRole = roleResponse.data.role;
          const roleLabel = roleResponse.data.role_label;

          // Store auth and role
          dispatch(setName(username));
          localStorage.setItem("authToken", credResponse.data.token);
          sessionStorage.setItem("rspc_active_role", assignedRole);

          notifications.show({
            title: "Login Successful",
            message: `Logged in as ${roleLabel}`,
            color: "green",
          });

          navigate("/rspc/dashboard");
        }
      }
    } catch (err) {
      console.error("Login error:", err);

      let errorMessage = "Something went wrong. Please try again later.";
      if (err.response?.status === 401) {
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
    }
  };

  return (
    <Center w="100%">
      <Container w={420} my={100}>
        <Title ta="center">Welcome to Fusion!</Title>

        <Paper
          withBorder
          shadow="lg"
          p={30}
          mt={40}
          radius="md"
          style={{ border: "2px solid #15ABFF" }}
        >
          <form onSubmit={handleLogin}>
            <Stack>
              <TextInput
                label="Username/Email"
                placeholder="username or email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={loading}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleLogin(e);
                  }
                }}
              />
              <PasswordInput
                label="Password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleLogin(e);
                  }
                }}
              />

              <Button
                fullWidth
                size="md"
                bg="#15ABFF"
                type="submit"
                loading={loading}
              >
                Sign in
              </Button>

              <Button
                fullWidth
                variant="outline"
                color="blue"
                size="sm"
                onClick={() => (window.location.href = "/reset-password")}
                disabled={loading}
              >
                Forgot Password?
              </Button>
            </Stack>
          </form>
        </Paper>
      </Container>
    </Center>
  );
}

export default LoginPage;
