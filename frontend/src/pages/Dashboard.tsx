
import { useNavigate } from "react-router-dom";

import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
} from "@mui/material";

import {
  DashboardOutlined,
  AddTask,
} from "@mui/icons-material";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        bgcolor: "#f8fafc",
        minHeight: "calc(100vh - 72px)",
        py: 6,
      }}
    >
      <Container maxWidth="lg">
        {/* PAGE HEADING */}
        <Typography
          component="h1"
          variant="h4"
          sx={{
            fontWeight: 800,
            color: "#0f172a",
          }}
        >
          Dashboard
        </Typography>

        <Typography
          component="p"
          sx={{
            color: "text.secondary",
            mt: 1,
          }}
        >
          Welcome to your TaskFlow workspace.
        </Typography>

        {/* MAIN DASHBOARD CARD */}
        <Paper
          elevation={0}
          sx={{
            mt: 4,
            p: { xs: 3, md: 5 },
            borderRadius: 4,
            border: "1px solid #e2e8f0",
            textAlign: "center",
            bgcolor: "#ffffff",
          }}
        >
          <DashboardOutlined
            sx={{
              fontSize: 60,
              color: "#4f46e5",
              mb: 2,
            }}
          />

          <Typography
            component="h2"
            variant="h5"
            sx={{
              fontWeight: 700,
              color: "#0f172a",
            }}
          >
            Your workspace is ready
          </Typography>

          <Typography
            component="p"
            sx={{
              color: "text.secondary",
              mt: 2,
              maxWidth: 500,
              mx: "auto",
              lineHeight: 1.7,
            }}
          >
            You are signed in. Task management will be
            integrated with your FastAPI backend next.
          </Typography>

          <Button
            variant="contained"
            startIcon={<AddTask />}
            sx={{
              mt: 3,
              px: 3,
              py: 1.2,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
            }}
            onClick={() => navigate("/")}
          >
            Explore TaskFlow
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}
