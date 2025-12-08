import { CircularProgress } from "@mui/material";
import { LoadingButton } from "@mui/lab";

type Props = {
  text: string;
  loading?: boolean;
};

export default function FormSubmitButton({
  text,
  loading = false,
}: Props) {
  return (
    <LoadingButton
      loading={loading}
      loadingIndicator={
        <CircularProgress size={18} sx={{ color: "text.primary" }} />
      }
      fullWidth={true}
      variant="contained"
      size="large"
      type="submit"
      sx={{
        mt: 3,
        py: 1.5,
        color: "background.default",
        letterSpacing: "0.1rem",
        fontWeight: 600,
        backgroundColor: `primary.main`,
        "&:hover": {
          backgroundColor: `primary.dark`,
        },
      }}
    >
      {text}
    </LoadingButton>
  );
}
