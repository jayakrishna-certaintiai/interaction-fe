import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import usePinnedData from "../components/CustomHooks/usePinnedData";
import { BaseURL } from "../constants/Baseurl";
import { Authorization_header } from "../utils/helper/Constant";
import { useAuthContext } from "./AuthProvider";
import toast from "react-hot-toast";

export const TimesheetContext = createContext();
let sessionExpiredToastShown = false;

export const TimesheetProvider = ({ children }) => {
  const { pinnedObject } = usePinnedData();
  const [timesheets, setTimesheets] = useState([]);
  const [timesheetFilterState, setTimesheetFilterState] = useState({
    companyId: [],
    company: "",
    accountingYear: [],
    accYear: "",
    totalhours: [0, null],
    // uploadedOn: "",
    startDate: "",
    endDate: "",
  });
  const [clearTimesheetFilterTrigger, setClearTimesheetFilterTrigger] =
    useState(false);
  const [isTimesheetFilterApplied, setIsTimesheetFilterApplied] =
    useState(false);
  const [currentState, setCurrentState] = useState(
    pinnedObject?.TIMESHEETS === "RV" ? "Recently Viewed" : "All Timesheets"
  );
  const [sortParams, setSortParams] = useState({ sortField: null, sortOrder: null });
  const [loading, setLoading] = useState(false);
  const [timeSheetOptions, setTimeSheetOptions] = useState({});
  const [timeSheetFilterFields, setTimeSheetFilterfields] = useState("");
  const [timeSheetSortFields, setTimeSheetSortFields] = useState("");
  const [selectedTimeSheetId, setSelectedTimeSheetId] = useState("");
  const { logout } = useAuthContext();

  const getSlectedTimeSheetId = (id) => {
    setSelectedTimeSheetId(id);
  };


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

  const getTimeSheetsortParams = ({ sortField, sortOrder }) => {

    switch (sortField) {
      case "Timesheet Name":
        sortField = "originalFileName";
        break;
      case "Fiscal Year":
        sortField = "accountingYear";
        break;
      case "Account":
        sortField = "companyName";
        break;
      case "Status":
        sortField = "status";
        break;
      case "Uploaded On":
        sortField = "uploadedOn";
        break;
      case "Uploaded By":
        sortField = "uploadedBy";
        break;
      case "Total Hours":
        sortField = "totalhours";
        break;
      default:
        sortField = null;
    }
    setSortParams({
      sortField: sortField,
      sortOrder: sortOrder,
    })
  }

  useEffect(() => {
    if (sortParams?.sortField && sortParams?.sortOrder) {
      getTimeSheets();
    }
  }, [sortParams])

  const triggerTimesheetClearFilters = () => {
    setClearTimesheetFilterTrigger((prev) => !prev);
  };

  function getAccessToken() {
    const tokens = localStorage.getItem('tokens');
    const token_obj = JSON.parse(tokens);
    return token_obj?.accessToken || '';
  }

  const timeSheetSort = async ({ sortField, sortOrder }) => {
    const url = `${BaseURL}/api/v1/timesheets/${localStorage.getItem("userid")}/1/timesheet-logs`;
    try {
      toast.loading("Fetching projects data");
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

      setTimesheets(response?.data?.data?.list);
      setTimeSheetFilterfields(response?.data?.data?.appliedFilter);
      setTimeSheetSortFields(response?.data?.data?.appliedSort);
      toast.success(response?.data?.message || "Succesfully fetched data");
    } catch (error) {
      toast.dismiss();
      toast.error("Error in fetching Timesheet data");
      console.error("Error in fetching client data : ", error);
    }
  }

  const getTimeSheets = async () => {
    setLoading(true);
    const queryParams = new URLSearchParams();
    if (timeSheetOptions.companyId && timeSheetOptions.companyId.length > 0)
      queryParams.append("companyIds", JSON.stringify(timeSheetOptions.companyId));

    if (timeSheetOptions.accountingYear || timesheetFilterState.accountingYear.length > 0)
      queryParams.append(
        "fiscalYears",
        JSON.stringify(timeSheetOptions.accountingYear || timesheetFilterState.accountingYear)
      );
    if (timeSheetOptions.status || timesheetFilterState.status?.length > 0)
      queryParams.append(
        "status",
        JSON.stringify(timeSheetOptions.status || timesheetFilterState.status)
      );
    if (timeSheetOptions.uploadedBy || timesheetFilterState.uploadedBy?.length > 0)
      queryParams.append(
        "UploadedBy",
        JSON.stringify(timeSheetOptions.uploadedBy || timesheetFilterState.uploadedBy)
      );
    if (timeSheetOptions.accYear || timesheetFilterState.accYear.length > 0)
      queryParams.append(
        "fiscalYears",
        JSON.stringify(timeSheetOptions.accYear || timesheetFilterState.accYear)
      );
    if (timeSheetOptions.uploadedOn || timesheetFilterState.uploadedOn?.length > 0)
      queryParams.append(
        "uploadedOn",
        JSON.stringify(timeSheetOptions.uploadedOn || timesheetFilterState.uploadedOn)
      );
    if (timeSheetOptions.minTotalhours != null && timeSheetOptions.minTotalhours > 0) {
      queryParams.append("minTotalhours", timeSheetOptions.minTotalhours);
    }
    if (timeSheetOptions.maxTotalhours != null && timeSheetOptions.maxTotalhours < 100000) {
      queryParams.append("maxTotalhours", timeSheetOptions.maxTotalhours);
    }
    if (sortParams?.sortField && sortParams?.sortOrder) {
      queryParams.append("sortField", sortParams?.sortField);
      queryParams.append("sortOrder", sortParams?.sortOrder);
    }

    const queryString = queryParams.toString();
    const url = `${BaseURL}/api/v1/timesheets/${localStorage.getItem(
      "userid"
    )}/1/timesheet-logs${queryString ? `?${queryString}` : ""}`;
    setIsTimesheetFilterApplied(!!queryString);

    try {
      if (window.location.pathname !== "/timesheets") return;
      const response = await axios.get(url, Authorization_header());
      setTimesheets(response?.data?.data?.list);
      setTimeSheetFilterfields(response?.data?.data?.appliedFilter);
      setTimeSheetSortFields(response?.data?.data?.appliedSort);
      setLoading(false);
    } catch (error) {
      console.error("error", error);
      if (error?.response?.data?.logout === true || error?.response?.data?.message === "session timed out") {
        // toast.error("Session expired, you need to login again");
        showSessionExpiredToast();
        logout();
      }
      setLoading(false);
      console.error(error);
    }
  };

  const fetchTimesheets = async (options = {}) => {
    setLoading(true);
    setTimeSheetOptions(options);
    const queryParams = new URLSearchParams();
    if (options.companyId && options.companyId.length > 0)
      queryParams.append("companyIds", JSON.stringify(options.companyId));

    if (options.accYear || timesheetFilterState.accYear.length > 0)
      queryParams.append(
        "fiscalYears",
        JSON.stringify(options.accYear || timesheetFilterState.accYear)
      );
    if (options.status || timesheetFilterState.status?.length > 0)
      queryParams.append(
        "status",
        JSON.stringify(options.status || timesheetFilterState.status)
      );
    if (options.uploadedBy || timesheetFilterState.uploadedBy?.length > 0)
      queryParams.append(
        "uploadedBy",
        JSON.stringify(options.uploadedBy || timesheetFilterState.uploadedBy)
      );
    if (options.startDate || timesheetFilterState.startDate) {
      queryParams.append(
        "startUploadedOn",
        options.startDate || timesheetFilterState.startDate
      );
    }
    if (options.endDate || timesheetFilterState.endDate) {
      queryParams.append(
        "endUploadedOn",
        options.endDate || timesheetFilterState.endDate
      );
    }
    if (options.minTotalhours != null && options.minTotalhours > 0) {
      queryParams.append("minTotalhours", options.minTotalhours);
    }
    if (options.maxTotalhours != null && options.maxTotalhours < 100000) {
      queryParams.append("maxTotalhours", options.maxTotalhours);
    }
    if (currentState === "Recently Viewed")
      queryParams.append("recentlyViewed", true);
    if (options?.sortField != null && options?.sortField) {
      queryParams.append("sortField", options.sortField)
    }
    if (options?.sortOrder != null && options?.sortOrder) {
      queryParams.append("sortOrder", options.sortOrder)
    }
    if (sortParams?.sortField && sortParams?.sortOrder) {
      queryParams.append("sortField", sortParams?.sortField);
      queryParams.append("sortOrder", sortParams?.sortOrder);
    }

    const queryString = queryParams.toString();
    const url = `${BaseURL}/api/v1/timesheets/${localStorage.getItem(
      "userid"
    )}/1/timesheet-logs${queryString ? `?${queryString}` : ""}`;
    setIsTimesheetFilterApplied(queryString);

    try {
      if (window.location.pathname !== "/timesheets") return;
      const response = await axios.get(url, Authorization_header());
      setTimesheets(response?.data?.data?.list);
      setTimeSheetFilterfields(response?.data?.data?.appliedFilter);
      setTimeSheetSortFields(response?.data?.data?.appliedSort);
      setLoading(false);
    } catch (error) {
      console.error("error", error);
      if (error?.response?.data?.logout === true || error?.response?.data?.message === "session timed out") {
        // toast.error("Session expired, you need to login again");
        showSessionExpiredToast();
        logout();
      }
      setLoading(false);
      console.error(error);
    }
  };

  return (
    <TimesheetContext.Provider
      value={{
        timesheetFilterState,
        setTimesheetFilterState,
        timesheets,
        fetchTimesheets,
        triggerTimesheetClearFilters,
        clearTimesheetFilterTrigger,
        isTimesheetFilterApplied,
        setIsTimesheetFilterApplied,
        currentState,
        setCurrentState,
        timeSheetSort,
        loading,
        getTimeSheetsortParams,
        timeSheetFilterFields,
        timeSheetSortFields,
        selectedTimeSheetId,
        getSlectedTimeSheetId
      }}
    >
      {children}
    </TimesheetContext.Provider>
  );
};