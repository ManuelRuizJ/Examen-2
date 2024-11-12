import React, { useState } from "react";
import { Menu } from "./components/Menu";
import { Ordenes } from "./components/Ordenes";
import { LoginForm } from "./components/loginForm";
import { RegisterForm } from "./components/registerForm";
import { logoutUser } from "./services/auth";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    await logoutUser();
    setIsAuthenticated(false);
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
              {" "}
              Cerrar sesión
            </button>
            <Ordenes />
          </>
        )}
      </div>
    </div>
  );
};

export default App;
