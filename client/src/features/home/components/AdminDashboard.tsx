// AdminDashboard.tsx - samo deo koji se menja
import {
  Box,
  Typography,
  Button,
  Paper,
  Chip,
  Alert,
  Snackbar,
} from "@mui/material";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import HistoryIcon from "@mui/icons-material/History";
import { useState, useEffect } from "react";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../app/store/configureStore";
import {
  generatePairs,
  resetCurrentYearPairs,
  fetchCurrentYearPairs,
  fetchPairsForYear,
  setSelectedYear,
  fetchYears,
} from "../../gift/giftSlice";
import { toast } from "react-toastify";
import PairList from "../../gift/PairList";

export default function AdminDashboard() {
  const [isGeneratingFromButton, setIsGeneratingFromButton] = useState(false);
  const [resettingSource, setResettingSource] = useState<
    "button" | "pairlist" | "alert" | null
  >(null);
  const [showResetAlert, setShowResetAlert] = useState(false);
  const dispatch = useAppDispatch();
  const {
    currentYearPairs,
    yearPairs,
    selectedYear: selectedYearFromState,
    status,
    availableYears,
  } = useAppSelector((state) => state.gift);

  const currentYear = new Date().getFullYear();

  const filteredYears = availableYears
    ? availableYears
        .filter((year) => year !== currentYear)
        .sort((a, b) => b - a)
    : [];

  useEffect(() => {
    dispatch(fetchCurrentYearPairs());
    dispatch(fetchYears());
  }, [dispatch]);

  const handleGenerateFromButton = async () => {
    if (currentYearPairs && currentYearPairs.length > 0) {
      setShowResetAlert(true);
      return;
    }

    setIsGeneratingFromButton(true);
    try {
      await dispatch(generatePairs()).unwrap();
      toast.success("Parovi su uspješno generisani!");
      dispatch(fetchCurrentYearPairs());
    } catch (error: any) {
      toast.error(
        error.message || "Došlo je do greške prilikom generisanja parova"
      );
    } finally {
      setIsGeneratingFromButton(false);
    }
  };

  const handleResetPairs = async (source: "button" | "pairlist" | "alert") => {
    setResettingSource(source);
    try {
      await dispatch(resetCurrentYearPairs()).unwrap();
      toast.success("Parovi za tekuću godinu su resetovani!");
      dispatch(fetchCurrentYearPairs());
      setShowResetAlert(false);
    } catch (error: any) {
      toast.error(error.message || "Došlo je do greške prilikom resetovanja");
    } finally {
      setResettingSource(null);
    }
  };

  const handleViewPreviousYear = (year: number) => {
    dispatch(setSelectedYear(year));
    const cachedPairs = yearPairs.find((yp) => yp.year === year);
    if (!cachedPairs) {
      dispatch(fetchPairsForYear(year));
    }
  };

  const getPairsForSelectedYear = () => {
    if (!selectedYearFromState) return null;
    const yearData = yearPairs.find((yp) => yp.year === selectedYearFromState);
    return yearData ? yearData.pairs : null;
  };

  return (
    <>
      <Box
        sx={{
          py: 4,
          paddingX: 5,
          width: "100%",
          overflowX: "hidden",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
       <Box sx={{ 
        textAlign: "center", 
        width: "100%",
        maxWidth: 800, // Limitiraj širinu
        mb: 4 
      }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 600,
                color: "#050E3C",
                mb: 2,
                fontFamily: "'Montserrat', sans-serif",
              }}
            >
              Admin Panel
            </Typography>
            <Typography variant="h6" sx={{ color: "secondary.main" }}>
              Upravljajte Secret Santa organizacijom
            </Typography>
            <Chip
              label={`Trenutna godina: ${currentYear}`}
              color="primary"
              sx={{ mt: 2 }}
            />
          </Box>
          <Box sx={{ margin: 3 }}>
            <Paper
              elevation={1}
              sx={{
                p: 4,
                mb: 4,
                borderRadius: 3,
                background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                border: "1px solid rgba(220, 0, 0, 0.1)",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 500, color: "#secondary.dark" }}
                >
                  Generisanje parova
                </Typography>
              </Box>

              <Typography sx={{ mb: 3, color: "#secondary.main" }}>
                Klikom na dugme ispod će se generisati nasumični parovi za{" "}
                {currentYear}. godinu.
              </Typography>

              <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
                <Button
                  variant="contained"
                  size="medium"
                  onClick={handleGenerateFromButton}
                  disabled={
                    isGeneratingFromButton || status === "pendingGenerate"
                  }
                  sx={{
                    background:
                      "linear-gradient(45deg, #DC0000 30%, #FF3838 90%)",
                    py: 1.5,
                    fontSize: "1rem",
                    fontWeight: 500,
                    borderRadius: 2,
                  }}
                >
                  {isGeneratingFromButton || status === "pendingGenerate" ? (
                    <>
                      <Box
                        sx={{
                          animation: "spin 1s linear infinite",
                          display: "inline-block",
                          mr: 1,
                          "@keyframes spin": {
                            "0%": { transform: "rotate(0deg)" },
                            "100%": { transform: "rotate(360deg)" },
                          },
                        }}
                      >
                        <AutoFixHighIcon />
                      </Box>
                      Generišem parove...
                    </>
                  ) : (
                    <>
                      <AutoFixHighIcon sx={{ mr: 1 }} />
                      Generiši parove za {currentYear}.
                    </>
                  )}
                </Button>
              </Box>
            </Paper>

            <Paper
              elevation={1}
              sx={{
                p: 4,
                mb: 4,
                borderRadius: 3,
                background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                border: "1px solid rgba(0, 36, 85, 0.1)",
              }}
            >
              <PairList
                pairs={currentYearPairs || []}
                year={currentYear}
                onReset={() => handleResetPairs("pairlist")}
                isCurrentYear={true}
                isLoading={status === "pendingFetchPairs"}
                isResetting={resettingSource === "pairlist"}
              />
            </Paper>

            <Paper
              elevation={6}
              sx={{
                p: 4,
                borderRadius: 3,
                background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                border: "1px solid rgba(27, 94, 32, 0.1)",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 600, color: "#050E3C" }}
                >
                  Prethodne godine
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 2,
                }}
              >
                {filteredYears && filteredYears.length > 0 ? (
                  filteredYears.map((year) => (
                    <Button
                      key={year}
                      variant="outlined"
                      onClick={() => handleViewPreviousYear(year)}
                      sx={{
                        py: 2,
                        px: 3,
                        borderRadius: 2,
                        borderColor: "#1B5E20",
                        color: "#1B5E20",
                        "&:hover": {
                          backgroundColor: "rgba(27, 94, 32, 0.08)",
                          borderColor: "#0D3B0D",
                        },
                      }}
                    >
                      <HistoryIcon sx={{ mr: 1 }} />
                      Pregled {year}.
                    </Button>
                  ))
                ) : (
                  <Typography variant="body2">
                    Ne postoje podaci o prethodnim godinama.
                  </Typography>
                )}
              </Box>
              {selectedYearFromState && (
                <Box sx={{ mt: 4 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      backgroundColor: "rgba(27, 94, 32, 0.05)",
                      border: "1px solid rgba(27, 94, 32, 0.2)",
                    }}
                  >
                    <PairList
                      pairs={getPairsForSelectedYear() || []}
                      year={selectedYearFromState}
                      isLoading={status === "pendingFetchYearPairs"}
                      isCurrentYear={selectedYearFromState === currentYear}
                    />
                  </Paper>
                </Box>
              )}
            </Paper>
          </Box>
        </Box>
        <Snackbar
          open={showResetAlert}
          autoHideDuration={4000}
          onClose={() => setShowResetAlert(false)}
        >
          <Alert
            severity="warning"
            onClose={() => setShowResetAlert(false)}
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
                onClick={() => setShowResetAlert(false)}
                disabled={resettingSource === "alert"}
              >
                Odustani
              </Button>
            </Box>
          </Alert>
        </Snackbar>
    </>
  );
}
