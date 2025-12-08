import { Backdrop, CircularProgress, Typography } from "@mui/material";
import { theme } from "../theme";

interface LoadingComponentProps {
  message?: string;
  fullScreen?: boolean;
}

export default function LoadingComponent({ 
  message = "Učitavanje...", 
  fullScreen = true 
}: LoadingComponentProps) {
  
  const content = (
    <>
      <CircularProgress 
        size={fullScreen ? 60 : 40}
        sx={{ 
          color: theme.palette.primary.main,
          mb: fullScreen ? 3 : 2 
        }} 
      />
      {message && (
        <Typography 
          variant={fullScreen ? "h6" : "body1"}
          color="text.secondary"
        >
          {message}
        </Typography>
      )}
    </>
  );

  if (fullScreen) {
    return (
      <Backdrop
        open={true}
        sx={{
          zIndex: theme.zIndex.modal + 1,
          backgroundColor: theme.palette.background.default,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {content}
      </Backdrop>
    );
  }

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px",
    }}>
      {content}
    </div>
  );
}