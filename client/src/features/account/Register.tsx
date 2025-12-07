import {
  Box,
  CircularProgress,
  Link,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
  Alert,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { LoadingButton } from "@mui/lab";
import { Person, Lock, Email, Badge } from "@mui/icons-material";
import type { RegisterDto } from "../../app/models/user";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller, type FieldValues } from "react-hook-form";
import { registerValidationSchema } from "./registerValidation";
import { registerUser } from "./accountSlice";

export default function Register() {
  const navigate = useNavigate();
  const { user, status } = useAppSelector((state) => state.account);
  const dispatch = useAppDispatch();

  const methods = useForm({
    mode: "all",
    resolver: yupResolver(registerValidationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      isAdmin: false,
    },
  });
  const {
    control,
    setValue,
    setError,
    register,
    formState: { errors },
  } = methods;

  const onSubmit = (data: FieldValues) => {
    const registerDto: RegisterDto = {
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      isAdmin: data.isAdmin,
    };

    dispatch(registerUser(registerDto));
    navigate("/login");
  };

  useEffect(() => {
    if (status === "succeeded" && user) {
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

      <Box
        component="form"
        onSubmit={methods.handleSubmit(onSubmit)}
        sx={{ maxWidth: 400, width: "100%" }}
      >
        <Controller
          name="firstName"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              fullWidth
              label="Ime"
              margin="normal"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              InputProps={{
                startAdornment: (
                  <Person sx={{ mr: 1, color: "primary.main" }} />
                ),
              }}
            />
          )}
        />
        <Controller
          name="lastName"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              fullWidth
              label="Prezime"
              margin="normal"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              InputProps={{
                startAdornment: <Badge sx={{ mr: 1, color: "primary.main" }} />,
              }}
            />
          )}
        />
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              fullWidth
              label="Email"
              type="email"
              margin="normal"
              error={!!fieldState.error}
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
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              InputProps={{
                startAdornment: <Lock sx={{ mr: 1, color: "primary.main" }} />,
              }}
            />
          )}
        />
        <Controller
          name="confirmPassword"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              fullWidth
              label="Potvrdi lozinku"
              type="password"
              margin="normal"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              InputProps={{
                startAdornment: <Lock sx={{ mr: 1, color: "primary.main" }} />,
              }}
            />
          )}
        />
        <Controller
          name="isAdmin"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={<Checkbox {...field} color="primary" />}
              label="Kreiraj admin nalog"
              sx={{ mt: 1 }}
            />
          )}
        />

        <LoadingButton
          loading={status === "pendingRegister"}
          loadingIndicator={
            <CircularProgress size={18} sx={{ color: "text.primary" }} />
          }
          fullWidth
          variant="contained"
          size="large"
          type="submit"
          disabled={!methods.formState.isValid}
          sx={{
            mt: 3,
            py: 1.5,
            color: "background.default",
            letterSpacing: "0.1rem",
            fontWeight: 600,
            background: "linear-gradient(45deg, #002455 30%, #050E3C 90%)",
            "&:hover": {
              background: "linear-gradient(45deg, #050E3C 30%, #002455 90%)",
            },
            "&.Mui-disabled": {
              background: "#e0e0e0",
              color: "#9e9e9e",
            },
          }}
        >
          Registruj se
        </LoadingButton>
      </Box>

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
