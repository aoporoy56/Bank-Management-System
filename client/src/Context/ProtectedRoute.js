import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "../Context/UserProvider";

const ProtectedRoute = ({ component: Component }) => {
  const { user } = useUser();
  const location = useLocation();

  if (!user) {
    // Redirect to login with state to preserve the requested location
    return <Navigate to="/customer/login" state={{ from: location }} />;
  }else{
    if(user === "admin"){
      return <Navigate to="/admin" />;
    }
  }

  return <Component />;
};

export default ProtectedRoute;
