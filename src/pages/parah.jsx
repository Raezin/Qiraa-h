import React, { useState } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Button,
  IconButton,
  Divider,
  TextField,
  Stack,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NavLayout from "../layout/navlayout";

const drawerWidth = 260;

const surahs = [
  "Al-Fatihah",
  "Al-Baqarah",
  "Aal-e-Imran",
  "An-Nisa",
  "Al-Ma'idah",
  "Al-An'am",
];

export default function Parah() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const arabicTextStyle = {
    fontFamily: `"Scheherazade New", "Amiri", serif`,
  };

  const Sidebar = (
    <Box>
      <Typography variant="h6" p={2} fontWeight="bold">
        Surahs
      </Typography>
      <Divider />
      <List>
        {surahs.map((surah, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton
              sx={{
                py: 1.2,
                "&:hover": {
                  backgroundColor: "action.hover",
                },
              }}
              onClick={() => setDrawerOpen(false)}
            >
              <ListItemText primary={surah} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <NavLayout>
      <Box sx={{ display: "flex" }}>
        {/* Mobile Menu Button */}
        <IconButton
          onClick={() => setDrawerOpen(true)}
          sx={{ display: { md: "none" }, position: "fixed", top: 80, left: 16 }}
        >
          <MenuIcon />
        </IconButton>

        {/* Desktop Sidebar */}
        <Box
          sx={{
            width: drawerWidth,
            display: { xs: "none", md: "block" },
            borderRight: "1px solid",
            borderColor: "divider",
          }}
        >
          {Sidebar}
        </Box>

        {/* Mobile Drawer */}
        <Drawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": { width: drawerWidth },
          }}
        >
          {Sidebar}
        </Drawer>

        {/* Main Content */}
        <Box
          sx={{
            flexGrow: 1,
            p: { xs: 2, md: 4 },
            maxWidth: "1000px",
            mx: "auto",
          }}
        >
          {/* Surah Header */}
          <Typography variant="h3" textAlign={"center"} gutterBottom>
            Surah Al-Fatihah
          </Typography>

          <Typography
            variant="h3"
            textAlign="center"
            mb={3}
            sx={arabicTextStyle}
          >
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </Typography>

          {/* Ayat Display */}
          <Box
            sx={{
              backgroundColor: "background.paper",
              p: { xs: 2.5, md: 4 },
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "0 8px 30px rgba(0,0,0,0.04)",
              mb: 4,
            }}
          >
            <Typography
              textAlign="right"
              lineHeight={2.4}
              sx={{
                ...arabicTextStyle,
                fontSize: {
                  xs: "1.6rem",
                  sm: "2.2rem",
                  md: "2.8rem",
                },
              }}
            >
              الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ
            </Typography>

            <Typography
              color="text.secondary"
              textAlign="right"
              mt={2}
              fontSize="0.85rem"
            >
              Ayat 1
            </Typography>
          </Box>

          {/* Navigation */}
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              mb: 4,
            }}
          >
            <Stack direction="row" justifyContent="space-between">
              <Button variant="outlined">Previous</Button>
              <Stack direction="row" maxWidth={{xs: 120, md: 300}} spacing={2}>
            <TextField size="small" label="Go to Ayat" />
            <Button variant="contained">Go</Button>
          </Stack>
              <Button variant="outlined">Next</Button>
            </Stack>
          </Box>

          {/* Actions */}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={4}>
            <Button
              variant="contained"
              sx={{
                transition: "all .2s ease",
                "&:hover": {
                  transform: "translateY(-1px)",
                  boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
                },
              }}
            >
              Evaluate Recitation
            </Button>

            <Button
              variant="outlined"
              sx={{
                transition: "all .2s ease",
                "&:hover": {
                  transform: "translateY(-1px)",
                },
              }}
            >
              Pronunciation Help
            </Button>
          </Stack>

          {/* Evaluation Box */}
          <Box
            sx={{
              backgroundColor: "background.paper",
              p: { xs: 2.5, md: 4 },
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "0 8px 30px rgba(0,0,0,0.04)",
            }}
          >
            <Typography variant="h6" gutterBottom>
              Evaluation Result
            </Typography>
            <Typography color="text.secondary">
              Your recitation feedback will appear here after evaluation.
            </Typography>
          </Box>
        </Box>
      </Box>
    </NavLayout>
  );
}
