import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Stack,
  Chip,
  CircularProgress,
  Typography,
} from "@mui/material";
import { Check as CheckIcon, Delete as DeleteIcon } from "@mui/icons-material";
import type { PendingAdmin } from "../../../app/models/user";

type Props = {
  admins: PendingAdmin[];
  processingId: number | null;
  isApproving: boolean;
  onApprove: (admin: PendingAdmin) => void;
  onReject: (admin: PendingAdmin) => void;
};

export default function RequestTable({
  admins,
  processingId,
  isApproving,
  onApprove,
  onReject,
}: Props) {
  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "primary.light" }}>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                ID
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Ime
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Prezime
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Email
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Status
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Akcije
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {admins.map((admin) => {
              const isThisRowProcessing = processingId === admin.id;

              return (
                <TableRow key={admin.id} hover>
                  <TableCell>{admin.id}</TableCell>
                  <TableCell>{admin.firstName}</TableCell>
                  <TableCell>{admin.lastName}</TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>
                    <Chip label="Na čekanju" color="warning" size="small" />
                  </TableCell>

                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        startIcon={
                          isThisRowProcessing && isApproving ? (
                            <CircularProgress size={20} color="inherit" />
                          ) : (
                            <CheckIcon />
                          )
                        }
                        onClick={() => onApprove(admin)}
                        disabled={processingId !== null && !isThisRowProcessing}
                      >
                        {isThisRowProcessing && isApproving
                          ? "Odobravanje..."
                          : "Odobri"}
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<DeleteIcon />}
                        onClick={() => onReject(admin)}
                        disabled={
                          processingId !== null && !isThisRowProcessing
                        }
                      >
                        Odbij
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        Ukupno zahtjeva: {admins.length}
      </Typography>
    </>
  );
}
