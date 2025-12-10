import { Button, CircularProgress } from "@mui/material";
import { Check as CheckIcon, Delete as DeleteIcon } from "@mui/icons-material";

type ActionButtonProps = {
  userId: number;
  isProcessing: boolean; 
  actionType: "approve" | "reject";
  onClick: () => void;
};

export default function ActionButton({
  userId,
  isProcessing,
  actionType,
  onClick,
}: ActionButtonProps) {
  const buttonProps =
    actionType === "approve"
      ? { color: "success" as const, icon: <CheckIcon />, text: "Odobri", spinnerText: "Odobravanje..." }
      : { color: "error" as const, icon: <DeleteIcon />, text: "Odbij", spinnerText: "Odbijanje..." };

  return (
    <Button
      variant={actionType === "approve" ? "contained" : "outlined"}
      color={buttonProps.color}
      size="small"
      startIcon={isProcessing ? <CircularProgress size={20} color="inherit" /> : buttonProps.icon}
      onClick={onClick}
      disabled={isProcessing ? false : undefined}
    >
      {isProcessing ? buttonProps.spinnerText : buttonProps.text}
    </Button>
  );
}
