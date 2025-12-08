import { Box, Typography } from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import type { RegisterDto } from "../../app/models/user";
import { registerUser } from "./accountSlice";
import RegisterForm from "./components/RegisterForm";
import { toast } from "react-toastify";

export default function Register() {
  const navigate = useNavigate();
  const { user, status } = useAppSelector((state) => state.account);
  const dispatch = useAppDispatch();

  const onSubmit = async (data: RegisterDto, resetForm: () => void) => {
    const registerDto: RegisterDto = {
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      isAdmin: data.isAdmin,
    };

    try {
      await dispatch(registerUser(registerDto)).unwrap();
      if (data.isAdmin) {
        toast.info("Nalozi kreirani sa admin statusom moraju biti odobreni.");
      } else
        toast.success("Nalog je kreiran, prijavite se sa svojim podacima.");
      resetForm();
      navigate("/login");
    } catch (error: unknown) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (status === "successRegister" && user) {
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
        minWidth: "100vw",
        minHeight: "calc(100vh - 64px)",
        p: 3,
      }}
    >
      <Typography
        variant="h4"
        sx={{ mb: 4, fontWeight: 600, color: "#050E3C" }}
      >
        Kreirajte novi nalog
      </Typography>
      <RegisterForm
        onSubmit={onSubmit}
        loading={status === "pendingRegister"}
      />
      <Box sx={{ display: "flex", mt: 3, justifyContent: "space-between" }}>
        <Typography sx={{ textAlign: "center", mr: 1.5 }}>
          Već imate nalog?
        </Typography>
        <Typography
          onClick={() => navigate("/login")}
          color="primary"
          sx={{
            fontWeight: 600,
            backgroundColor: "transparent",
            cursor: "pointer",
          }}
        >
          Prijavite se
        </Typography>
      </Box>
    </Box>
  );
}
