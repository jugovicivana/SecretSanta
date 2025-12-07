import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Button, 
  Chip, 
  CircularProgress,
  Alert,
  Stack,
  Snackbar
} from '@mui/material';
import { 
  Check as CheckIcon, 
  Close as CloseIcon,
  Person as PersonIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../app/store/configureStore';
import { 
  fetchPendingAdmins, 
  approveAdmin, 
  rejectAdmin 
} from './accountSlice';

export default function Requests() {
  const dispatch = useAppDispatch();
  const { pendingAdmins, status } = useAppSelector(state => state.account);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [showRejectAlert, setShowRejectAlert] = useState(false);
  const [adminToReject, setAdminToReject] = useState<{id: number, name: string} | null>(null);
  const [action, setAction] = useState<'approve' | 'reject' | null>(null);

  useEffect(() => {
    dispatch(fetchPendingAdmins());
  }, [dispatch]);

  const handleApprove = async (id: number, firstName: string, lastName: string) => {
    setProcessingId(id);
    setAction('approve');
    try {
      await dispatch(approveAdmin(id)).unwrap();
    } catch (error) {
      console.error('Greška pri odobravanju admina:', error);
    } finally {
      setProcessingId(null);
      setAction(null);
    }
  };

  const openRejectAlert = (id: number, firstName: string, lastName: string) => {
    setAdminToReject({ 
      id, 
      name: `${firstName} ${lastName}` 
    });
    setShowRejectAlert(true);
    setAction('reject');
  };

  const closeRejectAlert = () => {
    setShowRejectAlert(false);
    setAdminToReject(null);
    setAction(null);
  };

  const handleConfirmReject = async () => {
    if (!adminToReject) return;
    
    setProcessingId(adminToReject.id);
    try {
      await dispatch(rejectAdmin(adminToReject.id)).unwrap();
    } catch (error) {
      console.error('Greška pri odbijanju admina:', error);
    } finally {
      setProcessingId(null);
      closeRejectAlert();
    }
  };

  const isLoading = status === 'pendingFetchPendingAdmins';
  const isApproving = status === 'pendingApproveAdmin';
  const isRejecting = status === 'pendingRejectAdmin';

  return (
    <>
      <Box sx={{ p: 3, width: '100%' }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
          <PersonIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
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
          <>
            <Alert severity="info" sx={{ mb: 3 }}>
              Pregled zahtjeva za admin status. Možete odobriti ili odbiti svakog korisnika.
            </Alert>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'primary.light' }}>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Ime</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Prezime</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Email</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Akcije</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pendingAdmins.map((admin) => (
                    <TableRow key={admin.id} hover>
                      <TableCell>{admin.id}</TableCell>
                      <TableCell>{admin.firstName}</TableCell>
                      <TableCell>{admin.lastName}</TableCell>
                      <TableCell>{admin.email}</TableCell>
                      <TableCell>
                        <Chip 
                          label="Na čekanju" 
                          color="warning" 
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            startIcon={processingId === admin.id && isApproving && action === 'approve' ? (
                              <CircularProgress size={20} color="inherit" />
                            ) : <CheckIcon />}
                            onClick={() => handleApprove(admin.id, admin.firstName, admin.lastName)}
                            disabled={processingId !== null && processingId !== admin.id}
                          >
                            {processingId === admin.id && isApproving && action === 'approve' ? 'Odobravanje...' : 'Odobri'}
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            startIcon={<DeleteIcon />}
                            onClick={() => openRejectAlert(admin.id, admin.firstName, admin.lastName)}
                            disabled={processingId !== null && processingId !== admin.id}
                          >
                            Odbij
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Ukupno zahtjeva: {pendingAdmins.length}
            </Typography>
          </>
        )}

        {(status === 'rejectedFetchPendingAdmins' || 
          status === 'failedRejectAdmin' || 
          status === 'rejectedApproveAdmin') && (
          <Alert severity="error" sx={{ mt: 2 }}>
            Došlo je do greške. Pokušajte ponovo.
          </Alert>
        )}
      </Box>

      {/* Snackbar za potvrdu odbijanja */}
      <Snackbar
        open={showRejectAlert}
        autoHideDuration={6000}
        onClose={closeRejectAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity="warning"
          onClose={closeRejectAlert}
          sx={{ width: '100%', maxWidth: 500 }}
          icon={<DeleteIcon />}
        >
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Potvrda odbijanja
          </Typography>
          <Typography variant="body2">
            Da li ste sigurni da želite odbiti korisnika{' '}
            <strong>{adminToReject?.name}</strong>?
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 1, fontWeight: 'medium' }}>
            Ova akcija će trajno obrisati korisnika iz sistema.
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
            <Button
              size="small"
              color="error"
              variant="contained"
              onClick={handleConfirmReject}
              disabled={isRejecting && processingId === adminToReject?.id}
              startIcon={isRejecting && processingId === adminToReject?.id ? (
                <CircularProgress size={16} color="inherit" />
              ) : <DeleteIcon />}
            >
              {isRejecting && processingId === adminToReject?.id ? 'Brišem...' : 'Da, obriši'}
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={closeRejectAlert}
              disabled={isRejecting && processingId === adminToReject?.id}
            >
              Odustani
            </Button>
          </Box>
        </Alert>
      </Snackbar>
    </>
  );
}