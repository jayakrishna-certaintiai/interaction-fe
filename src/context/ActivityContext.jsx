import axios from "axios";
import React, { createContext, useState } from "react";
import usePinnedData from "../components/CustomHooks/usePinnedData";
import { BaseURL } from "../constants/Baseurl";

export const ActivityContext = createContext();

export const ActivityProvider = ({ children }) => {
  const { pinnedObject } = usePinnedData();
  const [currentState, setCurrentState] = useState(pinnedObject?.AI);
  const [activityData, setActivityData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(true);
  const [interactionModalOpen, setInteractionModalOpen] = useState(false);
  const [clearActivityFilterCounter, setClearActivityFilterCounter] =
    useState(0);
  const [activityFilterState, setActivityFilterState] = useState({
    interactionActivityType: [],
    interactionTo: [],
    modifiedTime: [],
    to: "",
    from: "",
    activityStatus: [],
    activityType: "",
    sentTo: "",
    date: "",
    dateFrom: "",
    dateTo: "",
    status: "",
  });

  const [clearActivityFilterTrigger, setClearActivityFilterTrigger] =
    useState(false);
  const [isActivityFilterApplied, setIsActivityFilterApplied] = useState(false);

  const triggerActivityClearFilters = () => {
    setClearActivityFilterCounter((prevCounter) => prevCounter + 1);
  };

  const fetchActivityData = async (options = {}) => {
    const queryParams = new URLSearchParams();

    if (options.interactionActivityType)
      queryParams.append(
        "interactionActivityType",
        JSON.stringify(options.interactionActivityType)
      );
    if (options.interactionTo)
      queryParams.append(
        "interactionTo",
        JSON.stringify(options.interactionTo)
      );
    if (options.modifiedTime)
      queryParams.append("modifiedTime", JSON.stringify(options.modifiedTime));
    if (options.to) queryParams.append("to", options.to);
    if (options.from) queryParams.append("from", options.from);
    if (options.status)
      queryParams.append("status", JSON.stringify(options.status));

    const queryStr = currentState === "Starred" ? "starred=1" : "";

    const queryString = queryParams.toString();
    const finalQueryString = queryString
      ? `${queryString}&${queryStr}`
      : queryStr;
    const url = `${BaseURL}/api/v1/interactions/${localStorage.getItem(
      "userid"
    )}/1/get-interactions?${finalQueryString}`;

    try {
      const response = await axios.get(url);
      setActivityData(response?.data?.data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  return (
    <ActivityContext.Provider
      value={{
        currentState,
        setCurrentState,
        activityData,
        fetchActivityData,
        loading,
        error,
        activityFilterState,
        setClearActivityFilterTrigger,
        clearActivityFilterCounter,
        setActivityFilterState,
        setIsActivityFilterApplied,
        clearActivityFilterTrigger,
        isActivityFilterApplied,
        triggerActivityClearFilters,
        isVisible,
        setIsVisible,
        interactionModalOpen,
        setInteractionModalOpen
      }}
    >
      {children}
    </ActivityContext.Provider>
  );
};
