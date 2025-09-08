import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BaseURL } from "../../constants/Baseurl";
import { useAuthContext } from "../../context/AuthProvider";
import { FilterListContext } from "../../context/FiltersListContext"; // Adjust the import based on your file structure
import toast, { Toaster } from "react-hot-toast";
const AuthCallback = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { parentFunction } = useContext(FilterListContext);
  const { login, setAuthState } = useAuthContext();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search); // Extract query params
    const authorizationCode = query.get("code"); // Extract the authorization code


    if (authorizationCode) {
      const processAuthorizationCode = async () => {
        setLoading(true);

        try {
          const response = await axios.post(`${BaseURL}/api/v1/auth/callback`, {
            code: authorizationCode, // Send the authorization code to backend
          });
          if (response.data.success) {
            const { rolesInfo, userInfo, tokens } = response?.data?.data?.data;
            login();
            localStorage.setItem(
              "userName",
              userInfo?.firstName + " " + userInfo?.lastName
            );
            localStorage.setItem("userid", userInfo?.userId);
            localStorage.setItem("tokens", JSON.stringify(tokens));
            localStorage.setItem(
              "role",
              JSON.stringify({
                isLoggedIn: true,
                userInfo,
                tokens,
                rolesInfo,
              })
            );
            setAuthState({
              isLoggedIn: true,
              userInfo,
              tokens,
              rolesInfo,
            });
            navigate("/");
            parentFunction();
            // fetchAlertData();
            toast.dismiss();
          } else {
            navigate("/error"); // Redirect to error page
          }
        } catch (error) {
          console.error("Error during token processing:1", error);
          navigate("/error");
        } finally {
          setLoading(false);
        }
      };

      processAuthorizationCode();
    } else {
      navigate("/error"); // Handle case where code is missing
    }
  }, [navigate, parentFunction, setAuthState]);

  return (
    <div>{loading ? <h1>Authenticating...</h1> : <h1>Redirecting...</h1>}</div>
  );
};

export default AuthCallback;
