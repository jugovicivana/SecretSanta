import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Forbidden() {
  const navigate = useNavigate();

  return (
    <Box textAlign="center" mt={10}>
      <Typography variant="h4" gutterBottom color="error">
        403 - Zabranjen pristup
      </Typography>

      <Typography color="text.secondary" mb={3}>
        Nemate pravo pristupa ovoj stranici.
      </Typography>

      <Button variant="contained" onClick={() => navigate("/")}>
        Nazad na početnu
      </Button>
    </Box>
  );
}
