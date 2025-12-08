import { Box, Typography } from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { signInUser } from "./accountSlice";
import type { LoginDto } from "../../app/models/user";
import LoginForm from "./components/LoginForm";
import { toast } from "react-toastify";

export default function Login() {
  const navigate = useNavigate();
  const { user, status } = useAppSelector((state) => state.account);
  const dispatch = useAppDispatch();

  const onSubmit = async (data: LoginDto, resetForm: () => void) => {
    try {
      await dispatch(
        signInUser({ email: data.email, password: data.password })
      ).unwrap();
      resetForm();
    } catch (error: any) {
      toast.error(error);
      resetForm();
    }
  };

  useEffect(() => {
    if (status === "successLogin" && user) {
      navigate("/");
    }
  }, [status, user, navigate]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
        minHeight: "calc(100vh - 64px)",
        p: 3,
      }}
    >
      <Typography
        variant="h4"
        sx={{ mb: 4, fontWeight: 600, color: "#050E3C" }}
      >
        Prijavite se
      </Typography>
      <LoginForm onSubmit={onSubmit} loading={status === "pendingSignIn"} />
      <Box sx={{ display: "flex", mt: 3, justifyContent: "space-between" }}>
        <Typography sx={{ textAlign: "center", mr: 1.5 }}>
          Nemate nalog?
        </Typography>
        <Typography
          onClick={() => navigate("/register")}
          color="primary"
          sx={{
            fontWeight: 600,
            backgroundColor: "transparent",
            cursor: "pointer",
          }}
        >
          Registrujte se
        </Typography>
      </Box>
    </Box>
  );
}
