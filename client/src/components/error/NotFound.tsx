import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Box textAlign="center" mt={10}>
      <Typography variant="h2" color="error">
        404
      </Typography>
      <Typography variant="h5" gutterBottom>
        Stranica nije pronađena
      </Typography>
      <Typography color="text.secondary" mb={3}>
        URL koji ste unijeli ne postoji.
      </Typography>

      <Button variant="contained" onClick={() => navigate("/")}>
        Nazad na početnu
      </Button>
    </Box>
  );
}
