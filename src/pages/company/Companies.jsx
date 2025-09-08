import { Box, Paper } from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import BarChart from "../../components/Common/BarChart";
import CompanyTableStack from "../../components/Companies/CompanyTableStack";
import usePinnedData from "../../components/CustomHooks/usePinnedData";
import { BaseURL } from "../../constants/Baseurl";
import { useAuthContext } from "../../context/AuthProvider";
import { ClientContext } from "../../context/ClientContext";
import { areFiltersApplied } from "../../utils/helper/AreFiltersApplied";
import { useHasAccessToFeature } from "../../utils/helper/HasAccessToFeature";
import { updateTimeDifference } from "../../utils/helper/UpdateTimeDifference";
import { Authorization_header } from "../../utils/helper/Constant";

const chartPaperStyle = {
  p: 1,
  flex: 1,
  borderRadius: "20px",
  height: "300px",
  boxShadow: "0px 3px 6px #0000001F",
};

const layoutBoxStyle = {
  width: "98%",
  mx: "auto",
  display: "flex",
  mt: 2,
  gap: "20px",
};

function Companies(page) {
  const { pinnedObject } = usePinnedData();
  const [data, setData] = useState(null);
  const [uncertainHrs, setUncertainHrs] = useState(null);
  const [latestUpdateTime, setLatestUpdateTime] = useState("Just now");
  const { authState } = useAuthContext();
  const [companyData1, setCompanyData1] = useState(null);
  const [percentageRnd, setPercentageRnd] = useState(null);
  const [timesheets, setTimesheets] = useState(null);
  const [totalUncertainHrs, setTotalUncertainHrs] = useState(null);
  const [companyData2, setCompanyData2] = useState(null);
  const {
    clientFilters,
    setIsClientFilterApplied,
    fetchClientData,
    clientData,
    currentState,
    setCurrentState,
    loading
  } = useContext(ClientContext);

  useEffect(() => {
    const shouldFetchWithFiltersClient =
      clientFilters.billingCountry?.length > 0 ||
      clientFilters.emails?.length > 0 ||
      clientFilters.phones?.length > 0;

    if (shouldFetchWithFiltersClient) {
      let clientOptions = {
        ...(clientFilters.billingCountry?.length > 0 && {
          billingCountry: clientFilters.billingCountry,
        }),
        ...(clientFilters.emails?.length > 0 && {
          emails: clientFilters.emails,
        }),
        ...(clientFilters.phones?.length > 0 && {
          phones: clientFilters.phones,
        }),
        ...(clientFilters.projectsCount && {
          minProjectsCount: clientFilters.projectsCount[0],
        }),
        ...(clientFilters.projectsCount && {
          maxProjectsCount: clientFilters.projectsCount[1],
        }),
        ...(clientFilters.type && {
          companyType: clientFilters.type,
        }),
      };
      fetchClientData(clientOptions);
    } else {
      fetchClientData();
    }
  }, [currentState, Authorization_header]);
  const fetchData = async () => {
    try {
      const response1 = await axios.get(
        `${BaseURL}/api/v1/company/${localStorage.getItem("userid")}/${authState?.userInfo?.companyId
        }/get-company-kpi`, Authorization_header()
      );

      setCompanyData1(response1.data.data?.kpi1?.companyName);
      setPercentageRnd(response1.data.data?.kpi1?.percentageRnD);
      setCompanyData2(response1.data.data?.kpi2?.companyName);
      setUncertainHrs(response1.data.data?.kpi2?.uncertainHours);
      setTimesheets(response1.data.data?.kpi3?.timesheets);
      setTotalUncertainHrs(response1.data.data?.kpi3?.totalUncertainHours);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // fetchData();
    setCurrentState(
      (pinnedObject) => {
        if (pinnedObject && pinnedObject?.CLNT && pinnedObject?.CLNT === "RV") {
          return "Recently Viewed";
        } else {
          return "All Accounts";
        }
      }
    );
  }, [Authorization_header]);

  useEffect(() => {
    const timeDifference = updateTimeDifference(data, "createdTime");
    setLatestUpdateTime(timeDifference);
  }, [data]);

  const appliedFilters = {
    MinimumProjects: clientFilters.projectsCount ? clientFilters.projectsCount[0] : null,
    MaximumProjects: clientFilters.projectsCount ? clientFilters.projectsCount[1] : null,
    BillingAddress: clientFilters.billingCountry || null,
    Emails: clientFilters.emails || null,
    Phones: clientFilters.phones || null,
    MinimumTotalProjectCost: clientFilters.totalProjectCost ? clientFilters.totalProjectCost[0] : null,
    MaximimTotalProjectCost: clientFilters.totalProjectCost ? clientFilters.totalProjectCost[1] : null,
    MinimumTotalRnDCost: clientFilters.totalRnDCost ? clientFilters.totalRnDCost[0] : null,
    MaximumTotalRnDCost: clientFilters.totalRnDCost ? clientFilters.totalRnDCost[1] : null,
  };
  const applyFiltersAndFetch = (filters) => {
    if (areFiltersApplied(appliedFilters)) {
      fetchClientData(filters);
      setIsClientFilterApplied(true);
    } else {
      toast.error("Please select at least one filter.");
    }
  };

  const customLabel1 = {
    rotation: 0,
    format: "{text}%",
    overflow: "justify",
  };
  const customLabel3 = {
    rotation: 0,
    format: "{text}",
    overflow: "justify",
  };

  return (
    <div>
      {useHasAccessToFeature("F005", "P000000008") && (
        <Paper
          sx={{ width: "98.5%", mx: "auto", mt: 1, borderRadius: "25px", mb: 3, height: "100%" }}
        >
          <CompanyTableStack
            loading={loading}
            data={clientData}
            getData={fetchClientData}
            latestUpdateTime={latestUpdateTime}
            onApplyFilters={applyFiltersAndFetch}
            appliedFilters={appliedFilters}
            page="accounts"
          />
        </Paper>
      )}
      <Toaster />
    </div>
  );
}

export default Companies;
