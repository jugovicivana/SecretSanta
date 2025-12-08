import { Box, Button, Paper, Typography } from "@mui/material";
import HistoryIcon from "@mui/icons-material/History";
import PairList from "./PairList";
import type { Pair } from "../../../app/models/pair";

type Props = {
  filteredYears: number[];
  selectedYearFromState: number | null;
  getPairsForSelectedYear: () => Pair[] | null;
  handleViewPreviousYear: (year: number) => void;
  status: string;
  currentYear: number;
};

export default function PreviousYears({
  filteredYears,
  selectedYearFromState,
  getPairsForSelectedYear,
  handleViewPreviousYear,
  status,
  currentYear,
}: Props) {
  return (
    <Paper
      elevation={6}
      sx={{
        p: 4,
        borderRadius: 3,
        background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
        border: "1px solid rgba(27, 94, 32, 0.1)",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Typography
          variant="h5"
          sx={{ fontWeight: 600, color: "secondary.main" }}
        >
          Prethodne godine
        </Typography>
      </Box>

      <Box
        sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: 2 }}
      >
        {filteredYears && filteredYears.length > 0 ? (
          filteredYears.map((year) => (
            <Button
              key={year}
              variant="outlined"
              onClick={() => handleViewPreviousYear(year)}
              sx={{
                py: 2,
                px: 3,
                borderRadius: 2,
                borderColor: "#1B5E20",
                color: "#1B5E20",
                "&:hover": {
                  backgroundColor: "rgba(27, 94, 32, 0.08)",
                  borderColor: "#0D3B0D",
                },
              }}
            >
              <HistoryIcon sx={{ mr: 1 }} />
              Pregled {year}.
            </Button>
          ))
        ) : (
          <Typography variant="body2">
            Ne postoje podaci o prethodnim godinama.
          </Typography>
        )}
      </Box>

      {selectedYearFromState && (
        <Box sx={{ mt: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              backgroundColor: "rgba(27, 94, 32, 0.05)",
              border: "1px solid rgba(29, 27, 94, 0.2)",
            }}
          >
            <PairList
              pairs={getPairsForSelectedYear() || []}
              year={selectedYearFromState}
              isLoading={status === "pendingFetchYearPairs"}
              isCurrentYear={selectedYearFromState === currentYear}
            />
          </Paper>
        </Box>
      )}
    </Paper>
  );
}
