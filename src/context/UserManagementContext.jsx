import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import { BaseURL } from "../constants/Baseurl";
import { Authorization_header } from "../utils/helper/Constant";
import { useAuthContext } from "./AuthProvider";

export const UserManagementContext = createContext();

export const UserManagementProvider = ({ children }) => {
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [clearUserFilterCounter, setClearUserFilterCounter] = useState(0);
  const [userFilterState, setUserFilterState] = useState({
    clients: [],
    title: [],
    role: [],
    status: "",
    clientName: "",
    titleName: "",
    roleType: "",
    statusType: "",
  });

  const [clearUserFilterTrigger, setClearUserFilterTrigger] = useState(false);
  const [isUserFilterApplied, setIsUserFilterApplied] = useState(false);
  const { logout } = useAuthContext();

  const triggerUserClearFilters = () => {
    setClearUserFilterCounter((prevCounter) => prevCounter + 1);
  };

  // const fetchUsers = async (options = {}) => {
  //   const queryParams = new URLSearchParams();

  //   if (options.clients)
  //     queryParams.append("accounts", JSON.stringify(options.clients));
  //   if (options.title)
  //     queryParams.append("title", JSON.stringify(options.title));
  //   if (options.role) queryParams.append("role", JSON.stringify(options.role));
  //   if (options.status) queryParams.append("status", options.status);

  //   const queryString = queryParams.toString();
  //   const finalQueryString = queryString ? `${queryString}` : "";
  //   const url = `${BaseURL}/api/v1/users/${localStorage.getItem(
  //     "userid"
  //   )}/get-users-by-filter?${finalQueryString}`;

  //   try {
  //     const response = await axios.get(url);
  //     setUserList(response?.data?.data);
  //     setLoading(false);
  //   } catch (error) {
  //     setError(error);
  //     setLoading(false);
  //   }
  // };
  const fetchUsers = async () => {
    if (localStorage.getItem("userid")) {
      try {
        const response = await axios.get(
          `${BaseURL}/api/v1/users/${localStorage.getItem(
            "userid"
          )}/1/get-user-list`, Authorization_header()
        );
        setUserList(response?.data?.data);
      } catch (error) {
        if (error?.response?.data?.logout === true) {
          logout();
        }
        console.error(error);
      }
    }
  };

  // useEffect(() => {
  //   fetchUsers();
  // }, []);

  return (
    <UserManagementContext.Provider
      value={{
        fetchUsers,
        userList,
        loading,
        error,
        setUserList,
        clearUserFilterCounter,
        userFilterState,
        setUserFilterState,
        clearUserFilterTrigger,
        setClearUserFilterTrigger,
        isUserFilterApplied,
        setIsUserFilterApplied,
        triggerUserClearFilters,
      }}
    >
      {children}
    </UserManagementContext.Provider>
  );
};
