import * as yup from "yup";

export const loginValidationSchema = yup.object().shape({
  email: yup
    .string()
    .required("Email je obavezan.")
    .email("Unesite validnu email adresu.")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Email adresa nije u validnom formatu."
    ),
  password: yup
    .string()
    .required("Lozinka je obavezna.")
});