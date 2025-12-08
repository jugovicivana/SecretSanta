import { Box } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import { Badge, Email, Lock, Person } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import FormTextInput from "./FormTextInput";
import FormSubmitButton from "./FormSubmitButton";
import FormCheckbox from "./FormCheckbox";
import type { RegisterDto, RegisterFormDto } from "../../../app/models/user";
import { registerValidationSchema } from "../validations/registerValidation";

type Props = {
  onSubmit: (data: RegisterDto, resetForm: () => void) => void;
  loading: boolean;
};

export default function RegisterForm({ onSubmit, loading }: Props) {
  const { control, handleSubmit, reset } = useForm<RegisterFormDto>({
    mode: "onSubmit",
    reValidateMode: "onBlur",
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

 const handleFormSubmit = (data: RegisterFormDto) => {
  const registerData: RegisterDto = {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    password: data.password,
    isAdmin: data.isAdmin,
  };
  
  onSubmit(registerData, () => reset());
};
  return (
    <Box
      component="form"
      onSubmit={handleSubmit(handleFormSubmit)}
      sx={{ maxWidth: 400, width: "100%" }}
    >
      <FormTextInput<RegisterFormDto>
        name="firstName"
        label="Ime"
        control={control}
        icon={<Person sx={{ mr: 1, color: "primary.main" }} />}
      />
      <FormTextInput<RegisterFormDto>
        name="lastName"
        label="Prezime"
        control={control}
        icon={<Badge sx={{ mr: 1, color: "primary.main" }} />}
      />
      <FormTextInput<RegisterFormDto>
        name="email"
        label="Email"
        type="email"
        control={control}
        icon={<Email sx={{ mr: 1, color: "primary.main" }} />}
      />

      <FormTextInput<RegisterFormDto>
        name="password"
        label="Lozinka"
        type="password"
        control={control}
        icon={<Lock sx={{ mr: 1, color: "primary.main" }} />}
      />
      <FormTextInput<RegisterFormDto>
        name="confirmPassword"
        label="Potvrdi lozinku"
        type="password"
        control={control}
        icon={<Lock sx={{ mr: 1, color: "primary.main" }} />}
      />
      <FormCheckbox<RegisterFormDto>
        name="isAdmin"
        control={control}
        label="Kreiraj admin nalog"
      />
      <FormSubmitButton text="Registracija" loading={loading} />
    </Box>
  );
}
