import { Box, Typography, Button, Paper, Container, Zoom } from "@mui/material";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        width:'100%',
        background:
          "linear-gradient(135deg, #050E3C 0%, #002455 50%, #0f4b13ff 100%)",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage:
            "radial-gradient(circle at 20% 50%, rgba(255, 56, 56, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(27, 94, 32, 0.1) 0%, transparent 50%)",
        },
      }}
    >
      <Container maxWidth="md">
        <Zoom in={true} style={{ transitionDelay: "100ms" }}>
          <Paper
            elevation={24}
            sx={{
              p: { xs: 3, md: 6 },
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
              borderRadius: 4,
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
            }}
          >
            <Box sx={{ mb: 4 }}>
              <CardGiftcardIcon
                sx={{
                  fontSize: 80,
                  color: "#DC0000",
                  mb: 2,
                  animation: "pulse 2s infinite",
                  "@keyframes pulse": {
                    "0%, 100%": { transform: "scale(1)" },
                    "50%": { transform: "scale(1.1)" },
                  },
                }}
              />
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 800,
                  fontFamily: "'Montserrat', sans-serif",
                  background:
                    "linear-gradient(45deg, #DC0000 30%, #FF3838 90%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: 2,
                }}
              >
                Secret Santa App
              </Typography>
              <Typography
                variant="h5"
                sx={{ mb: 3, color: "#002455", fontWeight: 500 }}
              >
                🎁 Magija poklanjanja u kompaniji 🎄
              </Typography>
            </Box>
            <Typography
              variant="body1"
              sx={{
                mb: 4,
                fontSize: "1.1rem",
                lineHeight: 1.7,
                color: "#050E3C",
              }}
            >
              Dobro došli u digitalno doba tajnog Deda Mraza! Aplikacija
              omogućava organizaciju poklanjanja unutar vaše kompanije na
              zabavan način. Prijavite se da biste otkrili detalje!
            </Typography>

            <Box
              sx={{ display: "flex", justifyContent: "center", gap: 3, mt: 4 }}
            >
              <Button
                variant="contained"
                size="medium"
                onClick={() => navigate("/login")}
                sx={{
                  background:
                    "linear-gradient(45deg, #DC0000 30%, #FF3838 90%)",
                  px: 4,
                  py: 1.5,
                  fontSize: "0.95rem",
                  fontWeight: 400,
                  borderRadius: 2,
                }}
              >
                🎅 Prijavi se
              </Button>
              <Button
                variant="outlined"
                size="medium"
                onClick={() => navigate("/register")}
                sx={{
                  borderColor: "#002455",
                  color: "#002455",
                  px: 4,
                  py: 1.5,
                  fontSize: "0.95rem",
                  fontWeight: 400,
                  borderRadius: 2,
                  backgroundColor: "white",
                  "&:hover": {
                    color: "primary.dark",
                    backgroundColor: "white",
                  },
                }}
              >
                Registruj se
              </Button>
            </Box>
            <Typography
              variant="caption"
              sx={{
                display: "block",
                mt: 4,
                color: "#666",
                fontStyle: "italic",
              }}
            >
              🎄 Prijavi se da otkriješ kome ćeš biti tajni Deda Mraz ove
              godine! 🎁
            </Typography>
          </Paper>
        </Zoom>
      </Container>
    </Box>
  );
}

