import { Navigate, Outlet, useLocation } from "react-router-dom";
import "./App.css";
import Footer from "./components/Footer";
import NavBar from "./components/NavBar";
import { AuthProvider, useAuth } from "./services/authContext";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";

function AppContent() {
  const location = useLocation();
  const { user } = useAuth();
  const isAdminPage = location.pathname.startsWith("/admin");
  const isProfilePage = location.pathname === "/user_profile";
  const prevPathRef = useRef(location.pathname);

  useEffect(() => {
    // Si l'utilisateur n'est pas admin mais essaie d'accéder à une page admin
    if (isAdminPage && user && !user.is_admin) {
      toast.error(
        "Accès non autorisé : Vous n'avez pas les privilèges administrateur.",
        {
          position: "top-center",
          autoClose: 5000,
          closeOnClick: true,
          pauseOnHover: true,
          hideProgressBar: false,
          theme: "colored",
          style: {
            background: "#FE00EA",
            color: "white",
          },
        },
      );
    }

    // Si l'utilisateur n'est pas connecté et essaie d'accéder à une page admin
    if (isAdminPage && !user && prevPathRef.current === location.pathname) {
      toast.info(
        "Veuillez vous connecter avec un compte administrateur pour accéder à cette page.",
        {
          position: "top-center",
          autoClose: 5000,
          closeOnClick: true,
          pauseOnHover: true,
          hideProgressBar: false,
          theme: "colored",
          style: {
            background: "#9001f5",
            color: "white",
          },
        },
      );
    }

    // Si l'utilisateur n'est pas connecté et essaie d'accéder à la page de profil
    if (isProfilePage && !user && prevPathRef.current === location.pathname) {
      toast.info(
        "Veuillez vous connecter ou créer un compte pour accéder à votre profil.",
        {
          position: "top-center",
          autoClose: 5000,
          closeOnClick: true,
          pauseOnHover: true,
          hideProgressBar: false,
          theme: "colored",
          style: {
            background: "#9001f5",
            color: "white",
          },
        },
      );
    }

    prevPathRef.current = location.pathname;
  }, [isAdminPage, isProfilePage, user, location.pathname]);

  if (isAdminPage) {
    if (!user) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    if (!user.is_admin) {
      return <Navigate to="/" replace />;
    }
  }

  // Redirection pour la page de profil utilisateur si non connecté
  if (isProfilePage && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div>
      <main>
        <Outlet />
      </main>
      {!isAdminPage && (
        <header>
          <NavBar />
        </header>
      )}
      {!isAdminPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
