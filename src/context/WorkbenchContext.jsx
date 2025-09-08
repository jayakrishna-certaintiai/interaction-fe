import axios from "axios";
import React, { createContext, useState } from "react";
import usePinnedData from "../components/CustomHooks/usePinnedData";
import { BaseURL } from "../constants/Baseurl";

export const WorkbenchContext = createContext();

export const WorkbenchProvider = ({ children }) => {
  const { pinnedObject } = usePinnedData();
  const [workbenchData, setWorkbenchData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentState, setCurrentState] = useState(
    pinnedObject?.WB === "ALL"
      ? "All Workbench"
      : pinnedObject?.WB === "OPEN"
        ? "Open Workbench"
        : "Close Workbench"
  );
  const [workbenchFilterState, setWorkbenchFilterState] = useState({
    companyId: [],
    projectId: [],
    timesheetId: [],
    month: [],
    company: "",
    project: "",
    timesheet: "",
    monthName: "",
  });

  const [clearWorkbenchFilterTrigger, setClearWorkbenchFilterTrigger] =
    useState(false);
  const [isWorkbenchFilterApplied, setIsWorkbenchFilterApplied] =
    useState(false);

  const triggerWorkbenchClearFilters = () => {
    setClearWorkbenchFilterTrigger((prev) => !prev);
  };

  const fetchWorkbenchData = async (options = {}) => {
    const queryParams = new URLSearchParams();

    if (options.companyId)
      queryParams.append("companyId", JSON.stringify(options.companyId));
    if (options.timesheetId)
      queryParams.append("timesheetId", JSON.stringify(options.timesheetId));
    if (options.projectId)
      queryParams.append("projectId", JSON.stringify(options.projectId));
    if (options.timesheetMonth)
      queryParams.append(
        "timesheetMonth",
        JSON.stringify(options.timesheetMonth)
      );

    let queryStr = "";
    if (currentState === "Open Workbench") {
      queryStr = "reconcileStatus=['Open']";
    } else if (currentState === "Close Workbench") {
      queryStr = "reconcileStatus=['Closed']";
    }

    const queryString = queryParams.toString();
    const finalQueryString = queryString
      ? `${queryString}&${queryStr}`
      : queryStr;

    const url = `${BaseURL}/api/v1/reconciliations/${localStorage.getItem(
      "userid"
    )}/1/get-reconciliations?${finalQueryString}`;
    try {
      const response = await axios.get(url);
      setWorkbenchData(response?.data?.data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  return (
    <WorkbenchContext.Provider
      value={{
        workbenchData,
        fetchWorkbenchData,
        currentState,
        setCurrentState,
        loading,
        error,
        workbenchFilterState,
        setClearWorkbenchFilterTrigger,
        setWorkbenchFilterState,
        setIsWorkbenchFilterApplied,
        clearWorkbenchFilterTrigger,
        isWorkbenchFilterApplied,
        triggerWorkbenchClearFilters,
      }}
    >
      {children}
    </WorkbenchContext.Provider>
  );
};
