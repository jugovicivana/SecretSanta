
import { CssBaseline, ThemeProvider } from "@mui/material";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useAppDispatch } from "../store/configureStore";
import { fetchCurrentUser } from "../../features/account/accountSlice";
import LoadingComponent from "./LoadingComponent";
import { theme } from "../theme"; 

export default function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const initApp = async () => {
      try {
        await dispatch(fetchCurrentUser());
      } finally {
        setLoading(false);
      }
    };

    initApp();
  }, [dispatch]);

  if (loading) {
    return <LoadingComponent message="Učitavanje aplikacije..." />;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Outlet />
    </ThemeProvider>
  );
}
