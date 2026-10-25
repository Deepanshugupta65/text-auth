
import { useState, type SubmitEventHandler } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Stack,
  InputAdornment,
  IconButton,
} from "@mui/material";

import {
  PersonAddOutlined,
  Visibility,
  VisibilityOff,
  CheckCircleOutlined,
} from "@mui/icons-material";

import { registerUser } from "../api/authApi";
import api from "../api/axios";

export default function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (
    event
  ) => {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    // Temporary debugging
    console.log("========== REGISTER DEBUG ==========");
    console.log("API Base URL:", api.defaults.baseURL);
    console.log(
      "Register URL:",
      api.getUri({ url: "/auth/register" })
    );
    console.log("Registration email:", email.trim());

    try {
      const response = await registerUser({
        email: email.trim(),
        password,
      });

      console.log("Registration successful:", response);

      navigate("/login", {
        replace: true,
        state: {
          message:
            "Account created successfully. Please sign in.",
        },
      });
    } catch (err: unknown) {
      console.error("Registration failed");

      if (axios.isAxiosError(err)) {
        console.error("HTTP Status:", err.response?.status);
        console.error("Backend Response:", err.response?.data);
        console.error("Request Path:", err.config?.url);
        console.error("Request Base URL:", err.config?.baseURL);
        console.error("Axios Error:", err.message);

        const detail = err.response?.data?.detail;

        if (typeof detail === "string") {
          setError(detail);
        } else if (err.response?.status === 404) {
          setError(
            "Registration endpoint not found (404). Check backend URL."
          );
        } else if (err.response?.status === 422) {
          setError(
            "Invalid registration data. Check email and password."
          );
        } else if (!err.response) {
          setError(
            "Cannot connect to backend. Check network or CORS."
          );
        } else {
          setError(
            `Registration failed (HTTP ${err.response.status}).`
          );
        }
      } else if (err instanceof Error) {
        console.error("Error:", err.message);
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
      console.log("========== END DEBUG ==========");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 72px)",
        display: "flex",
        bgcolor: "#f8fafc",
      }}
    >
      {/* LEFT SIDE */}
      <Box
        sx={{
          width: "48%",
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          justifyContent: "center",
          px: { md: 6, lg: 10 },
          color: "#ffffff",
          background:
            "linear-gradient(145deg, #1e40af, #4f46e5)",
        }}
      >
        <Typography
          component="h1"
          variant="h3"
          sx={{
            fontWeight: 800,
            lineHeight: 1.2,
            mb: 3,
          }}
        >
          Your productivity
          <Box component="span" sx={{ display: "block" }}>
            starts here.
          </Box>
        </Typography>

        <Typography
          component="p"
          sx={{
            fontSize: 18,
            opacity: 0.85,
            lineHeight: 1.8,
            maxWidth: 430,
            mb: 5,
          }}
        >
          Create your account and start managing your
          daily work in one place.
        </Typography>

        <Stack spacing={2.5}>
          {[
            "Create and organize tasks",
            "Track your progress",
            "Secure personal workspace",
          ].map((item) => (
            <Box
              key={item}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <CheckCircleOutlined
                sx={{ color: "#c7d2fe" }}
              />
              <Typography component="span">
                {item}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Box>

      {/* RIGHT SIDE */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: { xs: 2, sm: 4 },
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: 460,
            p: { xs: 3, sm: 5 },
            borderRadius: 4,
            border: "1px solid #e2e8f0",
            bgcolor: "#ffffff",
          }}
        >
          <Box
            sx={{
              width: 52,
              height: 52,
              bgcolor: "#eef2ff",
              color: "#4f46e5",
              borderRadius: 3,
              display: "grid",
              placeItems: "center",
              mb: 3,
            }}
          >
            <PersonAddOutlined />
          </Box>

          <Typography
            component="h2"
            variant="h4"
            sx={{
              fontWeight: 800,
              color: "#0f172a",
            }}
          >
            Create account
          </Typography>

          <Typography
            component="p"
            sx={{
              color: "text.secondary",
              mt: 1,
              mb: 3,
            }}
          >
            Get started with your personal workspace.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2.5}>
              <TextField
                label="Email address"
                type="email"
                fullWidth
                required
                autoComplete="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
              />

              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                fullWidth
                required
                autoComplete="new-password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          type="button"
                          edge="end"
                          aria-label={
                            showPassword
                              ? "Hide password"
                              : "Show password"
                          }
                          onClick={() =>
                            setShowPassword((prev) => !prev)
                          }
                        >
                          {showPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <TextField
                label="Confirm password"
                type={showPassword ? "text" : "password"}
                fullWidth
                required
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={loading}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 700,
                  bgcolor: "#4f46e5",
                  "&:hover": {
                    bgcolor: "#4338ca",
                  },
                }}
              >
                {loading
                  ? "Creating account..."
                  : "Create Account"}
              </Button>
            </Stack>
          </Box>

          <Typography
            component="p"
            sx={{
              textAlign: "center",
              mt: 3,
              color: "text.secondary",
            }}
          >
            Already have an account?{" "}
            <Link
              to="/login"
              style={{
                color: "#4f46e5",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Sign in
            </Link>
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}
