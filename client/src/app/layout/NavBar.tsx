import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Box,
} from "@mui/material";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import LogoutIcon from "@mui/icons-material/Logout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/configureStore";
import { signOut } from "../../features/account/accountSlice";

function NavBar() {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.account.user);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const dispatch = useAppDispatch();
  console.log(user);
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(signOut());
    // navigate("/login");
    handleMenuClose();
  };

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
              fontFamily: "'Montserrat', 'Roboto', sans-serif",
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

        {user?.role.name === "Admin" && (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {/* <Button
              onClick={() => navigate("/secretsanta")}
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
              Parovi
            </Button> */}
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
        )}

        {/* {user?.role.name === "Employee" && (
          <Button
            startIcon={<CardGiftcardIcon />}
            onClick={() => navigate("/secretsanta")}
            sx={{
              mr: 2,
              fontWeight: 600,
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "0.95rem",
              color: "white",
              "&:hover": {
                color: "secondary.dark",
                backgroundColor: "rgba(255, 56, 56, 0.5)",
              },
            }}
          >
            Moji parovi
          </Button>
        )} */}

        {user ? (
          <>
            <IconButton
              onClick={handleMenuClick}
              sx={{
                p: 0,
                "&:hover": {
                  transform: "scale(1.1)",
                  transition: "transform 0.2s",
                },
              }}
            >
              <Avatar
                sx={{
                  bgcolor: "primary.dark",
                  color: "white",
                  fontWeight: "normal",
                  border: "2px solid rgba(255, 255, 255, 0.3)",
                }}
              >
                {user.firstName.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  minWidth: 180,
                  borderRadius: 2,
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
                  background:
                    "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                },
              }}
            >
              <MenuItem
                onClick={handleLogout}
                sx={{
                  color: "primary.main",
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: "normal",
                  py: 1.5,
                  "&:hover": {
                    color: "primary.dark",
                  },
                }}
              >
                <LogoutIcon sx={{ mr: 1.5, fontSize: 16 }} />
                Odjavi se
              </MenuItem>
            </Menu>
          </>
        ) : (
          <></>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
