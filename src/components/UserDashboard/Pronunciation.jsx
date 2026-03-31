// src/components/UserDashboard/Pronunciation.jsx — Light Mode
import { useState } from "react";
import { Box, Paper, Stack, Typography, Button, Select, MenuItem, FormControl, InputLabel, Chip, Alert, CircularProgress, Divider } from "@mui/material";
import { motion } from "framer-motion";
import VolumeUpRoundedIcon        from "@mui/icons-material/VolumeUpRounded";
import HelpRoundedIcon            from "@mui/icons-material/HelpRounded";
import RecordVoiceOverRoundedIcon from "@mui/icons-material/RecordVoiceOverRounded";

const G = { green:"#2d6a4f", greenLight:"#52b788", greenPale:"#d8f3dc", greenBg:"#f0faf4", white:"#ffffff", text:"#1b1b1b", muted:"#6b7280", border:"#e5e7eb" };

const TAJWEED_RULES = [
  { id:"ikhfa",    label:"Ikhfa",    desc:"Hidden pronunciation of noon/tanween before specific letters." },
  { id:"idgham",   label:"Idgham",   desc:"Merging of noon/tanween with following letters." },
  { id:"qalqalah", label:"Qalqalah", desc:"Echo/bouncing sound on letters ق ط ب ج د." },
  { id:"madd",     label:"Madd",     desc:"Elongation of vowel sounds to specific counts." },
  { id:"tafkheem", label:"Tafkheem", desc:"Heavy/thick pronunciation of certain letters." },
  { id:"tarqeeq",  label:"Tarqeeq",  desc:"Light/thin pronunciation of certain letters." },
];

const RECITERS = [
  { id:"mishary", name:"Mishary Rashid Al-Afasy" },
  { id:"sudais",  name:"Abdul Rahman Al-Sudais" },
  { id:"husary",  name:"Mahmoud Khalil Al-Husary" },
];

export default function Pronunciation() {
  const [selectedRule,    setSelectedRule]    = useState("");
  const [selectedReciter, setSelectedReciter] = useState("");
  const [loading,         setLoading]         = useState(false);
  const [audioReady,      setAudioReady]      = useState(false);

  const ruleObj = TAJWEED_RULES.find(r => r.id === selectedRule);

  const handleFetch = async () => {
    if (!selectedRule || !selectedReciter) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false); setAudioReady(true);
  };

  return (
    <Box>
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}>
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb:0.5 }}>
          <RecordVoiceOverRoundedIcon sx={{ color:G.green }} />
          <Typography variant="h5" fontWeight={800} sx={{ color:G.text }}>Pronunciation Help</Typography>
        </Stack>
        <Typography sx={{ color:G.muted, mb:3 }}>Select a Tajweed rule to understand it and listen to correct pronunciation.</Typography>
      </motion.div>

      {/* Rule chips */}
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}>
        <Box sx={{ display:"flex", flexWrap:"wrap", gap:1.5, mb:3 }}>
          {TAJWEED_RULES.map(rule => (
            <Chip key={rule.id} label={rule.label} onClick={() => { setSelectedRule(rule.id); setAudioReady(false); }}
              sx={{
                cursor:"pointer",
                bgcolor: selectedRule === rule.id ? G.green : G.white,
                color:   selectedRule === rule.id ? "#fff" : G.text,
                border:  `1px solid ${selectedRule === rule.id ? G.green : G.border}`,
                fontWeight: selectedRule === rule.id ? 700 : 500,
                "&:hover":{ bgcolor: selectedRule === rule.id ? G.green : G.greenPale },
              }} />
          ))}
        </Box>
      </motion.div>

      {/* Rule description */}
      {ruleObj && (
        <motion.div initial={{ opacity:0, scale:0.97 }} animate={{ opacity:1, scale:1 }}>
          <Paper elevation={0} sx={{ p:3, mb:3, borderRadius:3, bgcolor:G.greenBg, border:`1px solid ${G.greenPale}` }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb:1 }}>
              <HelpRoundedIcon fontSize="small" sx={{ color:G.green }} />
              <Typography variant="subtitle1" fontWeight={700} sx={{ color:G.green }}>{ruleObj.label}</Typography>
            </Stack>
            <Typography sx={{ color:G.muted }}>{ruleObj.desc}</Typography>
          </Paper>
        </motion.div>
      )}

      {/* Audio loader */}
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}>
        <Paper elevation={0} sx={{ p:3, borderRadius:3, bgcolor:G.white, border:`1px solid ${G.border}` }}>
          <Typography variant="subtitle1" fontWeight={700} sx={{ color:G.text, mb:2 }}>Listen to Correct Pronunciation</Typography>
          <Divider sx={{ borderColor:G.border, mb:2 }} />
          <Stack direction={{ xs:"column", sm:"row" }} spacing={2} sx={{ mb:2 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Reciter</InputLabel>
              <Select value={selectedReciter} label="Reciter" onChange={(e) => { setSelectedReciter(e.target.value); setAudioReady(false); }}>
                {RECITERS.map(r => <MenuItem key={r.id} value={r.id}>{r.name}</MenuItem>)}
              </Select>
            </FormControl>
            <Button variant="contained" startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <VolumeUpRoundedIcon />}
              onClick={handleFetch} disabled={!selectedRule || !selectedReciter || loading}
              sx={{ bgcolor:G.green, "&:hover":{ bgcolor:G.greenLight }, borderRadius:2, whiteSpace:"nowrap", px:3 }}>
              {loading ? "Loading..." : "Load Audio"}
            </Button>
          </Stack>
          {audioReady && (
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}>
              <Alert severity="success" sx={{ borderRadius:2, mb:2 }}>Audio loaded! Press play to listen.</Alert>
              <Box component="audio" controls sx={{ width:"100%" }} />
            </motion.div>
          )}
        </Paper>
      </motion.div>
    </Box>
  );
}
