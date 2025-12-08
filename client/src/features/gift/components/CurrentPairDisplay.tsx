import { Paper, Typography } from "@mui/material";
import type { Pair } from "../../../app/models/pair";

export default function CurrentPairDisplay({
  currentYear,
  pair,
}: {
  currentYear: number;
  pair: Pair;
}) {
  return (
    <>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          color: "#050E3C",
          mb: 2,
        }}
      >
        🎁 Tvoj tajni poklon u {currentYear}. godini prima...
      </Typography>

      <Paper
        elevation={6}
        sx={{
          p: 4,
          my: 3,
          background: "linear-gradient(45deg, #002455 30%, #050E3C 90%)",
          color: "white",
          borderRadius: 3,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 600,
            fontFamily: "'Montserrat', sans-serif",
            background: "linear-gradient(45deg, #FF3838 30%, #FF8A80 90%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {pair.receiver.firstName} {pair.receiver.lastName}
        </Typography>
        <Typography variant="body1" sx={{ mt: 1, opacity: 0.9, color: "white" }}>
          {pair.receiver.email}
        </Typography>
      </Paper>
    </>
  );
}