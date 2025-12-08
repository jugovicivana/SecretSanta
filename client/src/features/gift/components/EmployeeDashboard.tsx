import {
  Box,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../app/store/configureStore";
import { fetchMyPair, fetchMyPairs } from "../giftSlice";
import GiftAnimation from "./GiftAnimation";
import EmployeeHeader from "./EmployeeHeader";
import CurrentPairCard from "./CurrentPairCard";
import PreviousPairsModal from "./PreviousPairsModal";

interface EmployeeDashboardProps {
  user: {
    firstName: string;
    lastName: string;
  };
}

export default function EmployeeDashboard({ user }: EmployeeDashboardProps) {
  const [showPreviousPairs, setShowPreviousPairs] = useState(false);
  const dispatch = useAppDispatch();
  const { myCurrentPair, myPairs, statusOnePair, statusPairs } = useAppSelector(
    (state) => state.gift
  );
  const currentYear = new Date().getFullYear();

  const isLoadingCurrentPair = statusOnePair === "pendingFetchMyPair";
  const isLoadingPreviousPairs = statusPairs === "pendingFetchMyPairs";

  const previousYearPairs = myPairs
  ? myPairs.filter((p) => p.year !== currentYear)
  : [];


  useEffect(() => {
    dispatch(fetchMyPair());
    dispatch(fetchMyPairs());
  }, [dispatch]);

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
            width: "60%",
          }}
        >
          <EmployeeHeader user={user} />
          <CurrentPairCard
            currentYear={currentYear}
            myCurrentPair={myCurrentPair}
            myPairs={previousYearPairs}
            isLoadingCurrentPair={isLoadingCurrentPair}
            isLoadingPreviousPairs={isLoadingPreviousPairs}
            onShowPreviousPairs={() => setShowPreviousPairs(true)}
          />
          <GiftAnimation />
        </Box>
      </Box>
      <PreviousPairsModal
        open={showPreviousPairs}
        onClose={() => setShowPreviousPairs(false)}
        pairs={previousYearPairs}
        userName={user.firstName}
      />
    </>
  );
}
