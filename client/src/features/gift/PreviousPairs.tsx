// components/PreviousPairs.tsx
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Chip,
  Stack,
  Divider,
  alpha,
} from "@mui/material";
import HistoryIcon from "@mui/icons-material/History";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import type { Pair } from "../../app/models/pair";

interface PreviousPairsProps {
  pairs: Pair[] | null; // Niz parova gde je korisnik giver
  userName: string; // Ime korisnika za personalizaciju
}

export default function PreviousPairs({ pairs, userName }: PreviousPairsProps) {
  if (!pairs || pairs.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 6 }}>
        <HistoryIcon sx={{ fontSize: 60, color: alpha('#FF3838', 0.3), mb: 2 }} />
        <Typography variant="h5" sx={{ fontWeight: 500, color: "#050E3C", mb: 1 }}>
          Prethodni parovi
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary" }}>
          {userName}, još nemaš prethodnih parova. Ovo je tvoja prva godina u Secret Santa!
        </Typography>
      </Box>
    );
  }

  // Grupiši parove po godinama
  const pairsByYear = pairs.reduce((acc, pair) => {
    if (!acc[pair.year]) {
      acc[pair.year] = [];
    }
    acc[pair.year].push(pair);
    return acc;
  }, {} as Record<number, Pair[]>);

  // Sortiraj godine opadajuće (najnovija prva)
  const sortedYears = Object.keys(pairsByYear)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <Box>
      {/* HEADER */}
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
        <Box sx={{ 
          width: 50, 
          height: 50, 
          borderRadius: '50%', 
          bgcolor: alpha('#1B5E20', 0.1),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <HistoryIcon sx={{ fontSize: 28, color: '#1B5E20' }} />
        </Box>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600, color: "#050E3C" }}>
            Prethodni parovi
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {userName}, evo tvoje istorije Secret Santa parova
          </Typography>
        </Box>
      </Stack>

      {/* LISTA PO GODINAMA */}
      <Stack spacing={4}>
        {sortedYears.map((year) => (
          <Paper
            key={year}
            elevation={1}
            sx={{
              p: 3,
              borderRadius: 3,
              borderLeft: '4px solid',
              borderLeftColor: '#1B5E20',
              backgroundColor: alpha('#1B5E20', 0.02),
            }}
          >
            {/* GODINA HEADER */}
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
                  bgcolor: alpha('#1B5E20', 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <CalendarTodayIcon sx={{ fontSize: 20, color: '#1B5E20' }} />
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 600, color: "#050E3C" }}>
                    {year}. godina
                  </Typography>
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    {pairsByYear[year].length} {pairsByYear[year].length === 1 ? 'par' : 'parova'}
                  </Typography>
                </Box>
              </Stack>
              <Chip 
                label={year} 
                color="success" 
                variant="outlined"
                size="small"
              />
            </Stack>

            <Divider sx={{ mb: 3 }} />

            {/* PAROVI ZA TU GODINU */}
            <Stack spacing={2}>
              {pairsByYear[year].map((pair, index) => (
                <Card
                  key={pair.id || index}
                  variant="outlined"
                  sx={{
                    borderRadius: 2,
                    borderLeft: '3px solid',
                    borderLeftColor: '#FF3838',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateX(4px)',
                    },
                  }}
                >
                  <CardContent sx={{ py: 2 }}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Box sx={{ 
                        minWidth: 36,
                        height: 36, 
                        borderRadius: '50%', 
                        bgcolor: alpha('#FF3838', 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#FF3838',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                      }}>
                        <CardGiftcardIcon fontSize="small" />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body1" sx={{ fontWeight: 500, color: "#050E3C" }}>
                          🎁 Ti → {pair.receiver.firstName} {pair.receiver.lastName}
                        </Typography>
                        <Stack 
                          direction="row" 
                          alignItems="center" 
                          spacing={2}
                          sx={{ mt: 0.5 }}
                        >
                          <Typography variant="caption" sx={{ color: "text.secondary" }}>
                            📧 {pair.receiver.email}
                          </Typography>
                          <Typography variant="caption" sx={{ color: "text.secondary" }}>
                            📅 {new Date(pair.createdAt).toLocaleDateString('sr-RS')}
                          </Typography>
                          <Chip 
                            label={`ID: ${pair.id}`} 
                            size="small" 
                            variant="outlined" 
                          />
                        </Stack>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Paper>
        ))}
      </Stack>

      {/* STATISTIKA */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mt: 4,
          borderRadius: 3,
          backgroundColor: alpha('#050E3C', 0.05),
          border: '1px solid',
          borderColor: alpha('#050E3C', 0.1),
        }}
      >
        <Stack direction="row" spacing={4} justifyContent="center">
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h3" sx={{ fontWeight: 700, color: "#050E3C" }}>
              {pairs.length}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              ukupno parova
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h3" sx={{ fontWeight: 700, color: "#050E3C" }}>
              {sortedYears.length}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              godina učestvovanja
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h3" sx={{ fontWeight: 700, color: "#050E3C" }}>
              {new Date(pairs[0]?.createdAt).getFullYear()}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              prva godina
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}