// src/components/UserDashboard/EvaluationHistory.jsx — Light Mode
import { Box, Paper, Stack, Typography, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Tooltip } from "@mui/material";
import { motion } from "framer-motion";
import PlayCircleRoundedIcon from "@mui/icons-material/PlayCircleRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";

const G = { green:"#2d6a4f", greenLight:"#52b788", greenPale:"#d8f3dc", white:"#ffffff", text:"#1b1b1b", muted:"#6b7280", border:"#e5e7eb" };

const HISTORY = [
  { id:1, surah:"Al-Fatiha",  ayat:1, date:"2025-03-20", score:94, mistakes:1,  status:"Excellent" },
  { id:2, surah:"Al-Fatiha",  ayat:3, date:"2025-03-18", score:78, mistakes:5,  status:"Good" },
  { id:3, surah:"Al-Ikhlas",  ayat:1, date:"2025-03-15", score:61, mistakes:9,  status:"Needs Work" },
  { id:4, surah:"Al-Baqarah", ayat:1, date:"2025-03-10", score:85, mistakes:3,  status:"Good" },
];

const statusColor = (s) => s === "Excellent" ? "success" : s === "Good" ? "primary" : "warning";
const scoreColor  = (n) => n >= 90 ? "#16a34a" : n >= 70 ? "#d97706" : "#dc2626";

export default function EvaluationHistory() {
  return (
    <Box>
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}>
        <Typography variant="h5" fontWeight={800} sx={{ color:G.text, mb:0.5 }}>Evaluation History</Typography>
        <Typography sx={{ color:G.muted, mb:3 }}>Review all your past recitation evaluations and scores.</Typography>
      </motion.div>
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}>
        <TableContainer component={Paper} elevation={0} sx={{ borderRadius:3, bgcolor:G.white, border:`1px solid ${G.border}` }}>
          <Table>
            <TableHead>
              <TableRow sx={{ "& th":{ borderColor:G.border, fontWeight:700, color:G.muted, bgcolor:"#f9fafb" } }}>
                <TableCell>#</TableCell><TableCell>Surah</TableCell><TableCell>Ayat</TableCell>
                <TableCell>Date</TableCell><TableCell>Score</TableCell><TableCell>Mistakes</TableCell>
                <TableCell>Status</TableCell><TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {HISTORY.map((row, i) => (
                <motion.tr key={row.id} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:i*0.07 }} component="tr">
                  <TableCell sx={{ borderColor:G.border, color:G.muted }}>{row.id}</TableCell>
                  <TableCell sx={{ borderColor:G.border, fontWeight:600, color:G.text }}>{row.surah}</TableCell>
                  <TableCell sx={{ borderColor:G.border, color:G.muted }}>{row.ayat}</TableCell>
                  <TableCell sx={{ borderColor:G.border, color:G.muted }}>{row.date}</TableCell>
                  <TableCell sx={{ borderColor:G.border }}><Typography fontWeight={800} sx={{ color:scoreColor(row.score) }}>{row.score}%</Typography></TableCell>
                  <TableCell sx={{ borderColor:G.border, color:G.text }}>{row.mistakes}</TableCell>
                  <TableCell sx={{ borderColor:G.border }}><Chip label={row.status} size="small" color={statusColor(row.status)} /></TableCell>
                  <TableCell sx={{ borderColor:G.border }} align="right">
                    <Tooltip title="Play Audio"><IconButton size="small" sx={{ color:G.green }}><PlayCircleRoundedIcon /></IconButton></Tooltip>
                    <Tooltip title="View Mistakes"><IconButton size="small" sx={{ color:"#d97706" }}><VisibilityRoundedIcon /></IconButton></Tooltip>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </motion.div>
    </Box>
  );
}
