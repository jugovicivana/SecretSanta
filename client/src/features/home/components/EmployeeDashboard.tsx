import {
  Box,
  Typography,
  Button,
  Paper,
  Container,
  Fade,
  Modal,
  CircularProgress,
} from "@mui/material";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import HistoryIcon from "@mui/icons-material/History";
import CelebrationIcon from "@mui/icons-material/Celebration";
import CloseIcon from "@mui/icons-material/Close";
import SnowboardingIcon from "@mui/icons-material/Snowboarding";
import PreviousPairs from "../../gift/PreviousPairs";
import type { Pair } from "../../../app/models/pair";
import { useEffect, useState } from "react";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../app/store/configureStore";
import { fetchMyPair, fetchMyPairs } from "../../gift/giftSlice";
import LoadingComponent from "../../../app/layout/LoadingComponent";

interface EmployeeDashboardProps {
  user: {
    firstName: string;
    lastName: string;
  };
}

export default function EmployeeDashboard({ user }: EmployeeDashboardProps) {
  const [showPreviousPairs, setShowPreviousPairs] = useState(false);
  const dispatch = useAppDispatch();
  const { myCurrentPair, myPairs, statusOnePair, statusPairs } = useAppSelector((state) => state.gift);
  const currentYear = new Date().getFullYear();
  
  // LOADING STATE samo za tekući par
  const isLoadingCurrentPair = statusOnePair === "pendingFetchMyPair";
  
  // LOADING STATE za prethodne parove
  const isLoadingPreviousPairs = statusPairs === "pendingFetchMyPairs";



  useEffect(() => {
    dispatch(fetchMyPair());
    dispatch(fetchMyPairs());
  }, [dispatch]);

  const handleShowPreviousPairs = () => {
    setShowPreviousPairs(true);
  };

  const handleCloseModal = () => {
    setShowPreviousPairs(false);
  };

  //  // INICIJALNI LOADING (ceo ekran)
  // if (isLoadingInitial) {
  //   return <LoadingComponent message="Učitavam tvoje parove..." fullScreen={true} />;
  // }

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
            // display: "flex",
            // flexDirection: "column",
            // justifyContent: "center",
            // alignItems: "center",
            textAlign: "center",
            width: "60%",
          }}
        >
          <Box sx={{ mb: 4 }}>
            <SnowboardingIcon
              sx={{
                fontSize: 70,
                color: "#DC0000",
                mb: 2,
                animation: "float 3s ease-in-out infinite",
                "@keyframes float": {
                  "0%, 100%": { transform: "translateY(0px)" },
                  "50%": { transform: "translateY(-10px)" },
                },
              }}
            />
            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                color: "secondary.dark",
                mb: 2,
                fontFamily: "'Montserrat', sans-serif",
              }}
            >
              🎄 Srećni praznici, {user.firstName}! 🎅
            </Typography>
            <Typography variant="h6" sx={{ color: "secondary.light" }}>
              Otkrij kome ćeš biti tajni Deda Mraz ove godine!
            </Typography>
          </Box>

          <Paper
            elevation={4}
            sx={{
              p: 5,
              background: "linear-gradient(135deg, #ffffff 0%, #fff9f9 100%)",
              borderRadius: 2,
              position: "relative",
              overflow: "hidden",
              border: "2px solid #FF3838",
              minHeight:300,
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
             {/* LOADING ZA TEKUĆI PAR - ISPOD NASLOVA */}
            {isLoadingCurrentPair ? (
              <Box sx={{ 
                display: "flex", 
                flexDirection: "column", 
                alignItems: "center", 
                justifyContent: "center",
                py: 6 
              }}>
                <LoadingComponent 
                  message="Učitavam tvoj tekući par..." 
                  fullScreen={false} 
                />
              </Box>
            ) : myCurrentPair ? (
              <>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: "#050E3C",
                    mb: 2,
                  }}
                >
                  🎁 Tvoj tajni poklon u {currentYear}. godini prima...
                </Typography>
                <Paper
                  elevation={6}
                  sx={{
                    p: 4,
                    my: 3,
                    background:
                      "linear-gradient(45deg, #002455 30%, #050E3C 90%)",
                    color: "white",
                    borderRadius: 3,
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 600,
                      fontFamily: "'Montserrat', sans-serif",
                      background:
                        "linear-gradient(45deg, #FF3838 30%, #FF8A80 90%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {myCurrentPair?.receiver.firstName}{" "}
                    {myCurrentPair?.receiver.lastName}{" "}
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1, opacity: 0.9, color:'white' }}>
                    {myCurrentPair?.receiver.email}{" "}
                  </Typography>
                </Paper>{" "}
              </>
            ) : (
               <Box sx={{ textAlign: "center", py: 6 }}>
                <Typography variant="h6" sx={{ color: "#050E3C", mb: 1 }}>
                  🎄
                </Typography>
                <Typography sx={{ color: "secondary.main" }}>
                  Još uvijek nisu generisani parovi za tekuću godinu.
                </Typography>
              </Box>
            )}
             <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 2,
                flexWrap: "wrap",
                mt: 4,
              }}
            >
              <Button
                variant="outlined"
                size="medium"
                startIcon={<HistoryIcon />}
                onClick={handleShowPreviousPairs}
                disabled={isLoadingPreviousPairs
                  //  || !myPairs || myPairs.length === 0
                  }
                sx={{
                  borderColor: "secondary.main",
                  backgroundColor: "white",
                  color: "#1B5E20",
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  "&:hover": {
                    borderColor: "primary.dark",
                    backgroundColor: "#877e7eff",
                  },
                  "&.Mui-disabled": {
                    color: "text.disabled",
                    borderColor: "action.disabled",
                  },
                }}
              >
                {isLoadingPreviousPairs ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1, color: "#1B5E20" }} />
                    Učitavam...
                  </>
                ) : (
                  `Moji prethodni parovi ${myPairs && myPairs.length > 0 ? `(${myPairs.length})` : ''}`
                )}
              </Button>
            </Box>
          </Paper>
          <GiftAnimation />
        </Box>
      </Box>

      <Modal
        open={showPreviousPairs}
        onClose={handleCloseModal}
        aria-labelledby="previous-pairs-modal"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
      >
        <Paper
          sx={{
            width: "90%",
            maxWidth: 900,
            maxHeight: "90vh",
            overflow: "auto",
            p: 4,
            borderRadius: 3,
            position: "relative",
          }}
        >
          {/* CLOSE BUTTON */}
          <Button
            onClick={handleCloseModal}
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              minWidth: "auto",
              p: 1,
              borderRadius: "50%",
            }}
          >
            <CloseIcon />
          </Button>

          {/* SADRŽAJ */}
          <PreviousPairs pairs={myPairs} userName={user.firstName} />
        </Paper>
      </Modal>
    </>
  );
}

function GiftAnimation() {
  return (
    <Box sx={{ mt: 4, display: "flex", justifyContent: "center", gap: 2 }}>
      {[...Array(5)].map((_, i) => (
        <Box
          key={i}
          sx={{
            animation: `bounce ${1.5 + i * 0.2}s infinite ease-in-out`,
            "@keyframes bounce": {
              "0%, 100%": { transform: "translateY(0px)" },
              "50%": { transform: "translateY(-15px)" },
            },
          }}
        >
          <CardGiftcardIcon
            sx={{
              fontSize: 40,
              color:
                i % 3 === 0 ? "#FF3838" : i % 3 === 1 ? "#002455" : "#1B5E20",
            }}
          />
        </Box>
      ))}
    </Box>
  );
}
