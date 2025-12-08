import { Box, Typography } from "@mui/material";
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
} from "../giftSlice";
import { toast } from "react-toastify";
import GeneratePairs from "./GeneratePairs";
import CurrentYearPairs from "./CurrentYearPairs";
import PreviousYears from "./PreviousYears";
import ResetPairsSnackbar from "./ResetPairsSnackbar";

export default function AdminDashboard() {
  const [resettingSource, setResettingSource] = useState<
    "pairlist" | "alert" | null
  >(null);
  const [showSnack, setShowSnack] = useState(false);
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

  const handleGenerate = async () => {
    if (currentYearPairs && currentYearPairs.length > 0) {
      setShowSnack(true);
      return;
    }
    try {
      await dispatch(generatePairs()).unwrap();
      toast.success("Parovi su uspješno generisani!");
    } catch (error: any) {
      toast.error(error);
    }
  };

  const handleResetPairs = async (source: "pairlist" | "alert") => {
    setResettingSource(source);
    try {
      await dispatch(resetCurrentYearPairs()).unwrap();
      toast.info("Parovi za tekuću godinu su resetovani!");
      setShowSnack(false);
    } catch (error: any) {
      toast.error(error);
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
        <Box
          sx={{
            textAlign: "center",
            width: "100%",
            maxWidth: 800,
            mb: 4,
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 600,
              color: "#050E3C",
              mb: 1,
            }}
          >
            Admin Panel
          </Typography>
          <Typography variant="h6" sx={{ color: "secondary.main" }}>
            Upravljajte Secret Santa organizacijom
          </Typography>
        </Box>
        <Box sx={{ margin: 3 }}>
          <GeneratePairs
            currentYear={currentYear}
            handleGenerate={handleGenerate}
            status={status}
          />
          <CurrentYearPairs
            currentYearPairs={currentYearPairs || []}
            currentYear={currentYear}
            status={status}
            resettingSource={resettingSource}
            handleResetPairs={handleResetPairs}
          />

          <PreviousYears
            filteredYears={filteredYears}
            selectedYearFromState={selectedYearFromState}
            getPairsForSelectedYear={getPairsForSelectedYear}
            handleViewPreviousYear={handleViewPreviousYear}
            status={status}
            currentYear={currentYear}
          />
        </Box>
      </Box>
      <ResetPairsSnackbar
        showResetAlert={showSnack}
        onClose={() => setShowSnack(false)}
        handleResetPairs={handleResetPairs}
        resettingSource={resettingSource}
        currentYear={currentYear}
      />
    </>
  );
}
