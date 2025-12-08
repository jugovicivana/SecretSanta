import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <Box textAlign="center" mt={10}>
      <Typography variant="h4" gutterBottom color="warning.main">
        401 - Niste prijavljeni
      </Typography>

      <Typography color="text.secondary" mb={3}>
        Morate biti prijavljeni da biste pristupili ovoj stranici.
      </Typography>

      <Button variant="contained" onClick={() => navigate("/login")}>
        Prijava
      </Button>
    </Box>
  );
}
