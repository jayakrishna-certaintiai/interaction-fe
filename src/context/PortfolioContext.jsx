import axios from "axios";
import React, { createContext, useState } from "react";
import usePinnedData from "../components/CustomHooks/usePinnedData";
import { BaseURL } from "../constants/Baseurl";

export const PortfolioContext = createContext();

export const PortfolioProvider = ({ children }) => {
  const { pinnedObject } = usePinnedData();
  const [portfolios, setPortfolios] = useState([]);
  const [portfolioFilters, setPortfolioFilters] = useState({
    companyId: [],
    NoOfProjects: [1, 500],
    company: "",
  });
  const [clearPortfolioFilterTrigger, setClearPortfolioFilterTrigger] =
    useState(false);
  const [isPortfolioFilterApplied, setIsPortfolioFilterApplied] =
    useState(false);
  const [currentState, setCurrentState] = useState(
    pinnedObject?.PORT === "RV" ? "Recently Viewed" : "All Portfolios"
  );

  const triggerPortfolioClearFilters = () => {
    setClearPortfolioFilterTrigger((prev) => !prev);
  };

  const fetchPortfolios = async (options = {}) => {
    const queryParams = new URLSearchParams();
    if (options.companyIds)
      queryParams.append("companyIds", JSON.stringify(options.companyIds));
    if (options.minProjects)
      queryParams.append("minProjects", options.minProjects);
    if (options.maxProjects)
      queryParams.append("maxProjects", options.maxProjects);
    if (currentState === "Recently Viewed")
      queryParams.append("recentlyViewed", true);

    const queryString = queryParams.toString();
    const url = `${BaseURL}/api/v1/portfolios/${localStorage.getItem(
      "userid"
    )}/get-portfolios${queryString ? `?${queryString}` : ""}`;

    // try {
    //   const response = await axios.get(url);
    //   setPortfolios(response?.data?.data);
    // } catch (error) {
    //   console.error(error);
    // }
  };

  return (
    <PortfolioContext.Provider
      value={{
        portfolioFilters,
        setPortfolioFilters,
        portfolios,
        fetchPortfolios,
        triggerPortfolioClearFilters,
        clearPortfolioFilterTrigger,
        isPortfolioFilterApplied,
        setIsPortfolioFilterApplied,
        currentState,
        setCurrentState,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};
