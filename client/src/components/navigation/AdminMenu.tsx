import { useNavigate } from "react-router-dom";
import { Box, Button } from "@mui/material";

export default function AdminMenu() {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Button
        onClick={() => navigate("/requests")}
        sx={{
          mr: 2,
          fontWeight: 400,
          fontFamily: "'Montserrat', sans-serif",
          fontSize: "0.95rem",
          color: "white",
          "&:hover": {
            color: "secondary.dark",
            backgroundColor: "rgba(255, 56, 56, 0.5)",
          },
        }}
      >
        Zahtjevi
      </Button>
    </Box>
  );
}
