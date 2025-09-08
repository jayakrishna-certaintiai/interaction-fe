import {
  Box,
  Paper,
} from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import SearchboxBody from "../../components/Common/SearchboxBody";
import SearchboxHeader from "../../components/Common/SearchboxHeader";
import usePinnedData from "../../components/CustomHooks/usePinnedData";
import PanelHeader from "../../components/Timesheets/MainPanel/PanelHeader";
import TimesheetInfoboxHeader from "../../components/Timesheets/TimesheetInfoboxHeader";
import TimesheetInfoboxTable from "../../components/Timesheets/TimesheetsInfoboxTable";
import { BaseURL } from "../../constants/Baseurl";
import { FilterListContext } from "../../context/FiltersListContext";
import { NotificationContext } from "../../context/NotificationContext";
import { TimesheetContext } from "../../context/TimesheetContext";
import { areFiltersApplied } from "../../utils/helper/AreFiltersApplied";
import { useHasAccessToFeature } from "../../utils/helper/HasAccessToFeature";
import { updateTimeDifference } from "../../utils/helper/UpdateTimeDifference";
import MainPanelHeader from "../../components/Common/MainPanelHeader";
import TimesheetProject from "../../components/Timesheets/TimesheetProject";
import TimesheetTask from "../../components/Timesheets/MainPanel/TimesheetTask";
import { Authorization_header, token_obj } from "../../utils/helper/Constant";
import { ProjectContext } from "../../context/ProjectContext";

const fieldMapping = {
  Field0: "companyName",
  Field1: "timesheetIdentifier",
};


