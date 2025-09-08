import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import usePinnedData from "../components/CustomHooks/usePinnedData";
import { BaseURL } from "../constants/Baseurl";
import { Authorization_header } from "../utils/helper/Constant";
import { useAuthContext } from "./AuthProvider";
import toast from "react-hot-toast";

let sessionExpiredToastShown = false;

export const ClientContext = createContext();

export const ClientProvider = ({ children }) => {
  const { pinnedObject } = usePinnedData();
  const [clientData, setClientData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sortParams, setSortPrams] = useState({ sortField: null, sortOrder: null });
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [clientFilters, setClientFilters] = useState({
    billingCountry: [],
    companyId: [],
    company: [],
    emails: [],
    phones: [],
    projectsCount: [0, null],
    totalProjectCost: [0, null],
    totalRnDCost: [0, null],
  });

  const [clientFilterOptions, setClientFilterOptions] = useState({});
  const [clearClientFilterTrigger, setClearClientFilterTrigger] =
    useState(false);
  const [isClientFilterApplied, setIsClientFilterApplied] = useState(false);
  const [currentState, setCurrentState] = useState(pinnedObject?.CLNT || "All");
  const { logout } = useAuthContext();
  const [clientFilterFields, setClientFilterFields] = useState("");
  const [clientSortFields, setClientSortFields] = useState("");
  const [detailedCompany, setDetailedCompany] = useState(null);

 

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


  // const companyId = selectedCompany?.companyId;


  useEffect(() => {
    getClientData();
  }, [sortParams])

  const triggerClientClearFilters = () => {
    setClearClientFilterTrigger((prev) => !prev);
  };

  const getAccountsSortParams = ({ sortField, sortOrder }) => {
    switch (sortField) {
      case "Account Name":
        sortField = "companyName";
        break;
      case "Account ID":
        sortField = "companyIdentifier";
        break;
      case "Total Projects":
        sortField = "totalProjects";
        break;
      case "Billing Country":
        sortField = "billingCountry";
        break;
      case "Auto Send Interaction":
        sortField = "autoSendInteractions";
        break;
      case "Total Expense":
        sortField = "totalExpense";
        break;
      case "Total QRE Expense":
        sortField = "totalRnDExpense";
        break;
      case "Primary Contact":
        sortField = "primaryContact";
        break;
      case "Phone":
        sortField = "phone";
        break;
      case "Email Address":
        sortField = "email";
        break;
    }
    setSortPrams({
      sortOrder: sortOrder,
      sortField: sortField,
    });

  }

  function getAccessToken() {
    const tokens = localStorage.getItem('tokens');
    const token_obj = JSON.parse(tokens);
    return token_obj?.accessToken || '';
  }

  const applySort = async ({ sortField, sortOrder }) => {
    const url = `${BaseURL}/api/v1/company/${localStorage.getItem("userid")}/get-company-list`;
    try {
      toast.loading("Fetching client data");
      const config = {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
        params: {
          sortField: sortField,
          sortOrder: sortOrder,
        },
      };
      const response = await axios.get(url, config)
      toast.dismiss();
      setClientData(response?.data?.data?.list);
      toast.success(response?.data?.message || "Succesfully fetched data");
    } catch (error) {
      toast.dismiss();
      console.error("error :", error);
      if (error?.response?.data?.logout === true || error?.response?.data?.message === "session timed out") {
        // toast.error("Session expired, you need to login again");
        showSessionExpiredToast();
        logout();
      }
      setError(error.toString());
    }
  }

  const getClientData = async () => {
    // Ensure API call is made only when URL endpoint is "/accounts"
    if (window.location.pathname !== "/accounts") return;

    const queryParams = new URLSearchParams();
    if (clientFilterOptions?.companyId) queryParams.append("companyIds", JSON.stringify(clientFilterOptions?.companyId));
    if (clientFilterOptions.sendInteractions != null) queryParams.append("sendInteractions", clientFilterOptions.sendInteractions);
    if (clientFilterOptions.billingCountry) queryParams.append("billingCountry", clientFilterOptions.billingCountry);
    if (clientFilterOptions.minProjectsCount != null && clientFilterOptions.minProjectsCount > 1) queryParams.append("minTotalProjects", clientFilterOptions.minProjectsCount);
    if (clientFilterOptions.maxProjectsCount != null && clientFilterOptions.maxProjectsCount < 2000000) queryParams.append("maxTotalProjects", clientFilterOptions.maxProjectsCount);
    if (clientFilterOptions.minTotalExpense != null && clientFilterOptions.minTotalExpense > 1) queryParams.append("minTotalExpense", clientFilterOptions.minTotalExpense);
    if (clientFilterOptions.maxTotalExpense != null && clientFilterOptions.maxTotalExpense < 2000000) queryParams.append("maxTotalExpense", clientFilterOptions.maxTotalExpense);
    if (clientFilterOptions.minTotalRnDExpense != null && clientFilterOptions.minTotalRnDExpense > 1) queryParams.append("minTotalRnDExpense", clientFilterOptions.minTotalRnDExpense);
    if (clientFilterOptions.maxTotalRnDExpense != null && clientFilterOptions.maxTotalRnDExpense < 2000000) queryParams.append("maxTotalRnDExpense", clientFilterOptions.maxTotalRnDExpense);
    if (currentState === "Recently Viewed") queryParams.append("recentlyViewed", true);
    if (sortParams?.sortField && sortParams?.sortOrder) {
      queryParams.append("sortField", sortParams?.sortField);
      queryParams.append("sortOrder", sortParams?.sortOrder);
    }

    const queryString = queryParams.toString();
    const url = `${BaseURL}/api/v1/company/${localStorage.getItem(
      "userid"
    )}/get-company-list${queryString ? `?${queryString}` : ""}`;
    try {
      if (window.location.pathname !== "/accounts") return;
      const response = await axios.get(url, Authorization_header());

      setClientData(response?.data?.data?.list);
      setClientFilterFields(response?.data?.data?.appliedFilter);
      setClientSortFields(response?.data?.data?.appliedSort)
      setLoading(false);
    } catch (error) {
      console.error("error :", error);
      if (error?.response?.data?.logout === true || error?.response?.data?.message === "session timed out") {
        // toast.error("Session expired, you need to login again");
        showSessionExpiredToast();
        logout();
      }
      setError(error.toString());
    } finally {
      setLoading(false);
    }
  };

  const fetchClientData = async (options = {}) => {
    setClientFilterOptions(options);
    setLoading(true);
    const queryParams = new URLSearchParams();
    if (options.companyId && options.companyId?.length > 0)
      queryParams.append("companyIds", JSON.stringify(options.companyId));
    if (options.sendInteractions != null) {
      queryParams.append("sendInteractions", options.sendInteractions);
    }
    if (options.billingCountry && Array?.isArray(options.billingCountry) && options.billingCountry.length > 0) queryParams.append("billingCountries", JSON.stringify(options.billingCountry));
    if (options.emails && Array?.isArray(options.emails) && options.emails.length > 0) queryParams.append("emails", JSON.stringify(options.emails));
    if (options.phones && Array?.isArray(options.phones) && options.phones.length > 0) queryParams.append("phones", JSON.stringify(options.phones));
    if (options.primaryContacts && Array?.isArray(options.primaryContacts) && options.primaryContacts.length > 0) queryParams.append("primaryContacts", JSON.stringify(options.primaryContacts));
    if (options.minProjectsCount != null && options.minProjectsCount > 0) queryParams.append("minTotalProjects", options.minProjectsCount);
    if (options.maxProjectsCount != null) queryParams.append("maxTotalProjects", options.maxProjectsCount);
    if (options.minTotalExpense != null && options.minTotalExpense > 0) queryParams.append("minTotalExpense", options.minTotalExpense);
    if (options.maxTotalExpense != null) queryParams.append("maxTotalExpense", options.maxTotalExpense);
    if (options.minTotalRnDExpense != null && options.minTotalRnDExpense > 0) queryParams.append("minTotalRnDExpense", options.minTotalRnDExpense);
    if (options.maxTotalRnDExpense != null) queryParams.append("maxTotalRnDExpense", options.maxTotalRnDExpense);
    if (currentState === "Recently Viewed") queryParams.append("recentlyViewed", true);
    if (options.sortField && options.sortOrder && options.sortField !== null && options.sortOrder !== null) {
      queryParams.append("sortField", options.sortField);
      queryParams.append("sortOrder", options.sortOrder);
    }
    if (sortParams?.sortField && sortParams?.sortOrder) {
      queryParams.append("sortField", sortParams?.sortField);
      queryParams.append("sortOrder", sortParams?.sortOrder);
    }

    const queryString = queryParams.toString();
    const url = `${BaseURL}/api/v1/company/${localStorage.getItem(
      "userid"
    )}/get-company-list${queryString ? `?${queryString}` : ""}`;
    try {
      if (window.location.pathname !== "/accounts") return;
      const response = await axios.get(url, Authorization_header());

      setClientData(response?.data?.data?.list);
      setClientFilterFields(response?.data?.data?.appliedFilter);
      setLoading(false);
    } catch (error) {
      console.error("error :", error);
      if (error?.response?.data?.logout === true || error?.response?.data?.message === "session timed out") {
        // toast.error("Session expired, you need to login again");
        showSessionExpiredToast();
        logout();
      }
      setError(error.toString());
    } finally {
      setLoading(false);
    }
  };


  const companyId = selectedCompany?.companyId;
  const fetchCompanyDetails = async () => {
    const url = `${BaseURL}/api/v1/company/${localStorage.getItem(
      "userid"
    )}/${companyId}/get-company-details`;
    const config = {
      headers: { Authorization: `Bearer ${getAccessToken()}` },
    };

    try {
      const response = await axios.get(url, config);
      const singleCompany = response?.data?.data;
      setDetailedCompany(singleCompany);
    } catch (error) {
      console.error("Error fetching company details: ", error);
      throw error;
    }
  };

  const handleSelectedItem = (selectedItemData) => {

    setSelectedCompany(selectedItemData);
  };



  const contextValue = {
    clientData,
    loading,
    error,
    getClientData,
    fetchClientData,
    applySort,
    isClientFilterApplied,
    setIsClientFilterApplied,
    fetchCompanyDetails,
    clearClientFilterTrigger,
    clientFilters,
    setClientFilters,
    triggerClientClearFilters,
    setCurrentState,
    currentState,
    getAccountsSortParams,
    clientFilterFields,
    clientSortFields,
    handleSelectedItem,
    selectedCompany,
    detailedCompany
  };

  return (
    <ClientContext.Provider value={contextValue}>
      {children}
    </ClientContext.Provider>
  );
};