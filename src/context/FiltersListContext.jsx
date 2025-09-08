import axios from "axios";
import React, { createContext, useState } from "react";
import { BaseURL } from "../constants/Baseurl";
import { Authorization_header } from "../utils/helper/Constant";
import { useAuthContext } from "./AuthProvider";

export const FilterListContext = createContext();

export const FilterListProvider = ({ children }) => {
  const [timesheetList, setTimesheetList] = useState([]);
  const [clientList, setClientList] = useState([]);
  const [contactList, setContactList] = useState([]);
  const [caseList, setCaseList] = useState([]);
  const [userDetails, setUserDetails] = useState([]);
  const [userRolesList, setUserRolesList] = useState([]);
  const [workbenchList, setWorkbenchList] = useState([]);
  const [documentList, setDocumentList] = useState([]);
  const [projectList, setProjectList] = useState([]);
  const [pinString, setPinString] = useState(null);
  const { logout } = useAuthContext();

  const fetchTimesheetList = async () => {
    if (localStorage.getItem("userid")) {
      try {
        const response = await axios.get(
          `${BaseURL}/api/v1/timesheets/${localStorage.getItem(
            "userid"
          )}/1/timesheet-logs`, Authorization_header()
        );
        setTimesheetList(response?.data?.data?.list);
      } catch (error) {
        if (error?.response?.data?.logout === true) {
          logout();
        }
        console.error(error);
      }
    }
  };

  const fetchClientList = async () => {
    if (localStorage.getItem("userid")) {
      try {
        const response = await axios.get(
          `${BaseURL}/api/v1/company/${localStorage.getItem(
            "userid"
          )}/get-company-list`, Authorization_header()
        );
        setClientList(response?.data?.data?.list);
      } catch (error) {
        if (error?.response?.data?.logout === true) {
          logout();
        }
        console.error(error);
      }
    }
  };

  const fetchContactList = async () => {
    if (localStorage.getItem("userid")) {
      try {
        const response = await axios.get(
          `${BaseURL}/api/v1/contacts/${localStorage.getItem(
            "userid"
          )}/1/get-contacts`, Authorization_header()
        );
        setContactList(response?.data?.data?.list);


      } catch (error) {
        if (error?.response?.data?.logout === true) {
          logout();
        }
        console.error(error);
      }
    }
  };

  const fetchUserDetails = async () => {
    if (localStorage.getItem("userid")) {
      try {
        const response = await axios.get(
          `${BaseURL}/api/v1/users/${localStorage.getItem(
            "userid"
          )}/1/get-user-details?userIds=["${localStorage.getItem("userid")}"]`, Authorization_header()
        );
        setUserDetails(response?.data?.data);
        setPinString(response?.data?.data[0].pin);
      } catch (error) {
        if (error?.response?.data?.logout === true) {
          logout();
        }
        console.error(error);
      }
    }
  };

  // const fetchUserRolesList = async () => {
  //   try {
  //     const response = await axios.get(
  //       `${BaseURL}/api/v1/users/settings/get-roles-list`, Authorization_header()
  //     );
  //     setUserRolesList(response?.data?.data);
  //   } catch (error) {
  //     if (error?.response?.data?.logout === true) {
  //       logout();
  //     }
  //     console.error(error);
  //   }
  // };

  // const fetchWorkbenchList = async () => {
  //   try {
  //     const response = await axios.get(
  //       `${BaseURL}/api/v1/reconciliations/${localStorage.getItem(
  //         "userid"
  //       )}/1/get-reconciliations`, Authorization_header()
  //     );
  //     setWorkbenchList(response?.data?.data);
  //   } catch (error) {
  //     if (error?.response?.data?.logout === true) {
  //       logout();
  //     }
  //     console.error(error);
  //   }
  // };

  const fetchDocumentList = async () => {
    try {
      const response = await axios.get(
        `${BaseURL}/api/v1/documents/${localStorage.getItem("userid")}/get-docs`, Authorization_header()
      );
      setDocumentList(response?.data?.data?.list);
    } catch (error) {
      if (error?.response?.data?.logout === true) {
        logout();
      }
      console.error(error);
    }
  };

  const fetchProjectList = async () => {
    try {
      const response = await axios.get(
        `${BaseURL}/api/v1/projects/${localStorage.getItem(
          "userid"
        )}/a0ds/get-projects`, Authorization_header()
      );
      setProjectList(response?.data?.data?.list);
    } catch (error) {
      if (error?.response?.data?.logout === true) {
        logout();
      }
      console.error(error);
    }
  };
  const fetchAccountList = async () => {
    try {
      const response = await axios.get(
        `${BaseURL}/api/v1/company/${localStorage.getItem("userid")}/get-company-list`, Authorization_header()
      );
      setClientList(response?.data?.data?.list);
    } catch (error) {
      if (error?.response?.data?.logout === true) {
        logout();
      }
      console.error(error);
    }
  };
  const fetchCaseList = async () => {
    try {
      const response = await axios.get(
        `${BaseURL}/api/v1/case/${localStorage.getItem("userid")}/cases`, Authorization_header()
      );
      setCaseList(response?.data?.data?.list);
    } catch (error) {
      if (error?.response?.data?.logout === true) {
        logout();
      }
      console.error(error);
    }
  };

  const parentFunction = () => {
    fetchTimesheetList();
    // fetchClientList();
    fetchContactList();
    fetchUserDetails();
    fetchAccountList();
    fetchCaseList();
    // fetchUserRolesList();
    // fetchWorkbenchList();
    fetchDocumentList();
    fetchProjectList();
  };

  return (
    <FilterListContext.Provider
      value={{
        fetchTimesheetList,
        timesheetList,
        fetchClientList,
        clientList,
        fetchContactList,
        fetchAccountList,
        contactList,
        caseList,
        fetchUserDetails,
        userDetails,
        userRolesList,
        fetchCaseList,
        // fetchUserRolesList,
        setWorkbenchList,
        workbenchList,
        // fetchWorkbenchList,
        setDocumentList,
        documentList,
        fetchDocumentList,
        setProjectList,
        projectList,
        fetchProjectList,
        pinString,
        setPinString,
        parentFunction,
      }}
    >
      {children}
    </FilterListContext.Provider>
  );
};
