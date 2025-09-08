import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import { BaseURL } from "../constants/Baseurl";
import { useAuthContext } from "./AuthProvider";
import { Authorization_header } from "../utils/helper/Constant";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifData, setNotifData] = useState(null);
  const [isNotificationVisible, setNotificationVisible] = useState(true);
  const [alerts, setAlerts] = useState([]);
  const [currentPage, setCurrentPage] = useState(null);
  const [currentRelationId, setCurrentRelationId] = useState(null);
  const { logout } = useAuthContext();

  const fetchAlertData = async () => {
    if (localStorage.getItem("userid")) {
      try {
        const response = await axios.get(
          `${BaseURL}/api/v1/home/${localStorage.getItem(
            "userid"
          )}/welcome-alerts`, Authorization_header()
        );
        setNotifData(response?.data?.data);
        const results = await axios.get(
          `${BaseURL}/api/v1/alerts/${localStorage.getItem(
            "userid"
          )}/0ads/get-alerts`
        );
        setAlerts(results.data.data);
      } catch (error) {
        if (error?.response?.data?.logout === true) {
          logout();
        }
        console.error(error);
      }
    }
  };

  const updateAlertCriteria = (page, relationId) => {
    setCurrentPage(page);
    setCurrentRelationId(relationId);
  };

  const hideNotification = () => {
    setNotificationVisible(false);
  };

  const showNotification = () => {
    setNotificationVisible(true);
  };

  const contextValue = {
    notifData,
    isNotificationVisible,
    hideNotification,
    showNotification,
    alerts,
    updateAlertCriteria,
    fetchAlertData,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};
