import { Box } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import { Email, Lock } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { loginValidationSchema } from "../validations/loginValidation";
import FormTextInput from "./FormTextInput";
import FormSubmitButton from "./FormSubmitButton";
import type { LoginDto } from "../../../app/models/user";

type Props = {
  onSubmit: (data: LoginDto, resetForm: () => void) => void;
  loading: boolean;
};

export default function LoginForm({ onSubmit, loading }: Props) {
  const { control, handleSubmit, reset } = useForm<LoginDto>({
    mode: "onSubmit",
    reValidateMode: "onBlur",
    resolver: yupResolver(loginValidationSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleFormSubmit = (data: LoginDto) => {
    onSubmit(data, () => reset());
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(handleFormSubmit)}
      sx={{ maxWidth: 400, width: "100%" }}
    >
      <FormTextInput
        name="email"
        label="Email"
        type="email"
        control={control}
        icon={<Email sx={{ mr: 1, color: "primary.main" }} />}
      />

      <FormTextInput
        name="password"
        label="Lozinka"
        type="password"
        control={control}
        icon={<Lock sx={{ mr: 1, color: "primary.main" }} />}
      />
      <FormSubmitButton text="Prijava" loading={loading} />
    </Box>
  );
}
