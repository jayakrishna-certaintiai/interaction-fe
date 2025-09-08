import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import { BaseURL } from "../constants/Baseurl";
import { Authorization_header } from "../utils/helper/Constant";

const UserRoleManagementContext = createContext();

export const UserRoleManagementProvider = ({ children }) => {
  const [userRolesInfo, setUserRolesInfo] = useState([]);
  const [selectedEditRoleState, setselectedEditRoleState] = useState([]);
  const [selectedAddRoleState, setselectedAddRoleState] = useState([]);
  const [changedPermission, setChangedPermission] = useState([]);

  const fetchUserRolesInfo = async () => {
    if (localStorage.getItem("userid")) {
      try {
        const response = await axios.get(
          `${BaseURL}/api/v1/users/settings/get-roles-info`, Authorization_header()
        );
        setUserRolesInfo(response?.data?.data);
      } catch (error) {
        console.error(error);
      }
    }
  };
  // useEffect(() => {
  //   fetchUserRolesInfo();
  // }, []);

  return (
    <UserRoleManagementContext.Provider
      value={{
        fetchUserRolesInfo,
        userRolesInfo,
        setUserRolesInfo,
        selectedEditRoleState,
        setselectedEditRoleState,
        changedPermission,
        setChangedPermission,
        setselectedAddRoleState,
        selectedAddRoleState,
      }}
    >
      {children}
    </UserRoleManagementContext.Provider>
  );
};
export const useRoleContext = () => useContext(UserRoleManagementContext);
