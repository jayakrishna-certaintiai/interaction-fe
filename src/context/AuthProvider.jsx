import { CircularProgress, Grid } from "@mui/material";
import React, { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState({
    isLoggedIn: false,
    userInfo: null,
    tokens: null,
    rolesInfo: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedTokens = JSON.parse(localStorage.getItem("tokens"));
    if (storedTokens && storedTokens.accessToken) {
      setAuthState((prevState) => ({
        ...prevState,
        isLoggedIn: true,
        tokens: storedTokens,
      }));
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress sx={{ color: "#FD5707" }} />
      </Grid>
    );
  }

  const login = () => {
    setTimeout(() => {
      logout();
    }, 3600000);
  };

  const logout = () => {
    navigate("/login");
    localStorage.removeItem("tokens");
    localStorage.removeItem("role");
    localStorage.removeItem("userid");
    setAuthState({
      isLoggedIn: false,
      userInfo: null,
      tokens: null,
      rolesInfo: null,
    });
  };

  return (
    <AuthContext.Provider value={{ authState, setAuthState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// export { AuthContext, AuthProvider };
export const useAuthContext = () => useContext(AuthContext);
