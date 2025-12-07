import * as yup from "yup";

export const registerValidationSchema = yup.object().shape({
  email: yup
    .string()
    .required("Email je obavezan.")
    .email("Unesite validnu email adresu.")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Email adresa nije u validnom formatu."
    )
    .max(100, "Email može imati najviše 100 karaktera."),
  password: yup
    .string()
    .required("Lozinka je obavezna.")
    .min(6, "Lozinka mora imati najmanje 6 karaktera.")
    .max(50, "Lozinka može imati najviše 50 karaktera.")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)/,
      "Lozinka mora sadržati bar jedno slovo i jedan broj."
    ),
  confirmPassword: yup
    .string()
    .required("Potvrda lozinke je obavezna.")
    .oneOf([yup.ref("password")], "Lozinke se ne poklapaju."),
  firstName: yup
    .string()
    .required("Ime je obavezno.")
    .min(2, "Ime mora imati najmanje 2 karaktera.")
    .max(50, "Ime može imati najviše 50 karaktera.")
    .matches(
      /^[A-Za-z\sčćžšđČĆŽŠĐ-]+$/,
      "Ime može sadržati samo slova, razmake i crtice."
    ),
  lastName: yup
    .string()
    .required("Prezime je obavezno.")
    .min(2, "Prezime mora imati najmanje 2 karaktera.")
    .max(50, "Prezime može imati najviše 50 karaktera.")
    .matches(
      /^[A-Za-z\sčćžšđČĆŽŠĐ-]+$/,
      "Prezime može sadržati samo slova, razmake i crtice."
    ),
  isAdmin: yup
    .boolean()
    .notRequired()
    // .required("Tip naloga je obavezan.")
});