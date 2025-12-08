import {
  AppBar,
  Toolbar,
  Typography,
  Box,
} from "@mui/material";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../app/store/configureStore";
import AdminMenu from "./AdminMenu";
import UserMenu from "./UserMenu";

function NavBar() {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.account.user);

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "secondary.main",
        background: "linear-gradient(135deg, #002455 0%, #050E3C 100%)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
      }}
    >
      <Toolbar>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexGrow: 1,
            cursor: "pointer",
            "&:hover": { opacity: 0.9 },
          }}
          onClick={() => navigate("/")}
        >
          <CardGiftcardIcon
            sx={{
              fontSize: 32,
              mr: 1.5,
              color: "primary.dark",
              animation: user ? "pulse 2s infinite" : "none",
              "@keyframes pulse": {
                "0%": { transform: "scale(1)" },
                "50%": { transform: "scale(1.1)" },
                "100%": { transform: "scale(1)" },
              },
            }}
          />
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              background: "linear-gradient(45deg, #FF3838 30%, #DC0000 90%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
              letterSpacing: "0.5px",
            }}
          >
            Secret Santa
          </Typography>
        </Box>
        {user?.role.name === "Admin" && <AdminMenu />}
        {user && <UserMenu user={user} />}
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
