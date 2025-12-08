import { Box, Typography, Button, Paper } from "@mui/material";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";

type Props = {
  currentYear: number;
  handleGenerate: () => void;
  status: string;
};

export default function GeneratePairs({
  currentYear,
  handleGenerate,
  status,
}: Props) {
  return (
    <Paper
      elevation={1}
      sx={{
        p: 4,
        mb: 4,
        borderRadius: 3,
        background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
        border: "1px solid rgba(220, 0, 0, 0.1)",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Typography
          variant="h5"
          sx={{ fontWeight: 500, color: "secondary.dark" }}
        >
          Generisanje parova
        </Typography>
      </Box>
      <Typography sx={{ mb: 3, color: "secondary.main" }}>
        Klikom na dugme ispod će se generisati nasumični parovi za {currentYear}
        . godinu.
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
        <Button
          variant="contained"
          size="medium"
          onClick={handleGenerate}
          disabled={status === "pendingGenerate"}
          sx={{
            background: "linear-gradient(45deg, #DC0000 30%, #FF3838 90%)",
            py: 1.5,
            fontSize: "1rem",
            fontWeight: 500,
            borderRadius: 2,
          }}
        >
          {status === "pendingGenerate" ? (
            <>
              <Box
                sx={{
                  animation: "spin 1s linear infinite",
                  display: "inline-block",
                  mr: 1,
                  "@keyframes spin": {
                    "0%": { transform: "rotate(0deg)" },
                    "100%": { transform: "rotate(360deg)" },
                  },
                }}
              >
                <AutoFixHighIcon />
              </Box>{" "}
              Generišem parove...
            </>
          ) : (
            <>
              <AutoFixHighIcon sx={{ mr: 1 }} /> Generiši parove za{" "}
              {currentYear}.
            </>
          )}
        </Button>
      </Box>
    </Paper>
  );
}
