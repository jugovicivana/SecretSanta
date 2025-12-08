import { Paper } from "@mui/material";
import PairList from "./PairList";
import type { Pair } from "../../../app/models/pair";

type Props = {
  currentYearPairs: Pair[];
  currentYear: number;
  status: string;
  resettingSource: "pairlist" | "alert" | null;
  handleResetPairs: (source: "pairlist" | "alert") => void;
};

export default function CurrentYearPairs({
  currentYearPairs,
  currentYear,
  status,
  resettingSource,
  handleResetPairs,
}: Props) {
  return (
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
        pairs={currentYearPairs}
        year={currentYear}
        onReset={() => handleResetPairs("pairlist")}
        isCurrentYear={true}
        isLoading={status === "pendingFetchPairs"}
        isResetting={resettingSource === "pairlist"}
      />
    </Paper>
  );
}
