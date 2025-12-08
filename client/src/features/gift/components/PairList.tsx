import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Tooltip,
  CircularProgress,
  Stack,
  Divider,
  alpha,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import GiftIcon from "@mui/icons-material/CardGiftcard";
import type { Pair } from "../../../app/models/pair";

interface PairListProps {
  pairs: Pair[];
  year: number;
  onReset?: () => void;
  isCurrentYear?: boolean;
  isLoading?: boolean;
  isResetting?: boolean;
}

export default function PairList({ 
  pairs, 
  year, 
  onReset, 
  isCurrentYear = false,
  isLoading = false,
  isResetting = false,
}: PairListProps) {
  
    if (isLoading && isCurrentYear) {
    return (
      <Box sx={{ textAlign: "center", py: 6 }}>
        <CircularProgress size={50} />
        <Typography sx={{ mt: 2, color: "text.secondary" }}>
          Učitavanje parova za {year}. godinu...
        </Typography>
      </Box>
    );
  }

  if (!pairs || pairs.length === 0) {
    return (
      <Box sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <GiftIcon sx={{ fontSize: 60, color: alpha('#FF3838', 0.3), mb: 2 }} />
          <Typography variant="h5" sx={{ fontWeight: 500, color: "#050E3C", mb: 1 }}>
            Parovi za {year}. godinu
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary" }}>
            {isCurrentYear 
              ? "Parovi za ovu godinu još nisu generisani." 
              : `Nema sačuvanih parova za ${year}. godinu.`
            }
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <Stack 
        direction="row" 
        alignItems="center" 
        justifyContent="space-between" 
        sx={{ mb: 3 }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box sx={{ 
            width: 40, 
            height: 40, 
            borderRadius: '50%', 
            bgcolor: alpha('#FF3838', 0.1),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <GiftIcon sx={{ fontSize: 24, color: '#FF3838' }} />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600, color: "#050E3C" }}>
              Parovi za {year}. godinu
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {pairs.length} {pairs.length === 1 ? 'par' : pairs.length>1 && pairs.length<5 ? "para" :'parova'}
            </Typography>
          </Box>
        </Stack>
        
        {isCurrentYear && onReset && (
          <Tooltip title="Obriši sve parove za ovu godinu">
            <IconButton
              color="error"
              onClick={onReset}
              disabled={isResetting}
              size="large"
              sx={{
                border: '1px solid',
                borderColor: 'error.light',
                '&:hover': {
                  backgroundColor: alpha('#FF3838', 0.1),
                  borderColor:'error.dark'
                },
              }}
            >
              {isResetting ? (
                <CircularProgress size={24} />
              ) : (
                <DeleteIcon />
              )}
            </IconButton>
          </Tooltip>
        )}
      </Stack>

      <Divider sx={{ mb: 3 }} />

      <Box sx={{ maxHeight: 350, overflowY: "auto", pr: 1 }}>
        <Stack spacing={1.5}>
          {pairs.map((pair, index) => (
            <Card
              key={pair.id || index}
              variant="outlined"
              sx={{
                borderRadius: 1,
                borderLeft: '3px solid',
                borderLeftColor: '#FF3838',
              }}
            >
              <CardContent sx={{ py: 2, px: 3 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Box sx={{ 
                    minWidth: 32,
                    height: 32, 
                    borderRadius: '50%', 
                    bgcolor: alpha('#050E3C', 0.08),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#050E3C',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                  }}>
                    {index + 1}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 500, color: "#050E3C" }}>
                          {pair.giver.firstName} {pair.giver.lastName}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "text.secondary" }}>
                          Kupuje poklon
                        </Typography>
                      </Box>
                      <Box sx={{ color: 'primary.main' }}>
                        →
                      </Box>
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 500, color: "#050E3C" }}>
                          {pair.receiver.firstName} {pair.receiver.lastName}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "text.secondary" }}>
                          Dobija poklon
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Box>

      {/* FOOTER - samo info, bez dugmeta */}
      <Divider sx={{ mt: 3, mb: 2 }} />
      
      <Typography variant="body2" sx={{ color: "text.secondary", mt: 2 }}>
        Generisano: {pairs[0]?.createdAt 
          ? new Date(pairs[0].createdAt).toLocaleDateString('sr-RS') 
          : 'Nepoznato'}
      </Typography>
    </Box>
  );
}