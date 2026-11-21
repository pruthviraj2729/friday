import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { ThemeProvider } from "./app/ThemeContext.jsx";
import { refreshSession, setAccessToken } from "./features/auth/api/authApi.js";
import { setAuthenticated, setGuest } from "./features/auth/state/authSlice.js";
import { useAuth } from "./features/auth/hooks/useAuth.js";
import LoginPage from "./features/auth/ui/LoginPage.jsx";
import RegisterPage from "./features/auth/ui/RegisterPage.jsx";
import Workspace from "./features/auth/ui/Workspace.jsx";

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
}

function AppRoutes() {
  const { status } = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    let active = true;
    refreshSession()
      .then(({ accessToken, user }) => {
        if (!active) return;
        setAccessToken(accessToken);
        dispatch(setAuthenticated({ user, accessToken }));
      })
      .catch(() => {
        if (!active) return;
        setAccessToken(null);
        dispatch(setGuest());
      });
    return () => { active = false; };
  }, [dispatch]);

  if (status === "loading") {
    return <main className="grid min-h-screen place-items-center bg-paper"><span className="text-sm text-muted">Opening your Friday...</span></main>;
  }

  const isAuthenticated = status === "authenticated";
  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/workspace" replace /> : <LoginPage />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/workspace" replace /> : <RegisterPage />} />
      <Route path="/workspace" element={isAuthenticated ? <Workspace /> : <Navigate to="/login" replace />} />
      <Route path="/" element={<Navigate to={isAuthenticated ? "/workspace" : "/login"} replace />} />
      <Route path="*" element={<Navigate to={isAuthenticated ? "/workspace" : "/login"} replace />} />
    </Routes>
  );
}
