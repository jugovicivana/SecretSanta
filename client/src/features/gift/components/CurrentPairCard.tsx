import {
  Box,
  Paper,
} from "@mui/material";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import type { Pair } from "../../../app/models/pair";
import EmptyCurrentPair from "./EmptyCurrentPair";
import CurrentPairDisplay from "./CurrentPairDisplay";
import PreviousPairsButton from "./PreviousPairsButton";

interface CurrentPairCardProps {
  currentYear: number;
  myCurrentPair: Pair | null;
  myPairs: Pair[] | null;
  isLoadingCurrentPair: boolean;
  isLoadingPreviousPairs: boolean;
  onShowPreviousPairs: () => void;
}

export default function CurrentPairCard({
  currentYear,
  myCurrentPair,
  myPairs,
  isLoadingCurrentPair,
  isLoadingPreviousPairs,
  onShowPreviousPairs,
}: CurrentPairCardProps) {
  return (
    <Paper
      elevation={4}
      sx={{
        p: 5,
        background: "linear-gradient(135deg, #ffffff 0%, #fff9f9 100%)",
        borderRadius: 2,
        position: "relative",
        overflow: "hidden",
        border: "2px solid #FF3838",
        minHeight: 100,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: "none",
          backgroundImage:
            "radial-gradient(circle at 20% 80%, rgba(255, 56, 56, 0.1) 0%, transparent 50%)",
        }}
      />
      {isLoadingCurrentPair ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: 1,
          }}
        >
          <LoadingComponent
            message="Učitavam tvoj tekući par..."
            fullScreen={false}
          />
        </Box>
      ) : myCurrentPair ? (
        <CurrentPairDisplay currentYear={currentYear} pair={myCurrentPair} />
      ) : (
        <EmptyCurrentPair />
      )}

      <PreviousPairsButton
        myPairs={myPairs}
        isLoadingPreviousPairs={isLoadingPreviousPairs}
        onShowPreviousPairs={onShowPreviousPairs}
      />
    </Paper>
  );
}
