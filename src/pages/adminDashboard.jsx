// ============================================================
// src/pages/adminDashboard.jsx — Light Mode Restyled
// ============================================================

import { useState } from "react";
import { Navigate } from "react-router-dom";
import {
  Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText,
  Typography, Avatar, IconButton, useMediaQuery, useTheme, Stack,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import DashboardRoundedIcon      from "@mui/icons-material/DashboardRounded";
import PeopleRoundedIcon         from "@mui/icons-material/PeopleRounded";
import StarRoundedIcon           from "@mui/icons-material/StarRounded";
import CardMembershipRoundedIcon from "@mui/icons-material/CardMembershipRounded";
import MemoryRoundedIcon         from "@mui/icons-material/MemoryRounded";
import LogoutRoundedIcon         from "@mui/icons-material/LogoutRounded";
import MenuRoundedIcon           from "@mui/icons-material/MenuRounded";

import { useUser }         from "../utils/UserContext";
import { clearUserRecord } from "../utils/dataValidator";

import AdminHome          from "../components/AdminDashboard/AdminHome";
import UsersTable         from "../components/AdminDashboard/UsersTable";
import ReviewsTable       from "../components/AdminDashboard/ReviewsTable";
import SubscriptionsTable from "../components/AdminDashboard/SubscriptionsTable";
import AIUsage            from "../components/AdminDashboard/AIUsage";

const G = {
  green:     "#2d6a4f",
  greenLight:"#52b788",
  greenPale: "#d8f3dc",
  greenBg:   "#f0faf4",
  white:     "#ffffff",
  text:      "#1b1b1b",
  muted:     "#6b7280",
  border:    "#e5e7eb",
};

const DRAWER_WIDTH = 256;

const ADMIN_NAV = [
  { key: "home",          label: "Dashboard",     icon: <DashboardRoundedIcon /> },
  { key: "users",         label: "Users",          icon: <PeopleRoundedIcon /> },
  { key: "reviews",       label: "Reviews",        icon: <StarRoundedIcon /> },
  { key: "subscriptions", label: "Subscriptions",  icon: <CardMembershipRoundedIcon /> },
  { key: "ai",            label: "AI Usage",       icon: <MemoryRoundedIcon /> },
];

const SECTION_MAP = {
  home:          <AdminHome />,
  users:         <UsersTable />,
  reviews:       <ReviewsTable />,
  subscriptions: <SubscriptionsTable />,
  ai:            <AIUsage />,
};

export default function AdminDashboard() {
  const { userData, removeUser } = useUser();
  const [active, setActive]         = useState("home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme    = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  if (!userData) return <Navigate to="/login" replace />;
  if (userData?.role !== "admin") return <Navigate to="/user-dashboard" replace />;

  const handleLogout = () => clearUserRecord(removeUser);
  const activeItem   = ADMIN_NAV.find(n => n.key === active);

  const drawerContent = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Brand */}
      <Box sx={{ px: 3, py: 3, borderBottom: `1px solid ${G.border}` }}>
        <Typography variant="h6" fontWeight={800} sx={{ color: G.green, letterSpacing: -0.5 }}>
          Qiraa-h
        </Typography>
        <Typography variant="caption" sx={{ color: G.muted }}>Admin Panel</Typography>
      </Box>

      {/* Admin info */}
      <Box sx={{ px: 3, py: 2.5, borderBottom: `1px solid ${G.border}` }}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Avatar sx={{ bgcolor: "#1e40af", width: 38, height: 38, fontSize: "0.85rem", fontWeight: 700 }}>
            {userData?.fullname?.[0]?.toUpperCase() || "A"}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" fontWeight={700} noWrap sx={{ color: G.text }}>
              {userData?.fullname || "Admin"}
            </Typography>
            <Typography variant="caption" sx={{ color: "#1e40af" }} noWrap>
              Administrator
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* Nav */}
      <List sx={{ flex: 1, px: 2, py: 2 }}>
        {ADMIN_NAV.map((item) => (
          <ListItemButton
            key={item.key}
            selected={active === item.key}
            onClick={() => { setActive(item.key); setMobileOpen(false); }}
            sx={{
              borderRadius: 2.5, mb: 0.5, px: 2, py: 1,
              color: G.muted,
              "&.Mui-selected": {
                bgcolor: G.greenPale, color: G.green,
                "& .MuiListItemIcon-root": { color: G.green },
                "&:hover": { bgcolor: G.greenPale },
              },
              "&:hover": { bgcolor: G.greenBg, color: G.green },
            }}
          >
            <ListItemIcon sx={{ minWidth: 36, color: "inherit" }}>{item.icon}</ListItemIcon>
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{ fontSize: "0.865rem", fontWeight: active === item.key ? 700 : 500 }}
            />
            {active === item.key && (
              <Box sx={{ width: 4, height: 20, borderRadius: 2, bgcolor: G.green }} />
            )}
          </ListItemButton>
        ))}
      </List>

      {/* Logout */}
      <Box sx={{ px: 2, pb: 3, borderTop: `1px solid ${G.border}`, pt: 2 }}>
        <ListItemButton onClick={handleLogout} sx={{
          borderRadius: 2.5, color: "#dc2626",
          "&:hover": { bgcolor: "#fef2f2" },
        }}>
          <ListItemIcon sx={{ minWidth: 36, color: "#dc2626" }}><LogoutRoundedIcon /></ListItemIcon>
          <ListItemText primary="Logout" primaryTypographyProps={{ fontSize: "0.865rem", fontWeight: 600 }} />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: G.greenBg }}>
      {!isMobile && (
        <Drawer variant="permanent" sx={{
          width: DRAWER_WIDTH, flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH, boxSizing: "border-box",
            bgcolor: G.white, borderRight: `1px solid ${G.border}`,
          },
        }}>
          {drawerContent}
        </Drawer>
      )}

      {isMobile && (
        <Drawer variant="temporary" open={mobileOpen} onClose={() => setMobileOpen(false)}
          sx={{ "& .MuiDrawer-paper": { width: DRAWER_WIDTH, bgcolor: G.white } }}>
          {drawerContent}
        </Drawer>
      )}

      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <Box sx={{
          px: { xs: 2, md: 4 }, py: 2,
          bgcolor: G.white, borderBottom: `1px solid ${G.border}`,
          display: "flex", alignItems: "center", gap: 2,
        }}>
          {isMobile && (
            <IconButton onClick={() => setMobileOpen(true)} size="small">
              <MenuRoundedIcon />
            </IconButton>
          )}
          <Box>
            <Typography variant="h6" fontWeight={700} sx={{ color: G.text }}>
              {activeItem?.label}
            </Typography>
            <Typography variant="caption" sx={{ color: G.muted }}>
              Admin — Qiraa-h Platform
            </Typography>
          </Box>
        </Box>

        <Box sx={{ flex: 1, p: { xs: 2, md: 4 }, overflowY: "auto" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.28 }}
            >
              {SECTION_MAP[active]}
            </motion.div>
          </AnimatePresence>
        </Box>
      </Box>
    </Box>
  );
}
