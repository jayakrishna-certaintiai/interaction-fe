import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../../context/AuthProvider";
 
const LoginLayout = () => {
    const { authState } = useAuthContext();
 
  if (authState?.isLoggedIn) {
    return <Navigate to="/" />;
  }
 
  return <Outlet />;
};
 
export default LoginLayout;