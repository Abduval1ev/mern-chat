import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import useThemeStore from "../store/useThemeStore";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import { Header } from "../components";

export default function Layout() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";

  if (!authUser && !isAuthPage) {
    return <Navigate to="/login" />;
  }

  if (authUser && isAuthPage) {
    return <Navigate to="/" />;
  }

  return (
    <main data-theme={theme}>
      <Header />
      <Outlet />
      <Toaster />
    </main>
  );
}
