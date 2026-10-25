import { useNavigate } from "react-router-dom";

import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Stack,
  Chip,
} from "@mui/material";

import {
  ArrowForwardRounded,
  TaskAltRounded,
  SecurityRounded,
  BoltRounded,
  CheckCircleRounded,
} from "@mui/icons-material";

import { useAuth } from "../context/useAuth";

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <TaskAltRounded fontSize="large" />,
      title: "Smart Task Management",
      description:
        "Organize your daily tasks, update progress, and stay focused.",
    },
    {
      icon: <SecurityRounded fontSize="large" />,
      title: "Secure Workspace",
      description:
        "Access your tasks through secure authentication.",
    },
    {
      icon: <BoltRounded fontSize="large" />,
      title: "Fast & Reliable",
      description:
        "Powered by FastAPI, PostgreSQL, Redis, and React.",
    },
  ];

  return (
    <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh" }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            textAlign: "center",
            pt: { xs: 9, md: 14 },
            pb: 9,
          }}
        >
          <Chip
            icon={<BoltRounded />}
            label="Your modern productivity workspace"
            sx={{
              bgcolor: "#eef2ff",
              color: "#4338ca",
              fontWeight: 600,
              mb: 4,
            }}
          />

          <Typography
            component="h1"
            variant="h2"
            sx={{
              fontWeight: 800,
              fontSize: { xs: 38, md: 64 },
              letterSpacing: "-2px",
              lineHeight: 1.15,
            }}
          >
            Manage tasks.
            <Box
              component="span"
              sx={{ display: "block", color: "#4f46e5" }}
            >
              Focus on what matters.
            </Box>
          </Typography>

          <Typography
            component="p"
            sx={{
              mt: 3,
              color: "#64748b",
              fontSize: 18,
              maxWidth: 620,
              mx: "auto",
              lineHeight: 1.8,
            }}
          >
            Plan, organize, and track your work with a
            beautifully simple task management platform.
          </Typography>

    <Stack
  direction="row"
  spacing={3}
  sx={{
    justifyContent: "center",
    flexWrap: "wrap",
    mt: 5,
  }}
>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForwardRounded />}
              onClick={() =>
                navigate(
                  isAuthenticated
                    ? "/dashboard"
                    : "/register"
                )
              }
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 700,
              }}
            >
              {isAuthenticated
                ? "Open Dashboard"
                : "Start for Free"}
            </Button>

            <Button
              variant="outlined"
              size="large"
              onClick={() =>
                navigate(
                  isAuthenticated
                    ? "/dashboard"
                    : "/login"
                )
              }
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
              }}
            >
              {isAuthenticated
                ? "View Tasks"
                : "Sign In"}
            </Button>
          </Stack>

     <Stack
  direction="row"
  spacing={3}
  sx={{
    justifyContent: "center",
    flexWrap: "wrap",
    mt: 5,
  }}
>
            {[
              "Simple workflow",
              "Secure access",
              "Cloud powered",
            ].map((item) => (
              <Box
                key={item}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <CheckCircleRoundedIconWrapper />
                <Typography
                  component="span"
                  sx={{
                    fontSize: 14,
                    color: "#64748b",
                  }}
                >
                  {item}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Box>

        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={3}
          sx={{ pb: 10 }}
        >
          {features.map((feature) => (
            <Paper
              key={feature.title}
              elevation={0}
              sx={{
                flex: 1,
                p: 4,
                borderRadius: 4,
                border: "1px solid #e2e8f0",
                bgcolor: "#fff",
              }}
            >
              <Box
                sx={{
                  color: "#4f46e5",
                  bgcolor: "#eef2ff",
                  width: 60,
                  height: 60,
                  borderRadius: 3,
                  display: "grid",
                  placeItems: "center",
                  mb: 3,
                }}
              >
                {feature.icon}
              </Box>

              <Typography
                component="h2"
                variant="h6"
                sx={{ fontWeight: 700 }}
              >
                {feature.title}
              </Typography>

              <Typography
                component="p"
                sx={{
                  color: "#64748b",
                  mt: 1.5,
                  lineHeight: 1.7,
                }}
              >
                {feature.description}
              </Typography>
            </Paper>
          ))}
        </Stack>
      </Container>
    </Box>
  );
}

function CheckCircleRoundedIconWrapper() {
  return (
    <CheckCircleRounded
      sx={{ fontSize: 19, color: "#4f46e5" }}
    />
  );
}