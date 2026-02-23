import { Box, Typography, Container, Stack } from "@mui/material";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: "auto",
        py: 2,
        backgroundColor: "rgba(14,14,16,0.95)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          justifyContent="center"
          alignItems="center"
        >
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", fontSize: 13 }}
          >
            © {new Date().getFullYear()} Qiraa&apos;H. All rights reserved.
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
