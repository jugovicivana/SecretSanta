import { useAppSelector } from "../../app/store/configureStore";
import LandingPage from "./components/LandingPage";
import AdminDashboard from "./components/AdminDashboard";
import EmployeeDashboard from "./components/EmployeeDashboard";
import { Box } from "@mui/material";

export default function HomePage() {
  const user = useAppSelector((state) => state.account.user);

  if (!user) {
    return <LandingPage />;
  }
  if (user?.role.name === "Admin") {
    return <AdminDashboard />;
  }
  if (user?.role.name === "Employee") {
    return <EmployeeDashboard user={user} />;
  }
  return (
   <Box sx={{ width: "100%", maxWidth: "100%", overflowX: "hidden", p: 3 }}>
      <h1>Dobrodošli, {user.firstName}!</h1>
      <p>Nemate pristup ovom dijelu aplikacije.</p>
    </Box>
  );
}