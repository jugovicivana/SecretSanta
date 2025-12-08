import { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../app/store/configureStore';
import { fetchPendingAdmins, approveAdmin, rejectAdmin } from '../account/accountSlice';
import RequestTable from './components/RequestTable';
import RejectSnackbar from './components/RejectSnackbar';
import type { PendingAdmin } from '../../app/models/user';
import { toast } from 'react-toastify';

export default function Requests() {
  const dispatch = useAppDispatch();
  const { pendingAdmins, status } = useAppSelector(state => state.account);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [showRejectAlert, setShowRejectAlert] = useState(false);
  const [adminToReject, setAdminToReject] = useState<PendingAdmin | null>(null);

  useEffect(() => {
    dispatch(fetchPendingAdmins());
  }, [dispatch]);

 const handleApprove = async (admin: PendingAdmin) => {
  setProcessingId(admin.id);
  try {
    await dispatch(approveAdmin(admin.id)).unwrap();
    toast.success(`${admin.firstName} ${admin.lastName} je sada admin.`);
  } catch (error: any) {
    toast.error(error);
  } finally {
    setProcessingId(null);
  }
};

  const handleOpenReject = (admin: PendingAdmin) => {
    setAdminToReject(admin);
    setShowRejectAlert(true);
  };

  const handleCloseReject = () => {
    setShowRejectAlert(false);
    setAdminToReject(null);
  };

  const handleConfirmReject = async () => {
    if (!adminToReject) return;
    setProcessingId(adminToReject.id);
    try {
      await dispatch(rejectAdmin(adminToReject.id)).unwrap();
      toast.info("Odbijen je zahtjev za admina.")
    } catch (error:any) {
      toast.error(error)
    } finally {
      setProcessingId(null);
      handleCloseReject();
    }
  };

  const isLoading = status === 'pendingFetchPendingAdmins';
  const isApproving = status === 'pendingApproveAdmin';
  const isRejecting = status === 'pendingRejectAdmin';

  return (
    <Box sx={{ p: 3, width: '100%' }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Zahtjevi za admin status
      </Typography>

      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : pendingAdmins.length === 0 ? (
        <Alert severity="info">
          Trenutno nema zahtjeva za admin status.
        </Alert>
      ) : (
        <RequestTable
          admins={pendingAdmins}
          processingId={processingId}
          isApproving={isApproving}
          onApprove={handleApprove}
          onReject={handleOpenReject}
        />
      )}

      <RejectSnackbar
        open={showRejectAlert}
        admin={adminToReject}
        onClose={handleCloseReject}
        onConfirm={handleConfirmReject}
        processingId={processingId}
        isRejecting={isRejecting}
      />

      {(status === 'rejectedFetchPendingAdmins' ||
        status === 'failedRejectAdmin' ||
        status === 'rejectedApproveAdmin') && (
        <Alert severity="error" sx={{ mt: 2 }}>
          Došlo je do greške. Pokušajte ponovo.
        </Alert>
      )}
    </Box>
  );
}
