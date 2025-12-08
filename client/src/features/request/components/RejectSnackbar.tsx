import {
  Snackbar,
  Alert,
  Box,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import type { PendingAdmin } from "../../../app/models/user";

type Props = {
  open: boolean;
  admin: PendingAdmin | null;
  onClose: () => void;
  onConfirm: () => void;
  processingId: number | null;
  isRejecting: boolean;
};

export default function RejectSnackbar({
  open,
  admin,
  onClose,
  onConfirm,
  processingId,
  isRejecting,
}: Props) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert
        severity="warning"
        onClose={onClose}
        sx={{ width: "100%", maxWidth: 500 }}
        icon={<DeleteIcon />}
      >
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Potvrda odbijanja
        </Typography>
        <Typography variant="body2">
          Da li ste sigurni da želite odbiti korisnika{" "}
          <strong>
            {admin?.firstName} {admin?.lastName}
          </strong>
          ?
        </Typography>
        <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
          <Button
            size="small"
            color="error"
            variant="contained"
            onClick={onConfirm}
            disabled={isRejecting && processingId === admin?.id}
            startIcon={
              isRejecting && processingId === admin?.id ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <DeleteIcon />
              )
            }
          >
            {isRejecting && processingId === admin?.id
              ? "Brišem..."
              : "Da, obriši"}
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={onClose}
            disabled={isRejecting && processingId === admin?.id}
          >
            Odustani
          </Button>
        </Box>
      </Alert>
    </Snackbar>
  );
}
