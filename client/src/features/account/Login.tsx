import {
  Box,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { signInUser } from "./accountSlice";
import { LoadingButton } from "@mui/lab";
import { Email, Lock } from "@mui/icons-material";
import { Controller, useForm, type FieldValues } from "react-hook-form";
import { loginValidationSchema } from "./loginValidation";
import type { LoginDto } from "../../app/models/user";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const navigate = useNavigate();
  const { user, status } = useAppSelector((state) => state.account);
  const dispatch = useAppDispatch();
  const [loginError, setLoginError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { isValid, isDirty },
    reset,
  } = useForm<LoginDto>({
    mode: "onTouched",
    resolver: yupResolver(loginValidationSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

const onSubmit = async (data: FieldValues) => {
  setLoginError(null);
  
try {
  await dispatch(signInUser({ email: data.email, password: data.password })).unwrap();
} catch (error: unknown) {
  let errorMessage = "Neispravan email ili lozinka";
    if (error && typeof error === 'object' && 'error' in error) {
    const typedError = error as { error?: string };
    errorMessage = typedError.error || errorMessage;
  }
  setLoginError(errorMessage);
  reset({ email: data.email, password: "" });
}
};

  useEffect(() => {
    if (status === "succeeded" && user) {
      navigate("/");
    }
  }, [status, user, navigate]);

  return (
    <>
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

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ maxWidth: 400, width: "100%" }}
        >
          <Controller
            name="email"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                fullWidth
                label="Email"
                margin="normal"
                type="email"
                error={!!fieldState.error || !!loginError}
                helperText={fieldState.error?.message}
                InputProps={{
                  startAdornment: <Email sx={{ mr: 1, color: "primary.main" }} />,
                }}
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                fullWidth
                label="Lozinka"
                type="password"
                margin="normal"
                error={!!fieldState.error || !!loginError}
                helperText={fieldState.error?.message}
                InputProps={{
                  startAdornment: <Lock sx={{ mr: 1, color: "primary.main" }} />,
                }}
              />
            )}
          />

          {/* {loginError && (
            <Typography
              color="error"
              variant="body2"
              sx={{ 
                mt: 1, 
                display: 'flex', 
                alignItems: 'center', 
                gap: 0.5,
                backgroundColor: '#fff5f5',
                p: 1,
                borderRadius: 1,
                border: '1px solid #ffcdd2'
              }}
            >
              <ErrorIcon fontSize="small" />
              {loginError}
            </Typography>
          )} */}

          <LoadingButton
            loading={status === "pendingSignIn"}
            loadingIndicator={
              <CircularProgress size={18} sx={{ color: "text.primary" }} />
            }
            fullWidth
            variant="contained"
            size="large"
            type="submit"
            disabled={!isValid || !isDirty}
            sx={{
              mt: 3,
              py: 1.5,
              color: "background.default",
              letterSpacing: "0.1rem",
              fontWeight: 600,
              background: "linear-gradient(45deg, #DC0000 30%, #FF3838 90%)",
              "&:hover": {
                background: "linear-gradient(45deg, #B00000 30%, #DC0000 90%)",
                boxShadow: "0 4px 12px rgba(220, 0, 0, 0.3)",
              },
              "&.Mui-disabled": {
                background: "#e0e0e0",
                color: "#9e9e9e",
              },
            }}
          >
            Prijava
          </LoadingButton>
        </Box>

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
    </>
  );
}