// src/components/AdminDashboard/AIUsage.jsx — Light Mode
import { Box, Paper, Stack, Typography, Grid, LinearProgress, Chip } from "@mui/material";
import { motion } from "framer-motion";
import MemoryRoundedIcon    from "@mui/icons-material/MemoryRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";

const G = { green:"#2d6a4f", greenLight:"#52b788", greenPale:"#d8f3dc", greenBg:"#f0faf4", white:"#ffffff", text:"#1b1b1b", muted:"#6b7280", border:"#e5e7eb" };

const DAILY = [
  { day:"Mon", calls:320 },{ day:"Tue", calls:480 },{ day:"Wed", calls:290 },
  { day:"Thu", calls:610 },{ day:"Fri", calls:540 },{ day:"Sat", calls:180 },{ day:"Sun", calls:120 },
];
const MAX_CALLS = 700;

const MODELS = [
  { model:"Whisper (STT)",     calls:18320, cost:"PKR 12,400", usage:72 },
  { model:"Custom Tajweed AI", calls:18320, cost:"PKR 9,800",  usage:65 },
  { model:"TTS Engine",        calls:5400,  cost:"PKR 3,200",  usage:30 },
];

export default function AIUsage() {
  const totalCalls = DAILY.reduce((s,d) => s+d.calls, 0);

  return (
    <Box>
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}>
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb:0.5 }}>
          <MemoryRoundedIcon sx={{ color:G.green }} />
          <Typography variant="h5" fontWeight={800} sx={{ color:G.text }}>AI Model Usage</Typography>
        </Stack>
        <Typography sx={{ color:G.muted, mb:3 }}>Monitor AI model calls, performance, and estimated costs.</Typography>
      </motion.div>

      {/* Summary */}
      <Grid container spacing={2.5} sx={{ mb:4 }}>
        {[
          { label:"Total Calls This Week", value:totalCalls.toLocaleString(), color:G.green,   bg:G.greenBg,   border:G.greenPale },
          { label:"Avg Daily Calls",        value:Math.round(totalCalls/7).toLocaleString(), color:"#16a34a", bg:"#f0fdf4", border:"#bbf7d0" },
          { label:"Estimated Weekly Cost",  value:"PKR 25,400",              color:"#d97706", bg:"#fffbeb", border:"#fde68a" },
        ].map((s, i) => (
          <Grid key={i} item xs={12} sm={4}>
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.1 }}>
              <Paper elevation={0} sx={{ p:3, borderRadius:3, bgcolor:s.bg, border:`1px solid ${s.border}` }}>
                <Typography variant="h5" fontWeight={800} sx={{ color:s.color }}>{s.value}</Typography>
                <Typography variant="caption" sx={{ color:G.muted }}>{s.label}</Typography>
              </Paper>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Bar chart */}
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}>
        <Paper elevation={0} sx={{ p:3, mb:4, borderRadius:3, bgcolor:G.white, border:`1px solid ${G.border}` }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb:3 }}>
            <TrendingUpRoundedIcon fontSize="small" sx={{ color:G.green }} />
            <Typography variant="subtitle1" fontWeight={700} sx={{ color:G.text }}>Daily API Calls (This Week)</Typography>
          </Stack>
          <Stack direction="row" alignItems="flex-end" spacing={1.5} sx={{ height:120 }}>
            {DAILY.map((d, i) => (
              <motion.div key={d.day} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}
                initial={{ scaleY:0, originY:1 }} animate={{ scaleY:1 }} transition={{ delay:0.3+i*0.07, duration:0.4 }}>
                <Typography variant="caption" fontWeight={700} sx={{ color:G.green }}>{d.calls}</Typography>
                <Box sx={{
                  width:"100%", height:`${(d.calls/MAX_CALLS)*90}px`,
                  bgcolor:G.green, borderRadius:"4px 4px 0 0", minHeight:4,
                }} />
                <Typography variant="caption" sx={{ color:G.muted }}>{d.day}</Typography>
              </motion.div>
            ))}
          </Stack>
        </Paper>
      </motion.div>

      {/* Model breakdown */}
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4 }}>
        <Paper elevation={0} sx={{ p:3, borderRadius:3, bgcolor:G.white, border:`1px solid ${G.border}` }}>
          <Typography variant="subtitle1" fontWeight={700} sx={{ color:G.text, mb:3 }}>Model Breakdown</Typography>
          {MODELS.map((m, i) => (
            <Box key={m.model} sx={{ mb:i<MODELS.length-1?3:0 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb:0.75 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="body2" fontWeight={700} sx={{ color:G.text }}>{m.model}</Typography>
                  <Chip label={`${m.calls.toLocaleString()} calls`} size="small" variant="outlined" sx={{ borderColor:G.border, color:G.muted }} />
                </Stack>
                <Typography variant="body2" fontWeight={600} sx={{ color:G.green }}>{m.cost}</Typography>
              </Stack>
              <LinearProgress variant="determinate" value={m.usage} sx={{
                height:8, borderRadius:2,
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
