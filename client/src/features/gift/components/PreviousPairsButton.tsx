import { Box, Button, CircularProgress } from "@mui/material";
import type { Pair } from "../../../app/models/pair";
import HistoryIcon from "@mui/icons-material/History";

export default function PreviousPairsButton({
  myPairs,
  isLoadingPreviousPairs,
  onShowPreviousPairs,
}: {
  myPairs: Pair[] | null;
  isLoadingPreviousPairs: boolean;
  onShowPreviousPairs: () => void;
}) {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", gap: 2, flexWrap: "wrap", mt: 4 }}>
      <Button
        variant="outlined"
        size="medium"
        startIcon={<HistoryIcon />}
        onClick={onShowPreviousPairs}
        disabled={isLoadingPreviousPairs}
        sx={{
          borderColor: "secondary.main",
          backgroundColor: "white",
          color: "#1B5E20",
          px: 4,
          py: 1.5,
          borderRadius: 2,
          fontWeight: 600,
          "&:hover": {
            borderColor: "primary.dark",
            backgroundColor: "#877e7eff",
          },
          "&.Mui-disabled": {
            color: "text.disabled",
            borderColor: "action.disabled",
          },
        }}
      >
        {isLoadingPreviousPairs ? (
          <>
            <CircularProgress size={20} sx={{ mr: 1, color: "#1B5E20" }} />
            Učitavam...
          </>
        ) : `Moji prethodni parovi ${myPairs && myPairs.length > 0 ? `(${myPairs.length})` : ""}`}
      </Button>
    </Box>
  );
}