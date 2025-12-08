import { Box, Typography } from "@mui/material";
import SnowboardingIcon from "@mui/icons-material/Snowboarding";

interface Props{
    user:{
    firstName: string;
    lastName: string;
  };
}
export default function EmployeeHeader({user}:Props){
    return (
        <Box sx={{ mb: 4 }}>
            <SnowboardingIcon
              sx={{
                fontSize: 50,
                color: "#DC0000",
                mb: 2,
                animation: "float 3s ease-in-out infinite",
                "@keyframes float": {
                  "0%, 100%": { transform: "translateY(0px)" },
                  "50%": { transform: "translateY(-5px)" },
                },
              }}
            />
            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                color: "secondary.dark",
                mb: 2,
              }}
            >
              🎄 Srećni praznici, {user.firstName}! 🎅
            </Typography>
            <Typography variant="h6" sx={{ color: "secondary.light" }}>
              Otkrij kome ćeš biti tajni Deda Mraz ove godine!
            </Typography>
          </Box>

    )
}