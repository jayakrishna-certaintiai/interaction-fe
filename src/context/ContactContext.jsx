import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import usePinnedData from "../components/CustomHooks/usePinnedData";
import { BaseURL } from "../constants/Baseurl";
import { Authorization_header } from "../utils/helper/Constant";
import { useAuthContext } from "./AuthProvider";
import toast from "react-hot-toast";

export const ContactContext = createContext();

export const ContactProvider = ({ children }) => {
  const { pinnedObject } = usePinnedData();
  const [contactData, setContactData] = useState([]);
  const [employeeData, setEmployeeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortParams, setSortPrams] = useState({ sortField: null, sortOrder: null });
  const [contactFilterOptions, setContactFilterOptions] = useState({});
  const [contactFilterState, setContactFilterState] = useState({
    companyId: [],
    title: [],
    company: [],
    titleName: [],
    phones: [],
  });
  const [clearContactFilterCounter, setClearContactFilterCounter] = useState(0);
  const [contactFilterFields, setContactFilterFields] = useState("");
  const [contactSortFileds, setContactSortFileds] = useState("");
  const [clearContactFilterTrigger, setClearContactFilterTrigger] =
    useState(false);
  const [isContactFilterApplied, setIsContactFilterApplied] = useState(false);
  const [currentState, setCurrentState] = useState(
    pinnedObject?.CONT === "RV" ? "Recently Viewed" : "All Employees"
  );
  const { logout } = useAuthContext();

  // useEffect(() => {
  //   getContactData();
  // }, [sortParams]);

  let sessionExpiredToastShown = false;

  const showSessionExpiredToast = () => {
    if (!sessionExpiredToastShown) {
      toast.error("Session expired, you need to login again");
      sessionExpiredToastShown = true;
  
      // Reset the flag after a few seconds to allow future toasts if needed
      setTimeout(() => {
        sessionExpiredToastShown = false;
      }, 10000); // Adjust delay as needed
    }
  };

  useEffect(() => {
    if (sortParams?.sortField && sortParams?.sortOrder) {
      getContactData();
    }
  }, [sortParams])

  const triggerContactClearFilters = () => {
    setClearContactFilterCounter((prevCounter) => prevCounter + 1);
  };

  const getEmployeeSortParams = ({ sortField, sortOrder }) => {
    switch (sortField) {
      case "Name":
        sortField = "name";
        break;
      case "Employee ID":
        sortField = "employeeId";
        break;
      case "Employement Type":
        sortField = "employementType";
        break;
      case "Employee Title":
        sortField = "employeeTitle";
        break;
      case "Account":
        sortField = "companyName";
        break;
      default:
        sortField = null;
    }
    setSortPrams({ sortField, sortOrder });
  }

  const getContactData = async () => {
    const queryParams = new URLSearchParams();
    setLoading(true);
    if (contactFilterOptions.companyIds) queryParams.append("companyIds", JSON.stringify(contactFilterOptions.companyIds));
    if (contactFilterOptions.employementType) queryParams.append("employementType", contactFilterOptions.employementType);
    if (contactFilterOptions.companyId && contactFilterOptions.companyId.length > 0)
      queryParams.append("companyIds", JSON.stringify(contactFilterOptions.companyId));

    if (contactFilterOptions.employeeTitles && contactFilterOptions.employeeTitles.length > 0)
      queryParams.append("employeeTitles", JSON.stringify(contactFilterOptions.employeeTitles));

    if (contactFilterOptions.phones && contactFilterOptions.phones.length > 0)
      queryParams.append("phones", JSON.stringify(contactFilterOptions.phones));
    currentState === "Recently Viewed" && queryParams.append("recentlyViewed", true);

    if (sortParams?.sortField && sortParams?.sortOrder) {
      queryParams.append("sortField", sortParams?.sortField);
      queryParams.append("sortOrder", sortParams?.sortOrder);
    }
    const queryString = queryParams.toString();
    const finalQueryString = queryString ? `${queryString}` : "";

    const url = `${BaseURL}/api/v1/contacts/${localStorage.getItem(
      "userid"
    )}/1/get-contacts?${finalQueryString}`;

    try {
      if (window.location.pathname !== "/employees") return;
      const response = await axios.get(url, Authorization_header());
      setContactData(response?.data?.data?.list);
      setContactFilterFields(response?.data?.data?.appliedFilter);
      setContactSortFileds(response?.data?.data?.appliedSort);
      setLoading(false);
    } catch (err) {
      setError(error);
      if (error?.response?.data?.logout === true || error?.resposne?.data?.message === "session timed out") {
        // toast.error("Session expired, you need to login again");
        showSessionExpiredToast();
        logout();
      } else {
        // toast.error("Error in fetching Employee data");
        console.error(error);
      }
      setLoading(false);
    }
  };

  const fetchContactData = async (options = {}) => {
    setContactFilterOptions(options);
    const queryParams = new URLSearchParams();
    setLoading(true);
    if (options.companyIds) queryParams.append("companyIds", JSON.stringify(options.companyIds));
    if (options.employementType) queryParams.append("employementType", options.employementType);
    if (options.employementType) queryParams.append("name", options.name);
    if (options.companyId && options.companyId.length > 0)
      queryParams.append("companyIds", JSON.stringify(options.companyId));

    if (options.employeeTitles && options.employeeTitles.length > 0)
      queryParams.append("employeeTitles", JSON.stringify(options.employeeTitles));

    if (options.employementTypes && options.employementTypes.length > 0)
      queryParams.append("employementTypes", JSON.stringify(options.employementTypes));

    //sort
    // if (sortParams?.sortField && sortParams?.sortOrder) {
    //   queryParams.append("sortField", sortParams?.sortField);
    //   queryParams.append("sortOrder", sortParams?.sortOrder);
    // }

    if (options?.sortField != null && options?.sortField) {
      queryParams.append("sortField", options.sortField)
    }
    if (options?.sortOrder != null && options?.sortOrder) {
      queryParams.append("sortOrder", options.sortOrder)
    }
    if (options?.timesheetId !== null && options?.timesheetId) {
      queryParams.append("timesheetId", (options.timesheetId));
    }
    if (options?.projectId !== null && options?.projectId) {
      queryParams.append("projectId", (options.projectId));
    }

    if (sortParams?.sortField && sortParams?.sortOrder) {
      queryParams.append("sortField", sortParams?.sortField);
      queryParams.append("sortOrder", sortParams.sortOrder);
    }

    if (currentState === "Recently Viewed")
      queryParams.append("recentlyViewed", true);
    const queryString = queryParams.toString();
    const finalQueryString = queryString ? `${queryString}` : "";

    const url = `${BaseURL}/api/v1/contacts/${localStorage.getItem("userid")}/1/get-contacts?${finalQueryString}`;

    try {
      if (window.location.pathname !== "/employees") return;
      const response = await axios.get(url, Authorization_header());
      setContactData(response?.data?.data?.list);
      setContactFilterFields(response?.data?.data?.appliedFilter);
      setContactSortFileds(response?.data?.data?.appliedSort)
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
      if (error?.response?.data?.logout === true || error?.resposne?.data?.message === "session timed out") {
        // toast.error("Session expired, you need to login again");
        showSessionExpiredToast();
        logout();
      }
    }
  };


  // const fetchEmployeeData = async (options = {}) => {
  //   const queryParams = new URLSearchParams();
  //   setLoading(true);
  //   if (options.companyIds)
  //     queryParams.append("companyIds", JSON.stringify(options.companyIds));
  //   if (options.nonRnDHoursMin)
  //     queryParams.append("sheetName", options.sheetName);
  //   if (options.nonRnDHoursMax)
  //     queryParams.append("relatedTo", options.relatedTo);

  //   const queryString = queryParams.toString();
  //   const url = `${BaseURL}/api/v1/contacts/get-employee-sheets${queryString ? `?${queryString}` : ""}`;
  //   setContactFilterState(queryString);

  //   try {
  //     const response2 = await axios.get(url, Authorization_header());
  //     setEmployeeData(response2?.data?.data);
  //     setLoading(false);
  //   } catch (error) {
  //     setError(error);
  //     if (error?.response2?.data?.logout === true || error?.resposne2?.data?.message === "") {
  //       logout();
  //     }
  //     setLoading(false);
  //   }
  // };

  return (
    <ContactContext.Provider
      value={{
        contactData,
        // employeeData,
        fetchContactData,
        // fetchEmployeeData,
        loading,
        error,
        contactFilterState,
        setClearContactFilterTrigger,
        setContactFilterState,
        setIsContactFilterApplied,
        clearContactFilterTrigger,
        isContactFilterApplied,
        triggerContactClearFilters,
        clearContactFilterCounter,
        currentState,
        setCurrentState,
        getEmployeeSortParams,
        contactFilterFields,
        contactSortFileds
      }}
    >
      {children}
    </ContactContext.Provider>
  );
};
