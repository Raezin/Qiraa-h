// src/components/UserDashboard/Mistakes.jsx — Light Mode
import { Box, Paper, Stack, Typography, Chip, Accordion, AccordionSummary, AccordionDetails, List, ListItem, ListItemText, ListItemIcon } from "@mui/material";
import { motion } from "framer-motion";
import ExpandMoreRoundedIcon       from "@mui/icons-material/ExpandMoreRounded";
import FiberManualRecordRoundedIcon from "@mui/icons-material/FiberManualRecordRounded";
import ErrorOutlineRoundedIcon     from "@mui/icons-material/ErrorOutlineRounded";

const G = { green:"#2d6a4f", greenPale:"#d8f3dc", greenBg:"#f0faf4", white:"#ffffff", text:"#1b1b1b", muted:"#6b7280", border:"#e5e7eb" };

const MISTAKES_DATA = [
  { id:1, surah:"Al-Fatiha — Ayat 3", date:"2025-03-20", count:2, mistakes:[
    { rule:"Ikhfa",  word:"مِنَ الرَّحِيم", desc:"Ghunna was not applied correctly." },
    { rule:"Madd",   word:"الرَّحِيم",      desc:"Madd duration was shorter than required." },
  ]},
  { id:2, surah:"Al-Ikhlas — Ayat 1", date:"2025-03-15", count:4, mistakes:[
    { rule:"Qalqalah", word:"أَحَد",  desc:"Qalqalah echo not clear on the letter د." },
    { rule:"Izhar",    word:"اللَّهُ", desc:"Harakat was skipped." },
    { rule:"Tafkheem", word:"اللَّهُ", desc:"Laam was not pronounced with tafkheem." },
    { rule:"Waqf",     word:"أَحَد",  desc:"Waqf applied incorrectly at end." },
  ]},
];

const severityColor = (c) => c <= 2 ? "success" : c <= 4 ? "warning" : "error";

export default function Mistakes() {
  return (
    <Box>
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}>
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb:0.5 }}>
          <ErrorOutlineRoundedIcon sx={{ color:"#dc2626" }} />
          <Typography variant="h5" fontWeight={800} sx={{ color:G.text }}>Mistakes & Tajweed Errors</Typography>
        </Stack>
        <Typography sx={{ color:G.muted, mb:3 }}>Detailed breakdown of detected errors from your recitation evaluations.</Typography>
      </motion.div>

      {MISTAKES_DATA.map((item, i) => (
        <motion.div key={item.id} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.1 }}>
          <Accordion defaultExpanded={i===0} elevation={0} sx={{
            mb:2, borderRadius:"12px !important", bgcolor:G.white,
            border:`1px solid ${G.border}`, "&:before":{ display:"none" },
          }}>
            <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />} sx={{ bgcolor:i===0 ? G.greenBg : G.white, borderRadius:"12px 12px 0 0" }}>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ flex:1, pr:2 }}>
                <Typography fontWeight={700} sx={{ color:G.text }}>{item.surah}</Typography>
                <Typography variant="caption" sx={{ color:G.muted }}>{item.date}</Typography>
                <Box sx={{ flex:1 }} />
                <Chip label={`${item.count} Mistake${item.count>1?"s":""}`} size="small" color={severityColor(item.count)} />
              </Stack>
            </AccordionSummary>
            <AccordionDetails sx={{ pt:0 }}>
              <List dense>
                {item.mistakes.map((m, j) => (
                  <ListItem key={j} sx={{ borderRadius:2, mb:0.5, bgcolor:"#f9fafb" }}>
                    <ListItemIcon sx={{ minWidth:28 }}>
                      <FiberManualRecordRoundedIcon sx={{ fontSize:10, color:G.green }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography variant="body2" fontWeight={700} sx={{ color:G.text }}>{m.rule}</Typography>
                          <Chip label={m.word} size="small" variant="outlined" sx={{ fontFamily:"serif", fontSize:"0.9rem", borderColor:G.green, color:G.green }} />
                        </Stack>
                      }
                      secondary={m.desc}
                      secondaryTypographyProps={{ color:G.muted, variant:"caption" }}
                    />
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        </motion.div>
      ))}
    </Box>
  );
}
