import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
} from "@mui/material";

import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import TaskAltRoundedIcon from "@mui/icons-material/TaskAltRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";

import { useAuth } from "../context/useAuth";


export default function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const [anchorEl, setAnchorEl] =
    useState<null | HTMLElement>(null);

  const goTo = (path: string) => {
    setAnchorEl(null);
    navigate(path);
  };

  const handleLogout = async () => {
    setAnchorEl(null);
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "#ffffff",
        color: "#0f172a",
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar
          disableGutters
          sx={{ minHeight: 72, gap: 2 }}
        >
          <Box
            onClick={() => goTo("/")}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.2,
              cursor: "pointer",
              flexGrow: 1,
            }}
          >
            <Box
              sx={{
                width: 38,
                height: 38,
                bgcolor: "#4f46e5",
                color: "white",
                borderRadius: 2,
                display: "grid",
                placeItems: "center",
              }}
            >
              <TaskAltRoundedIcon />
            </Box>

            <Typography
              component="span"
              variant="h6"
              sx={{
                fontWeight: 800,
                letterSpacing: "-0.5px",
              }}
            >
              TaskFlow
            </Typography>
          </Box>

          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <Button
              color="inherit"
              onClick={() => goTo("/")}
            >
              Home
            </Button>

            {isAuthenticated ? (
              <>
                <Button
                  color="inherit"
                  onClick={() => goTo("/dashboard")}
                >
                  Dashboard
                </Button>

                <Avatar
                  sx={{
                    width: 34,
                    height: 34,
                    bgcolor: "#e0e7ff",
                    color: "#4338ca",
                    fontWeight: 700,
                  }}
                >
                  U
                </Avatar>

                <Button
                  variant="outlined"
                  startIcon={<LogoutRoundedIcon />}
                  onClick={() => void handleLogout()}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  color="inherit"
                  onClick={() => goTo("/login")}
                >
                  Sign In
                </Button>

                <Button
                  variant="contained"
                  onClick={() => goTo("/register")}
                  sx={{
                    borderRadius: 2,
                    px: 3,
                    textTransform: "none",
                    fontWeight: 700,
                  }}
                >
                  Get Started
                </Button>
              </>
            )}
          </Box>

          <IconButton
            aria-label="Open menu"
            sx={{ display: { xs: "flex", md: "none" } }}
            onClick={(event) =>
              setAnchorEl(event.currentTarget)
            }
          >
            <MenuRoundedIcon />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            <MenuItem onClick={() => goTo("/")}>
              Home
            </MenuItem>

            {isAuthenticated ? (
              [
                <MenuItem
                  key="dashboard"
                  onClick={() => goTo("/dashboard")}
                >
                  Dashboard
                </MenuItem>,
                <MenuItem
                  key="logout"
                  onClick={() => void handleLogout()}
                >
                  Logout
                </MenuItem>,
              ]
            ) : (
              [
                <MenuItem
                  key="login"
                  onClick={() => goTo("/login")}
                >
                  Sign In
                </MenuItem>,
                <MenuItem
                  key="register"
                  onClick={() => goTo("/register")}
                >
                  Get Started
                </MenuItem>,
              ]
            )}
          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  );
}