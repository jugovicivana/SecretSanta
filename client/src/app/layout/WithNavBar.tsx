import { Box } from "@mui/material";
import NavBar from "../../components/navigation/NavBar";
import { Outlet } from "react-router-dom";

export default function WithNavBar() {
  return (
    <Box 
      sx={{ 
        display: "flex", 
        flexDirection: "column", 
        minHeight: "100vh"
      }}
    >
      <NavBar />
      <Box
        sx={{ 
          flex: 1,
          display: "flex",
          overflow: "auto", 
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}