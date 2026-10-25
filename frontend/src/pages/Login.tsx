
import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Stack,
  IconButton,
  InputAdornment,
} from "@mui/material";

import {
  LockOutlined,
  Visibility,
  VisibilityOff,
  CheckCircleOutlined,
} from "@mui/icons-material";

import { useAuth } from "../context/useAuth";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const message = (
    location.state as { message?: string } | null
  )?.message;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login({
        email: email.trim(),
        password,
      });

      navigate("/dashboard", { replace: true });
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const detail = err.response?.data?.detail;

        setError(
          typeof detail === "string"
            ? detail
            : "Login failed. Please check your credentials."
        );
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 72px)",
        bgcolor: "#f8fafc",
        display: "flex",
      }}
    >
      {/* LEFT SIDE - BRANDING */}
      <Box
        sx={{
          width: "48%",
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          justifyContent: "center",
          px: { md: 6, lg: 10 },
          color: "#ffffff",
          background:
            "linear-gradient(145deg, #312e81 0%, #4f46e5 60%, #2563eb 100%)",
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
          Welcome back
          <Box component="span" sx={{ display: "block" }}>
            to TaskFlow.
          </Box>
        </Typography>

        <Typography
          component="p"
          sx={{
            fontSize: 18,
            lineHeight: 1.8,
            opacity: 0.85,
            maxWidth: 430,
            mb: 5,
          }}
        >
          Your workspace is waiting. Sign in and continue
          organizing your work effortlessly.
        </Typography>

        <Stack spacing={2.5}>
          {[
            "Manage your daily tasks",
            "Track completion and progress",
            "Access your secure workspace",
          ].map((feature) => (
            <Box
              key={feature}
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
                {feature}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Box>

      {/* RIGHT SIDE - LOGIN FORM */}
      <Container
        maxWidth="sm"
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 6,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: 460,
            p: { xs: 3, sm: 5 },
            border: "1px solid #e2e8f0",
            borderRadius: 4,
            bgcolor: "#ffffff",
          }}
        >
          {/* LOGIN ICON */}
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: 3,
              bgcolor: "#eef2ff",
              color: "#4f46e5",
              display: "grid",
              placeItems: "center",
              mb: 3,
            }}
          >
            <LockOutlined />
          </Box>

          {/* TITLE */}
          <Typography
            component="h2"
            variant="h4"
            sx={{
              fontWeight: 800,
              color: "#0f172a",
            }}
          >
            Sign in
          </Typography>

          <Typography
            component="p"
            sx={{
              color: "#64748b",
              mt: 1,
              mb: 4,
            }}
          >
            Enter your credentials to access your account.
          </Typography>

          {/* SUCCESS MESSAGE */}
          {message && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {message}
            </Alert>
          )}

          {/* ERROR MESSAGE */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* LOGIN FORM */}
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2.5}>
              {/* EMAIL */}
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

              {/* PASSWORD */}
              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                fullWidth
                required
                autoComplete="current-password"
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

              {/* SUBMIT BUTTON */}
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={loading}
                sx={{
                  py: 1.5,
                  fontWeight: 700,
                  textTransform: "none",
                  borderRadius: 2,
                  bgcolor: "#4f46e5",
                  "&:hover": {
                    bgcolor: "#4338ca",
                  },
                }}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </Stack>
          </Box>

          {/* REGISTER LINK */}
          <Typography
            component="p"
            sx={{
              textAlign: "center",
              color: "#64748b",
              mt: 3,
            }}
          >
            Don't have an account?{" "}
            <Link
              to="/register"
              style={{
                color: "#4f46e5",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Create an account
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}
