import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Create a UserContext
const UserContext = createContext();

export const useUser = () => useContext(UserContext);

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null); // Store the user information
  const navigate = useNavigate();
  const [resetMail, setResetMail] = useState(JSON.parse(localStorage.getItem("resetMail")) || null);

  // Simulate fetching user data from localStorage on mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const passwordReset = (resetMail) => {
    localStorage.setItem("resetMail", JSON.stringify(resetMail));
    setResetMail(resetMail);
  };

  const passwordResetDone = () => {
    localStorage.removeItem("resetMail");
    setResetMail(null);
  };

  // Login function
  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData)); // Save to localStorage
    setUser(userData);
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("user"); // Remove from localStorage
    setUser(null);
    navigate("/customer/login"); // Redirect to login page
  };

  // Check if the user is authenticated
  const isAuthenticated = () => !!user;
  

  return (
    <UserContext.Provider value={{ user, login, logout, isAuthenticated, resetMail, setResetMail, passwordReset, passwordResetDone }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
