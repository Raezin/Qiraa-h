// src/components/AdminDashboard/UsersTable.jsx — Light Mode
import { Box, Paper, Stack, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Avatar, TextField, InputAdornment } from "@mui/material";
import { useState } from "react";
import { motion } from "framer-motion";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";

const G = { green:"#2d6a4f", greenPale:"#d8f3dc", greenBg:"#f0faf4", white:"#ffffff", text:"#1b1b1b", muted:"#6b7280", border:"#e5e7eb" };

const USERS = [
  { id:1, name:"Ahmed Raza",      email:"ahmed@email.com",  plan:"Pro",   evals:42, status:"Active",   joined:"2025-01-10" },
  { id:2, name:"Sara Khan",       email:"sara@email.com",   plan:"Basic", evals:18, status:"Active",   joined:"2025-02-03" },
  { id:3, name:"Bilal Hussain",   email:"bilal@email.com",  plan:"Free",  evals:5,  status:"Inactive", joined:"2025-02-18" },
  { id:4, name:"Ayesha Malik",    email:"ayesha@email.com", plan:"Pro",   evals:67, status:"Active",   joined:"2025-03-01" },
  { id:5, name:"Usman Siddiqui", email:"usman@email.com",  plan:"Free",  evals:2,  status:"Active",   joined:"2025-03-14" },
];

const planColor   = (p) => p==="Pro"?"secondary":p==="Basic"?"primary":"default";
const statusColor = (s) => s==="Active"?"success":"error";
const planBg      = (p) => p==="Pro"?"#ede9fe":p==="Basic"?G.greenPale:"#f3f4f6";
const planTxt     = (p) => p==="Pro"?"#7c3aed":p==="Basic"?G.green:"#6b7280";

export default function UsersTable() {
  const [search, setSearch] = useState("");
  const filtered = USERS.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <Box>
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}>
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb:0.5 }}>
          <PeopleRoundedIcon sx={{ color:G.green }} />
          <Typography variant="h5" fontWeight={800} sx={{ color:G.text }}>All Users</Typography>
        </Stack>
        <Typography sx={{ color:G.muted, mb:3 }}>Manage and monitor all registered users on the platform.</Typography>
      </motion.div>

      <TextField size="small" placeholder="Search by name or email..."
        value={search} onChange={(e) => setSearch(e.target.value)}
        sx={{ mb:2, width:{ xs:"100%", sm:320 } }}
        InputProps={{ startAdornment:<InputAdornment position="start"><SearchRoundedIcon fontSize="small" /></InputAdornment> }} />

      <TableContainer component={Paper} elevation={0} sx={{ borderRadius:3, bgcolor:G.white, border:`1px solid ${G.border}` }}>
        <Table>
          <TableHead>
            <TableRow sx={{ "& th":{ borderColor:G.border, fontWeight:700, color:G.muted, bgcolor:"#f9fafb" } }}>
              <TableCell>User</TableCell><TableCell>Email</TableCell><TableCell>Plan</TableCell>
              <TableCell>Evaluations</TableCell><TableCell>Status</TableCell><TableCell>Joined</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((row, i) => (
              <motion.tr key={row.id} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:i*0.05 }} component="tr">
                <TableCell sx={{ borderColor:G.border }}>
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Avatar sx={{ width:32, height:32, fontSize:"0.8rem", bgcolor:G.green, fontWeight:700 }}>{row.name[0]}</Avatar>
                    <Typography variant="body2" fontWeight={700} sx={{ color:G.text }}>{row.name}</Typography>
                  </Stack>
                </TableCell>
                <TableCell sx={{ borderColor:G.border, color:G.muted }}>{row.email}</TableCell>
                <TableCell sx={{ borderColor:G.border }}>
                  <Box sx={{ display:"inline-block", px:1.5, py:0.25, borderRadius:20, bgcolor:planBg(row.plan) }}>
                    <Typography variant="caption" fontWeight={700} sx={{ color:planTxt(row.plan) }}>{row.plan}</Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{ borderColor:G.border, color:G.text, fontWeight:600 }}>{row.evals}</TableCell>
                <TableCell sx={{ borderColor:G.border }}>
                  <Chip label={row.status} size="small" color={statusColor(row.status)} />
                </TableCell>
                <TableCell sx={{ borderColor:G.border, color:G.muted }}>{row.joined}</TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
