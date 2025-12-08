import { Box } from "@mui/material";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";

export default function GiftAnimation() {
  return (
    <Box sx={{ mt: 4, display: "flex", justifyContent: "center", gap: 2 }}>
      {[...Array(5)].map((_, i) => (
        <Box
          key={i}
          sx={{
            animation: `bounce ${1.5 + i * 0.2}s infinite ease-in-out`,
            "@keyframes bounce": {
              "0%, 100%": { transform: "translateY(0px)" },
              "50%": { transform: "translateY(-15px)" },
            },
          }}
        >
          <CardGiftcardIcon
            sx={{
              fontSize: 40,
              color:
                i % 3 === 0 ? "#FF3838" : i % 3 === 1 ? "#002455" : "#1B5E20",
            }}
          />
        </Box>
      ))}
    </Box>
  );
}