function TimesheetDetails() {
  const { pinnedObject } = usePinnedData();
  const {
    fetchTimesheets,
    timesheetFilterState,
    timesheets,
    setCurrentState,
    currentState,
  } = useContext(TimesheetContext);
  const { projects, fetchProjects, projectFilterState, setIsProjectFilterApplied,
    loading } = useContext(ProjectContext);
  const [Tsdata, setTsData] = useState(null);
  const [data, setData] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [latestUpdateTime, setLatestUpdateTime] = useState("Just now");
  const { fetchUserDetails } = useContext(FilterListContext);
  const [pinStates, setPinStates] = useState({
    "All Timesheets": false,
    "Recently Viewed": false,
  });
  const [selectedTab, setSelectedTab] = useState("Projects");

  const arr = [
    { name: "Projects", isAuth: useHasAccessToFeature("F014", "P000000003") },
    { name: "Tasks", isAuth: useHasAccessToFeature("F015", "P000000003") },
  ];

  const handleSelectedTab = (tab) => {
    setSelectedTab(tab);
  };



  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${BaseURL}/api/v1/timesheets/${localStorage.getItem(
            "userid"
          )}/1/timesheet-logs`, Authorization_header()
        );
        setTsData(response?.data?.data?.list);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [localStorage?.getItem("keys")]);

  const timesheetId = data?.timesheetId;

  const handleSelectedItem = async (selectedItemData) => {
    if (selectedItemData?.timesheetId !== data?.timesheetId) {
      setData(selectedItemData);
    }
  };

  useEffect(() => {
    if (timesheets) {
      const filteredData = timesheets?.filter(
        (task) =>
          task?.timesheetId?.toLowerCase()?.includes(search?.toLowerCase()) ||
          task?.companyId?.toString()?.includes(search)
        // Add more conditions as needed
      );
      setFilteredData(filteredData);
    }
  }, [searchInput, timesheets, search]);

  const handleSearchInput = (input) => {
    setSearchInput(input);
  };

  const handleSearch = (input) => {
    setSearch(input);
  };

  useEffect(() => {
    const timeDifference = updateTimeDifference(Tsdata, "uploadedOn");
    setLatestUpdateTime(timeDifference);
  }, [Tsdata]);

  const { updateAlertCriteria } = useContext(NotificationContext);

  useEffect(() => {
    const pageName = "timesheet";
    const relationId = timesheetId;

    updateAlertCriteria(pageName, relationId);

    return () => updateAlertCriteria(null, null);
  }, [timesheetId]);


  // const appliedFilters = {
  //   Clients: timesheetFilterState.company,
  //   Month: timesheetFilterState.monthName,
  //   MinimumNonRnDHours: timesheetFilterState.nonRnDHours[0],
  //   MaximumNonRnDHours: timesheetFilterState.nonRnDHours[1],
  //   MinimumRnDHours: timesheetFilterState.rnDHours[0],
  //   MaximumRnDHours: timesheetFilterState.rnDHours[1],
  //   MinimumUncertainHours: timesheetFilterState.uncertainHours[0],
  //   MaximumUncertainHours: timesheetFilterState.uncertainHours[1],
  //   MinimumReconciledHours: timesheetFilterState.reconciledHours[0],
  //   MaximumReconciledHours: timesheetFilterState.reconciledHours[1],
  // };

  const appliedFilters = {};

  if (timesheetFilterState.company) {
    appliedFilters.Clients = timesheetFilterState.company;
  }

  if (timesheetFilterState.timesheetId) {
    appliedFilters.timesheetId = timesheetFilterState.timesheetId;
  }
  if (timesheetFilterState.projectNames) {
    appliedFilters.projectNames = timesheetFilterState.projectNames;
  }
  if (timesheetFilterState.projectCodes) {
    appliedFilters.projectCodes = timesheetFilterState.projectCodes;
  }
  if (timesheetFilterState.spocName) {
    appliedFilters.spocName = timesheetFilterState.spocName;
  }
  if (timesheetFilterState.spocEmail) {
    appliedFilters.spocEmail = timesheetFilterState.spocEmail;
  }
  if (timesheetFilterState.totalExpense && timesheetFilterState.totalExpense[0] < 0) {
    appliedFilters.minTotalExpense = timesheetFilterState.totalExpense[0];
  }

  if (timesheetFilterState.totalExpense && timesheetFilterState.totalExpense[1] > 2000000) {
    appliedFilters.maxTotalExpense = timesheetFilterState.totalExpense[1];
  }

  if (timesheetFilterState.rnDHours && timesheetFilterState.rnDHours[0] < 0) {
    appliedFilters.MinimumRnDHours = timesheetFilterState.rnDHours[0];
  }

  if (timesheetFilterState.rnDHours && timesheetFilterState.rnDHours[1] > 2000000) {
    appliedFilters.MaximumRnDHours = timesheetFilterState.rnDHours[1];
  }

  if (timesheetFilterState.uncertainHours && timesheetFilterState.uncertainHours[0] < 0) {
    appliedFilters.MinimumUncertainHours = timesheetFilterState.uncertainHours[0];
  }

  if (timesheetFilterState.uncertainHours && timesheetFilterState.uncertainHours[1] > 2000000) {
    appliedFilters.MaximumUncertainHours = timesheetFilterState.uncertainHours[1];
  }

  if (timesheetFilterState.reconciledHours && timesheetFilterState.reconciledHours[0] < 0) {
    appliedFilters.MinimumReconciledHours = timesheetFilterState.reconciledHours[0];
  }

  if (timesheetFilterState.reconciledHours && timesheetFilterState.reconciledHours[1] > 2000000) {
    appliedFilters.MaximumReconciledHours = timesheetFilterState.reconciledHours[1];
  }
  useEffect(() => {
    setCurrentState(
      pinnedObject?.TIMESHEETS === "RV" ? "Recently Viewed" : "All Timesheets"
    );
  }, [localStorage?.getItem("keys")]);

  useEffect(() => {
    const shouldFetchWithFiltersTimesheet =
      timesheetFilterState.companyId?.length > 0;
    if (shouldFetchWithFiltersTimesheet) {
      let timesheetOptions = {
        ...(timesheetFilterState.companyId?.length > 0 && {
          client: timesheetFilterState.companyId,
        }),
        ...(timesheetFilterState.month?.length > 0 && {
          month: timesheetFilterState.month,
        }),
        ...(timesheetFilterState.nonRnDHours && {
          nonRnDHoursMin: timesheetFilterState.nonRnDHours[0],
        }),
        ...(timesheetFilterState.nonRnDHours && {
          nonRnDHoursMax: timesheetFilterState.nonRnDHours[1],
        }),
        ...(timesheetFilterState.rnDHours && {
          rnDHoursMin: timesheetFilterState.rnDHours[0],
        }),
        ...(timesheetFilterState.rnDHours && {
          rnDHoursMax: timesheetFilterState.rnDHours[1],
        }),
        ...(timesheetFilterState.uncertainHours && {
          uncertainHoursMin: timesheetFilterState.uncertainHours[0],
        }),
        ...(timesheetFilterState.uncertainHours && {
          uncertainHoursMax: timesheetFilterState.uncertainHours[1],
        }),
        ...(timesheetFilterState.reconciledHours && {
          reconciledHoursMin: timesheetFilterState.reconciledHours[0],
        }),
        ...(timesheetFilterState.reconciledHours && {
          reconciledHoursMax: timesheetFilterState.reconciledHours[1],
        }),
      };
      fetchTimesheets(timesheetOptions);
    } else {
      fetchTimesheets();
    }
  }, [currentState]);

  const applyFiltersAndFetch = (filters) => {
    if (areFiltersApplied(appliedFilters)) {
      fetchTimesheets(filters);
    } else {
    }
  };

  const isDownload = useHasAccessToFeature("F018", "P000000006");
  const isSearchTask = useHasAccessToFeature("F024", "P000000009");
  const isReUpload = useHasAccessToFeature("F018", "P000000002");

  const handleSelectedHeaderItem = (item) => {
    setCurrentState(item);
  };

  useEffect(() => {
    const updatedPinStates = {
      "All Timesheets": pinnedObject.TIMESHEETS === "ALL",
      "Recently Viewed": pinnedObject.TIMESHEETS === "RV",
    };
    setPinStates(updatedPinStates);
  }, [pinnedObject.TIMESHEETS]);

  const togglePinState = (selectedHeading) => {
    setPinStates((prevStates) => {
      const resetStates = Object.keys(prevStates).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {});

      const newState = {
        ...resetStates,
        [selectedHeading]: !prevStates[selectedHeading],
      };

      const allFalse =
        !newState["All Timesheets"] && !newState["Recently Viewed"];
      if (allFalse) {
        newState["All Timesheets"] = true;
      }

      return newState;
    });
  };

  const updatePinState = async (newState) => {
    const newPinnedObject = {
      ...pinnedObject,
      TIMESHEETS: newState,
    };

    const pinString = Object.entries(newPinnedObject)
      .map(([key, value]) => `${key}:${value}`)
      .join("|");

    const config = {
      method: "put",
      url: `${BaseURL}/api/v1/users/${localStorage.getItem(
        "userid"
      )}/edit-user`,
      headers: { "Content-Type": "application/json", 'Authorization': `Bearer ${token_obj.accessToken}` },
      data: JSON.stringify({ pin: pinString }),
    };

    try {
      const response = await axios.request(config);

      fetchUserDetails();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const newState = Object.keys(pinStates).find(
      (key) => pinStates[key] === true
    );

    if (newState) {
      const newStateValue = newState === "All Timesheets" ? "ALL" : "RV";

      updatePinState(newStateValue)
        .then(() => {
        })
        .catch((error) => {
          console.error("Failed to update pin state:", error);
        });
    }
  }, [pinStates]);

  return (
    <>
      <Box
        sx={{ display: "flex", width: "98%", mx: "auto", gap: "20px", mt: 1.5 }}
      >
        {/* <Paper
          sx={{
            boxShadow: "0px 3px 6px #0000001F",
            display: "flex",
            // flex: 1,
            width: "23%",
            borderRadius: "20px",
            flexDirection: "column",
            height: "100vh",
            mb: 3,
            overflowY: "hidden",
          }}
        >
          <SearchboxHeader
            type={
              pinnedObject?.TIMESHEETS === "RV"
                ? "Recently Viewed"
                : "All Timesheets"
            }
            onSearch={handleSearch}
            data={filteredData}
            latestUpdateTime={latestUpdateTime}
            items={["All Timesheets", "Recently Viewed"]}
            page="timesheet"
            onApplyFilters={applyFiltersAndFetch}
            searchPermission={useHasAccessToFeature("F018", "P000000009")}
            onSelectedItem={handleSelectedHeaderItem}
            isPinnedState={pinStates[currentState]}
            onPinClicked={() => togglePinState(currentState)}
          />
          <Box
            sx={{
              overflowY: "auto",
            }}
          >
            <SearchboxBody
              data={filteredData}
              fieldMapping={fieldMapping}
              onItemSelected={handleSelectedItem}
              page={"timesheet"}
            />
          </Box>
        </Paper> */}

        <Box
          sx={{
            width: "110%",
            display: "flex",
            flexDirection: "column",
            overflowX: "hidden",
          }}
        >
          <Paper
            sx={{
              boxShadow: "0px 3px 6px #0000001F",
              borderRadius: "20px",
              mb: 3,
            }}
          >
            <TimesheetInfoboxHeader
              head1={data?.timesheetIdentifier}
              timesheetId={data?.timesheetId}
              head={data?.originalFileName}
              downloadPermission={isDownload}
              uploadPermission={isReUpload}
              data={filteredData}
              fieldMapping={fieldMapping}
              onItemSelected={handleSelectedItem}
              page={"timesheet"}
            />
            <TimesheetInfoboxTable info={data} />
          </Paper>
          <Box sx={{ display: "flex", gap: "10px", mt: -1.5 }}>
            <Paper
              sx={{
                borderRadius: "20px",
                width: "100%",
                boxShadow: "0px 3px 6px #0000001F",
              }}
            >
              <MainPanelHeader
                arr={arr}
                first={arr?.[0]?.name}
                onSelectedChange={handleSelectedTab}
                selectedTab={selectedTab}
              />
              {useHasAccessToFeature("F024", "P000000008") &&
                selectedTab === "Projects" && (
                  <>
                    <PanelHeader
                      data={data}
                      onSearchInput={handleSearchInput}
                      searchPermission={isSearchTask}
                    />
                    <TimesheetProject
                      timesheetId={data?.timesheetId}
                      search={searchInput}
                      onApplyFilters={applyFiltersAndFetch}
                      appliedFilters={appliedFilters}
                    />
                  </>
                )}
              {useHasAccessToFeature("F024", "P000000008") &&
                selectedTab === "Tasks" && (
                  <>
                    <PanelHeader
                      data={data}
                      onSearchInput={handleSearchInput}
                      searchPermission={isSearchTask}
                    />
                    <TimesheetTask
                      data={data}
                      timesheetId={data?.timesheetId}
                      searchInput={searchInput}
                      timesheets={timesheets}
                    />
                  </>
                )}
            </Paper>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default TimesheetDetails;
