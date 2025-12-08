import { Box, Typography } from "@mui/material";

export default function EmptyCurrentPair() {
  return (
    <Box sx={{ textAlign: "center", py: 1 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        🎄
      </Typography>
      <Typography sx={{ color: "secondary.dark" }}>
        Još uvijek nisu generisani parovi za tekuću godinu.
      </Typography>
    </Box>
  );
}