// src/components/AdminDashboard/AdminHome.jsx — Light Mode
import { Box, Grid, Paper, Stack, Typography } from "@mui/material";
import { motion } from "framer-motion";
import PeopleRoundedIcon         from "@mui/icons-material/PeopleRounded";
import MicRoundedIcon            from "@mui/icons-material/MicRounded";
import CardMembershipRoundedIcon from "@mui/icons-material/CardMembershipRounded";
import MemoryRoundedIcon         from "@mui/icons-material/MemoryRounded";

const G = { green:"#2d6a4f", greenLight:"#52b788", greenPale:"#d8f3dc", greenBg:"#f0faf4", white:"#ffffff", text:"#1b1b1b", muted:"#6b7280", border:"#e5e7eb" };

const STATS = [
  { icon:<PeopleRoundedIcon />,            label:"Total Users",          value:"1,248",  color:"#2d6a4f", delay:0 },
  { icon:<MicRoundedIcon />,               label:"Total Evaluations",    value:"18,320", color:"#16a34a", delay:0.08 },
  { icon:<CardMembershipRoundedIcon />,    label:"Active Subscriptions", value:"342",    color:"#d97706", delay:0.16 },
  { icon:<MemoryRoundedIcon />,            label:"AI Model Calls",       value:"52,100", color:"#7c3aed", delay:0.24 },
];

export default function AdminHome() {
  return (
    <Box>
      <motion.div initial={{ opacity:0, y:-12 }} animate={{ opacity:1, y:0 }}>
        <Typography variant="h5" fontWeight={800} sx={{ color:G.text, mb:0.5 }}>Admin Overview</Typography>
        <Typography sx={{ color:G.muted, mb:3 }}>Platform-wide metrics and usage summary.</Typography>
      </motion.div>

      <Grid container spacing={2.5} sx={{ mb:4 }}>
        {STATS.map((s, i) => (
          <Grid key={i} item xs={12} sm={6} md={3}>
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:s.delay }}>
              <Paper elevation={0} sx={{
                p:3, borderRadius:3, bgcolor:G.white, border:`1px solid ${G.border}`,
                transition:"all 0.25s", "&:hover":{ boxShadow:"0 8px 24px rgba(45,106,79,0.1)", transform:"translateY(-3px)" },
              }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Box sx={{ width:48, height:48, borderRadius:2, bgcolor:`${s.color}18`, display:"flex", alignItems:"center", justifyContent:"center", color:s.color }}>
                    {s.icon}
                  </Box>
                  <Box>
                    <Typography variant="h5" fontWeight={800} sx={{ color:G.text }}>{s.value}</Typography>
                    <Typography variant="caption" sx={{ color:G.muted }}>{s.label}</Typography>
                  </Box>
                </Stack>
              </Paper>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}>
        <Paper elevation={0} sx={{ p:3, borderRadius:3, bgcolor:G.white, border:`1px solid ${G.border}` }}>
          <Typography variant="subtitle1" fontWeight={700} sx={{ color:G.text, mb:2 }}>Recent Activity</Typography>
          {["New user signup: ahmed@example.com","Evaluation completed: Surah Al-Fatiha","Subscription purchased: Pro Plan","Review submitted: ★★★★★"].map((a, i) => (
            <Stack key={i} direction="row" spacing={1.5} alignItems="center" sx={{ py:1.5, borderBottom: i<3 ? `1px solid ${G.border}` : "none" }}>
              <Box sx={{ width:7, height:7, borderRadius:"50%", bgcolor:G.green, flexShrink:0 }} />
              <Typography variant="body2" sx={{ color:G.muted }}>{a}</Typography>
            </Stack>
          ))}
        </Paper>
      </motion.div>
    </Box>
  );
}
