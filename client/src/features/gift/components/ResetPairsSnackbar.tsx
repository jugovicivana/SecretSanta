import { Snackbar, Alert, Button, Box } from "@mui/material";

type Props = {
  showResetAlert: boolean;
  onClose: () => void;
  handleResetPairs: (source: "alert" | "pairlist") => void;
  resettingSource: "alert" | "pairlist" | null;
  currentYear: number;
};

export default function ResetPairsSnackbar({
  showResetAlert,
  onClose,
  handleResetPairs,
  resettingSource,
  currentYear,
}: Props) {
  return (
    <Snackbar
      open={showResetAlert}
      autoHideDuration={4000}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert
        severity="warning"
        onClose={onClose}
        sx={{ width: "100%" }}
      >
        Već postoje generisani parovi za {currentYear}. godinu! Da li želite
        da resetujete postojeće parove?
        <Box sx={{ mt: 1 }}>
          <Button
            size="small"
            color="error"
            variant="contained"
            onClick={() => handleResetPairs("alert")}
            disabled={resettingSource === "alert"}
            sx={{ mr: 1 }}
          >
            {resettingSource === "alert" ? "Resetujem..." : "Da, resetuj"}
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={onClose}
            disabled={resettingSource === "alert"}
          >
            Odustani
          </Button>
        </Box>
      </Alert>
    </Snackbar>
  );
}
