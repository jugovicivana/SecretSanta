import { Modal, Paper, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PreviousPairs from "./PreviousPairs";
import type { Pair } from "../../../app/models/pair";

interface PreviousPairsModalProps {
  open: boolean;
  onClose: () => void;
  pairs: Pair[]|null;
  userName: string;
}

export default function PreviousPairsModal({ open, onClose, pairs, userName }: PreviousPairsModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="previous-pairs-modal"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Paper
        sx={{
          width: "90%",
          maxWidth: 900,
          maxHeight: "90vh",
          overflow: "auto",
          p: 4,
          borderRadius: 3,
          position: "relative",
        }}
      >
        <Button
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            minWidth: "auto",
            p: 1,
            borderRadius: "50%",
          }}
        >
          <CloseIcon />
        </Button>

        <PreviousPairs pairs={pairs} userName={userName} />
      </Paper>
    </Modal>
  );
}
