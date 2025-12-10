import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  Chip,
  Typography,
} from "@mui/material";
import type { User } from "../../../app/models/user";
import ActionButton from "./ActionButton";

type Props = {
  users: User[];
  processingId: number | null;
  isApproving: boolean;
  isRejecting: boolean;
  onApprove: (user: User) => void;
  onReject: (user: User) => void;
};

export default function RequestTable({
  users,
  processingId,
  isApproving,
  isRejecting,
  onApprove,
  onReject,
}: Props) {
  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "primary.light" }}>
              <TableCell
                sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}
              >
                ID
              </TableCell>
              <TableCell
                sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}
              >
                Ime
              </TableCell>
              <TableCell
                sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}
              >
                Prezime
              </TableCell>
              <TableCell
                sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}
              >
                Email
              </TableCell>
              <TableCell
                sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}
              >
                Uloga
              </TableCell>
              <TableCell
                sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}
              >
                Akcije
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {users.map((user) => {

              return (
                <TableRow key={user.id} hover>
                  <TableCell sx={{ textAlign: "center" }}>{user.id}</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {user.firstName}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {user.lastName}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {user.email}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <Chip
                      label={user.role.description}
                      sx={{
                        backgroundColor:
                          user.role.name === "Employee"
                            ? "secondary.main"
                            : "secondary.light",
                        color: "white",
                      }}
                      size="small"
                    />
                  </TableCell>

                  <TableCell>
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ display: "flex", justifyContent: "space-evenly" }}
                    >
                      <ActionButton
                        userId={user.id}
                        isProcessing={processingId === user.id && isApproving}
                        actionType="approve"
                        onClick={() => onApprove(user)}
                      />
                      <ActionButton
                        userId={user.id}
                        isProcessing={processingId === user.id && isRejecting}
                        actionType="reject"
                        onClick={() => onReject(user)}
                      />
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        Ukupno zahtjeva: {users.length}
      </Typography>
    </>
  );
}
