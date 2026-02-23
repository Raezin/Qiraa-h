import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
  IconButton,
  Avatar,
  Drawer,
  Stack,
  useTheme,
  useMediaQuery,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import { useUser } from "../utils/UserContext"; // <-- add this
import logo from "../assets/qiraa-h.png";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Quran", path: "/parah" },
  { label: "Packages", path: "/subscription" },
  { label: "About Us", path: "/aboutus" },
];

export default function Navbar() {
  const theme = useTheme();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const { userData } = useUser(); // <-- get user
  const hasUser =
    userData &&
    userData.userId &&
    userData.name &&
    userData.email &&
    userData.role;

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: "rgba(14,14,16,0.92)",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", minHeight: 72 }}>
          {/* Brand */}
          <Stack direction="row" spacing={1.5} alignItems="center">
            <img src={logo} alt="Qiraa'H" width={44} />
            <Typography
              variant="h3"
              component={NavLink}
              to="/"
              sx={{
                textDecoration: "none",
                color: theme.palette.text.primary,
                letterSpacing: 0.5,
              }}
            >
              Qiraa'H
            </Typography>
          </Stack>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Stack direction="row" spacing={5} alignItems="center">
              {navItems.map((item) => {
                const active = isActive(item.path);

                return (
                  <Box
                    key={item.path}
                    sx={{
                      position: "relative",
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        left: "50%",
                        bottom: -6,
                        width: active ? "100%" : "0%",
                        height: "2px",
                        backgroundColor: theme.palette.primary.main,
                        transform: "translateX(-50%)",
                        transition: "width 0.3s ease",
                        borderRadius: 2,
                      },
                      "&:hover::after": {
                        width: "100%",
                      },
                    }}
                  >
                    <Typography
                      component={NavLink}
                      to={item.path}
                      sx={{
                        textDecoration: "none",
                        fontSize: 15,
                        fontWeight: 500,
                        color: active
                          ? theme.palette.primary.main
                          : theme.palette.text.secondary,
                        transition: "color 0.25s ease",
                        "&:hover": {
                          color: theme.palette.text.primary,
                        },
                      }}
                    >
                      {item.label}
                    </Typography>
                  </Box>
                );
              })}

              {/* Login / User Button */}
              <Button
                variant="contained"
                component={NavLink}
                to={hasUser ? "/profile" : "/login"}
                sx={{
                  px: 2.5,
                  py: 0.9,
                  borderRadius: 9,
                  backgroundColor: "rgba(124,124,255,0.9)",
                  color: "#fff",
                  boxShadow: "none",
                  minHeight: 40,
                  "&:hover": {
                    backgroundColor: "rgba(124,124,255,1)",
                    boxShadow: "none",
                  },
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  {hasUser ? (
                    <Avatar sx={{ width: 24, height: 24 }}>
                      {userData.name?.charAt(0).toUpperCase()}
                    </Avatar>
                  ) : (
                    <LoginRoundedIcon sx={{ fontSize: 18 }} />
                  )}

                  <Typography fontSize={14} fontWeight={500}>
                    {hasUser ? userData.name : "Log In"}
                  </Typography>
                </Stack>
              </Button>
            </Stack>
          )}

          {/* Mobile Menu */}
          {isMobile && (
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            mt: 1,
            width: 220,
            backgroundColor: theme.palette.background.paper,
            borderRadius: 2,
            boxShadow: "0 12px 30px rgba(0,0,0,0.4)",
            overflow: "hidden",
          },
        }}
      >
        {navItems.map((item) => {
          const active = isActive(item.path);

          return (
            <MenuItem
              key={item.path}
              component={NavLink}
              to={item.path}
              onClick={() => setAnchorEl(null)}
              sx={{
                height: 42,
                fontSize: 14,
                fontWeight: 500,
                color: active
                  ? theme.palette.primary.main
                  : theme.palette.text.primary,
                backgroundColor: active
                  ? "rgba(124,124,255,0.10)"
                  : "transparent",
              }}
            >
              {item.label}
            </MenuItem>
          );
        })}

        {/* Divider */}
        <Box
          sx={{ height: 1, mx: 1.5, backgroundColor: "rgba(255,255,255,0.08)" }}
        />

        {/* Login / User */}
        <MenuItem
          component={NavLink}
          to={hasUser ? "/profile" : "/login"}
          onClick={() => setAnchorEl(null)}
          sx={{
            height: 42,
            fontWeight: 500,
            color: theme.palette.primary.main,
          }}
        >
          {hasUser ? userData.name : "Log In"}
        </MenuItem>
      </Menu>
    </>
  );
}
