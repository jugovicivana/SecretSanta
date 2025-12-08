import { Box, Button, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

export default function BadRequest() {
  const navigate = useNavigate();
  const { state } = useLocation();

  return (
    <Box textAlign="center" mt={10}>
      <Typography variant="h4" color="error" gutterBottom>
        400 - Neispravan zahtjev
      </Typography>

      <Typography color="text.secondary" mb={3}>
        {state?.error || "Došlo je do greške prilikom slanja podataka."}
      </Typography>

      <Button variant="contained" onClick={() => navigate(-1)}>
        Nazad
      </Button>
    </Box>
  );
}
