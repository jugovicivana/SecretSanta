import { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, Alert } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import {
  fetchPendingUsers,
  approveUser,
  rejectUser,
} from "../account/accountSlice";
import RequestTable from "./components/RequestTable";
import RejectSnackbar from "./components/RejectSnackbar";
import { toast } from "react-toastify";
import type { User } from "../../app/models/user";

export default function Requests() {
  const dispatch = useAppDispatch();
  const { pendingUsers, status } = useAppSelector((state) => state.account);
const [processingId, setProcessingId] = useState<number | null>(null);
  const [showRejectAlert, setShowRejectAlert] = useState(false);
  const [userToReject, setUserToReject] = useState<User | null>(null);

  useEffect(() => {
    dispatch(fetchPendingUsers());
  }, [dispatch]);

  const handleApprove = async (user: User) => {
    setProcessingId(user.id);
    try {
      await dispatch(approveUser(user.id)).unwrap();
      toast.success(
        `Nalog korisnika ${user.firstName} ${user.lastName} je odobren.`
      );
    } catch (error: any) {
      toast.error(error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleOpenReject = (user: User) => {
    setUserToReject(user);
    setShowRejectAlert(true);
  };

  const handleCloseReject = () => {
    setShowRejectAlert(false);
    setUserToReject(null);
  };

  const handleConfirmReject = async () => {
    if (!userToReject) return;
    setProcessingId(userToReject.id);
    try {
      await dispatch(rejectUser(userToReject.id)).unwrap();
      toast.info("Odbijen je zahtjev za odobrenje naloga.");
    } catch (error: any) {
      toast.error(error);
    } finally {
      setProcessingId(null);
      handleCloseReject();
    }
  };

  const isLoading = status === "pendingFetchPendingUsers";
  const isApproving = status === "pendingApproveUser";
  const isRejecting = status === "pendingRejectUser";

  return (
    <Box sx={{ p: 3, width: "100%" }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Zahtjevi za odobrenje naloga
      </Typography>

      {isLoading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="200px"
        >
          <CircularProgress />
        </Box>
      ) : pendingUsers.length === 0 ? (
        <Alert severity="info">
          Trenutno nema zahtjeva za odobrenje naloga.
        </Alert>
      ) : (
        <RequestTable
          users={pendingUsers}
          processingId={processingId}
          isApproving={isApproving}
          isRejecting={isRejecting}
          onApprove={handleApprove}
          onReject={handleOpenReject}
        />
      )}

      <RejectSnackbar
        open={showRejectAlert}
        user={userToReject}
        onClose={handleCloseReject}
        onConfirm={handleConfirmReject}
        processingId={processingId}
        isRejecting={isRejecting}
      />

      {(status === "rejectedFetchPendingUsers" ||
        status === "failedRejectUser" ||
        status === "rejectedApproveUser") && (
        <Alert severity="error" sx={{ mt: 2 }}>
          Došlo je do greške. Pokušajte ponovo.
        </Alert>
      )}
    </Box>
  );
}
