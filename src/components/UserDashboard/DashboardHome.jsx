// src/components/UserDashboard/DashboardHome.jsx — Light Mode
import { Box, Grid, Paper, Stack, Typography, Button, LinearProgress } from "@mui/material";
import { motion } from "framer-motion";
import MicRoundedIcon           from "@mui/icons-material/MicRounded";
import CheckCircleRoundedIcon   from "@mui/icons-material/CheckCircleRounded";
import ErrorOutlineRoundedIcon  from "@mui/icons-material/ErrorOutlineRounded";
import TrendingUpRoundedIcon    from "@mui/icons-material/TrendingUpRounded";
import { useUser } from "../../utils/UserContext";

const G = { green:"#2d6a4f", greenLight:"#52b788", greenPale:"#d8f3dc", greenBg:"#f0faf4", white:"#ffffff", text:"#1b1b1b", muted:"#6b7280", border:"#e5e7eb" };

const StatCard = ({ icon, label, value, color, delay }) => (
  <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5, delay }}>
    <Paper elevation={0} sx={{
      p:3, borderRadius:3, bgcolor:G.white, border:`1px solid ${G.border}`,
      transition:"all 0.25s", "&:hover":{ boxShadow:"0 8px 24px rgba(45,106,79,0.1)", transform:"translateY(-3px)" },
    }}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Box sx={{ width:48, height:48, borderRadius:2, bgcolor:`${color}18`, display:"flex", alignItems:"center", justifyContent:"center", color }}>
          {icon}
        </Box>
        <Box>
          <Typography variant="h5" fontWeight={800} sx={{ color:G.text }}>{value}</Typography>
          <Typography variant="caption" sx={{ color:G.muted }}>{label}</Typography>
        </Box>
      </Stack>
    </Paper>
  </motion.div>
);

const STATS = [
  { icon:<MicRoundedIcon />,           label:"Total Recitations",  value:"24",  color:"#2d6a4f", delay:0 },
  { icon:<CheckCircleRoundedIcon />,   label:"Evaluations Done",   value:"18",  color:"#16a34a", delay:0.08 },
  { icon:<ErrorOutlineRoundedIcon />,  label:"Mistakes Flagged",   value:"37",  color:"#dc2626", delay:0.16 },
  { icon:<TrendingUpRoundedIcon />,    label:"Accuracy Score",     value:"82%", color:"#d97706", delay:0.24 },
];

export default function DashboardHome() {
  const { userData } = useUser();
  return (
    <Box>
      {/* Welcome */}
      <motion.div initial={{ opacity:0, y:-12 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }}>
        <Paper elevation={0} sx={{
          p:{ xs:3, md:4 }, mb:4, borderRadius:3,
          background:`linear-gradient(135deg, ${G.greenBg} 0%, #e6f7ec 100%)`,
          border:`1px solid ${G.greenPale}`,
          position:"relative", overflow:"hidden",
        }}>
          <Box sx={{ position:"absolute", top:-60, right:-60, width:200, height:200, borderRadius:"50%", bgcolor:G.greenPale, opacity:0.5 }} />
          <Typography variant="h4" fontWeight={800} sx={{ color:G.text, mb:1 }}>
            Assalam-o-Alaikum, {userData?.fullname?.split(" ")[0] || "Reciter"} 👋
          </Typography>
          <Typography sx={{ color:G.muted, mb:3 }}>
            Continue your Quran recitation journey. Your progress looks great!
          </Typography>
          <Stack direction={{ xs:"column", sm:"row" }} spacing={2}>
            <Button variant="contained" size="large" startIcon={<MicRoundedIcon />}
              sx={{ bgcolor:G.green, "&:hover":{ bgcolor:G.greenLight }, borderRadius:2, px:3, fontWeight:700 }}>
              Start Recording
            </Button>
            <Button variant="outlined" size="large"
              sx={{ borderColor:G.green, color:G.green, "&:hover":{ bgcolor:G.greenPale }, borderRadius:2, px:3 }}>
              View History
            </Button>
          </Stack>
        </Paper>
      </motion.div>

      {/* Stats */}
      <Grid container spacing={2.5} sx={{ mb:4 }}>
        {STATS.map((s, i) => (
          <Grid key={i} item xs={12} sm={6} md={3}><StatCard {...s} /></Grid>
        ))}
      </Grid>

      {/* Progress */}
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}>
        <Paper elevation={0} sx={{ p:3, borderRadius:3, bgcolor:G.white, border:`1px solid ${G.border}` }}>
          <Typography variant="h6" fontWeight={700} sx={{ color:G.text, mb:3 }}>
            Recitation Progress by Surah
          </Typography>
          {[{ surah:"Al-Fatiha", pct:95 }, { surah:"Al-Baqarah", pct:42 }, { surah:"Al-Imran", pct:18 }].map(({ surah, pct }) => (
            <Box key={surah} sx={{ mb:2.5 }}>
              <Stack direction="row" justifyContent="space-between" sx={{ mb:0.75 }}>
                <Typography variant="body2" fontWeight={600} sx={{ color:G.text }}>{surah}</Typography>
                <Typography variant="body2" fontWeight={700} sx={{ color:G.green }}>{pct}%</Typography>
              </Stack>
              <LinearProgress variant="determinate" value={pct} sx={{
                borderRadius:2, height:8,
                bgcolor:G.greenPale,
                "& .MuiLinearProgress-bar":{ borderRadius:2, bgcolor:G.green },
              }} />
            </Box>
          ))}
        </Paper>
      </motion.div>
    </Box>
  );
}
