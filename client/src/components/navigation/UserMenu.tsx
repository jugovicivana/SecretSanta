import LogoutIcon from "@mui/icons-material/Logout";
import { Avatar, Menu, MenuItem, IconButton } from "@mui/material";
import { useState } from "react";
import { useAppDispatch } from "../../app/store/configureStore";
import { signOut } from "../../features/account/accountSlice";
import type { User } from "../../app/models/user";

interface MenuProps {
  user: User;
}
export default function UserMenu({ user }: MenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const dispatch = useAppDispatch();
  const handleLogout = () => {
    dispatch(signOut());
    setAnchorEl(null);
  };
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  return (
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
        onClose={() => setAnchorEl(null)}
        PaperProps={{
          sx: {
            mt: 1.5,
            minWidth: 180,
            borderRadius: 2,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
            background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
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
  );
}
