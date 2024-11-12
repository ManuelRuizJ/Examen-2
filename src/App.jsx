import React, { useState, useEffect } from "react";
import { Menu } from "./components/Menu";
import { Ordenes } from "./components/Ordenes";
import { LoginForm } from "./components/loginForm";
import { RegisterForm } from "./components/registerForm";
import { logoutUser } from "./services/auth";

const SESSION_DURATION = 60 * 60 * 1000;

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    const sessionData = localStorage.getItem("sessionData");
    if (sessionData) {
      const { isAdmin, timestamp } = JSON.parse(sessionData);
      const now = Date.now();
      if (now - timestamp < SESSION_DURATION) {
        setIsAuthenticated(true);
        setIsAdmin(isAdmin);
      } else {
        localStorage.removeItem("sessionData");
      }
    }
  }, []);

  const handleLoginSuccess = (role) => {
    if (!role) {
      console.error("Rol no definido para el usuario.");
      return;
    }

    setIsAuthenticated(true);
    setIsAdmin(role === "admin");

    const sessionData = {
      isAdmin: role === "admin",
      timestamp: Date.now(),
    };
    localStorage.setItem("sessionData", JSON.stringify(sessionData));
  };

  const handleLogout = async () => {
    await logoutUser();
    setIsAuthenticated(false);
    setIsAdmin(false);
    localStorage.removeItem("sessionData");
  };

  const toggleRegister = () => {
    setShowRegister((prev) => !prev);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 max-w-5xl w-full mx-auto shadow-xl rounded-lg">
        {!isAuthenticated ? (
          showRegister ? (
            <RegisterForm onBackToLogin={toggleRegister} />
          ) : (
            <LoginForm
              onLoginSuccess={handleLoginSuccess}
              onRegisterClick={toggleRegister}
            />
          )
        ) : (
          <>
            <button
              onClick={handleLogout}
              className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded"
            >
              Cerrar sesión
            </button>
            {isAdmin ? (
              <Ordenes /> // Componente para administradores
            ) : (
              <Menu /> // Componente para usuarios normales
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default App;
