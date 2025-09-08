import { Box, Paper, Typography } from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import InfoboxHeader from "../../components/Common/InfoboxHeader";
import MainPanelHeader from "../../components/Common/MainPanelHeader";
import SearchboxBody from "../../components/Common/SearchboxBody";
import SearchboxHeader from "../../components/Common/SearchboxHeader";
import usePinnedData from "../../components/CustomHooks/usePinnedData";
import Interactions from "../../components/ReconciliationDetails/Interactions";
import PastRevisions from "../../components/ReconciliationDetails/PastRevisions";
import Reconcile from "../../components/ReconciliationDetails/Reconcile";
import ReconciliationInfoboxTable from "../../components/ReconciliationDetails/ReconciliationInfoboxTable";
import TaskHoursClassification from "../../components/ReconciliationDetails/TaskHoursClassification";
import TaskList from "../../components/ReconciliationDetails/TaskList";
import { BaseURL } from "../../constants/Baseurl";
import { FilterListContext } from "../../context/FiltersListContext";
import { NotificationContext } from "../../context/NotificationContext";
import { WorkbenchContext } from "../../context/WorkbenchContext";
import { areFiltersApplied } from "../../utils/helper/AreFiltersApplied";
import { useHasAccessToFeature } from "../../utils/helper/HasAccessToFeature";

const fieldMapping = {
  Field0: "projectId",
  Field1: "reconciliationIdentifier",
  Field2: "reconcileRnDHoursOverride",
  Field3: "timesheetId",
};

const columnsTable1 = [
  "Non QRE Hours",
  "QRE Hours",
  "QRE Expense",
  "Uncertain Hours",
];

const columnsTable2 = [
  "Task Date",
  "Employee",
  "Task Description",
  "Task Hours",
];

const columnsTable3 = [
  "Timestamp",
  "Modified By",
  "QRE Hours",
  "QRE Task Description",
];

const tableData2 = [
  {
    timestamp: "12/11/2023 14:35:23",
    modifiedBy: "Prabhu Balakrishnan",
    taskDescription:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolore blanditiis eaque dignissimos.",
    rndHours: "20",
  },
];

function ReconciliationDetails() {
  const arr = [
    { name: "Reconcile", isAuth: useHasAccessToFeature("F030", "P000000007") },
    {
      name: "Past Revisions",
      isAuth: useHasAccessToFeature("F030", "P000000007"),
    },
    {
      name: "Interactions",
      isAuth: useHasAccessToFeature("F023", "P000000003"),
    },
  ];
  const { fetchUserDetails } = useContext(FilterListContext);
  const { pinnedObject } = usePinnedData();
  const [selectedTab, setSelectedTab] = useState("Reconcile");
  const [reconciliationData, setReconciliationData] = useState(null);
  const [data, setData] = useState(null);
  const [overviewData, setOverviewData] = useState(null);
  const [tableData, setTableData] = useState(null);
  const [search, setSearch] = useState("");
  const [filteredRows, setFilteredRows] = useState([]);
  const [interactionsData, setInteractionsData] = useState(null);
  // const overviewDataRef = useRef(null);
  const {
    workbenchFilterState,
    setIsWorkbenchFilterApplied,
    fetchWorkbenchData,
    workbenchData,
    currentState,
    setCurrentState,
  } = useContext(WorkbenchContext);
  const [pinStates, setPinStates] = useState({
    "All Workbench": false,
    "Open Workbench": false,
    "Close Workbench": false,
  });

  const handleSelectedTab = (tab) => {
    setSelectedTab(tab);
  };

  const handleSelectedItem = (selectedItemData) => {
    setData(selectedItemData);
  };

  const reconcileId = data?.reconcileId;
  const companyId = data?.companyId;

  const appliedFilters = {
    Clients: workbenchFilterState.company,
    Projects: workbenchFilterState.project,
    Timesheet: workbenchFilterState.timesheet,
    Month: workbenchFilterState.monthName,
  };

  useEffect(() => {
    setCurrentState(
      pinnedObject?.WB === "ALL"
        ? "All Workbench"
        : pinnedObject?.WB === "OPEN"
          ? "Open Workbench"
          : "Close Workbench"
    );
  }, []);

  useEffect(() => {
    const shouldFetchWithFilters =
      workbenchFilterState.companyId.length > 0 ||
      workbenchFilterState.projectId.length > 0 ||
      workbenchFilterState.monthName !== "" ||
      workbenchFilterState.timesheetId.length > 0;
    if (shouldFetchWithFilters) {
      let options = {
        ...(workbenchFilterState.companyId.length > 0 && {
          companyId: workbenchFilterState.companyId,
        }),
        ...(workbenchFilterState.projectId.length > 0 && {
          projectId: workbenchFilterState.projectId,
        }),
        ...(workbenchFilterState.timesheetId.length > 0 && {
          timesheetId: workbenchFilterState.timesheetId,
        }),
        ...(workbenchFilterState.monthName !== "" && {
          timesheetMonth: [workbenchFilterState.monthName],
        }),
      };
      fetchWorkbenchData(options);
    } else {
      fetchWorkbenchData();
    }
  }, [currentState]);

  const applyFiltersAndFetch = (filters) => {
    if (areFiltersApplied(appliedFilters)) {
      fetchWorkbenchData(filters);
      setIsWorkbenchFilterApplied(true);
    } else {
      toast.error("Please select at least one filter.");
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${BaseURL}/api/v1/reconciliations/${localStorage.getItem(
          "userid"
        )}/${companyId}/get-reconciliations`
      );
      setReconciliationData(response?.data?.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getOverviewData = async () => {
    try {
      const response1 = await axios.get(
        `${BaseURL}/api/v1/reconciliations/${localStorage.getItem(
          "userid"
        )}/${companyId}/${reconcileId}/get-overview`
      );
      setOverviewData(response1.data.data.data);
      setTableData(response1.data.data.uncertainTasks);
    } catch (error) {
      console.error(error);
    }
  };

  const getActivityData = async () => {
    try {
      const response2 = await axios.get(
        `${BaseURL}/api/v1/interactions/${localStorage.getItem(
          "userid"
        )}/${companyId}/get-activity-with-filters?relatedTo=workbench&relationId=${reconcileId}`
      );
      setInteractionsData(response2.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [companyId]);

  useEffect(() => {
    getOverviewData();
    getActivityData();
  }, [companyId, reconcileId]);

  const handleSubmit = async (formData) => {
    const apiUrl = `${BaseURL}/api/v1/reconciliations/${localStorage.getItem(
      "userid"
    )}/${companyId}/${reconcileId}/reconcile-hours`;
    const data = {
      rndHours: parseFloat(formData.rndHours),
      routineHours: parseFloat(formData.nonRndHours),
      uncertainHours:
        parseFloat(formData.rndHours) + parseFloat(formData.nonRndHours),
      rndTaskDescription: formData.description,
    };
    try {
      const response = await axios.post(apiUrl, data);
      getOverviewData();

    } catch (error) {
      console.error("Error reconciling data:", error);
    }
  };

  const handleSearch = (input) => {
    setSearch(input);
  };

  useEffect(() => {
    if (workbenchData) {
      const filteredData = workbenchData?.filter(
        (task) =>
          // task.projectManager.toLowerCase().includes(search.toLowerCase()) ||
          task?.reconcileId?.toLowerCase()?.includes(search?.toLowerCase()) ||
          task?.timesheetId?.toLowerCase()?.includes(search?.toLowerCase()) ||
          task?.reconcileRnDHoursOverride
            ?.toLowerCase()
            ?.includes(search?.toLowerCase()) ||
          task?.projectId?.toLowerCase()?.includes(search?.toLowerCase())
        // task?.companyId?.toString()?.includes(search)
        // Add more conditions as needed
      );
      setFilteredRows(filteredData);
    }
  }, [workbenchData, search]);

  const { updateAlertCriteria } = useContext(NotificationContext);

  useEffect(() => {
    const pageName = "workbench";
    const relationId = reconcileId;

    updateAlertCriteria(pageName, relationId);

    return () => updateAlertCriteria(null, null);
  }, [reconcileId]);

  const handleSelectedHeaderItem = (item) => {
    setCurrentState(item);
  };

  const isDownload = useHasAccessToFeature("F030", "P000000006");

  useEffect(() => {
    const updatedPinStates = {
      "All Workbench": pinnedObject.WB === "ALL",
      "Open Workbench": pinnedObject.WB === "OPEN",
      "Close Workbench": pinnedObject.WB === "CLOSE",
    };
    setPinStates(updatedPinStates);
  }, [pinnedObject.WB]);

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
        !newState["All Workbench"] &&
        !newState["Open Workbench"] &&
        !newState["Close Workbench"];
      if (allFalse) {
        newState["All Workbench"] = true;
      }

      return newState;
    });
  };

  const updatePinState = async (newState) => {
    const newPinnedObject = {
      ...pinnedObject,
      WB: newState,
    };

    const pinString = Object.entries(newPinnedObject)
      .map(([key, value]) => `${key}:${value}`)
      .join("|");

    const config = {
      method: "put",
      url: `${BaseURL}/api/v1/users/${localStorage.getItem(
        "userid"
      )}/edit-user`,
      headers: { "Content-Type": "application/json" },
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
      const newStateValue =
        newState === "All Workbench"
          ? "ALL"
          : newState === "Open Workbench"
            ? "OPEN"
            : "CLOSE";

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
        sx={{ display: "flex", width: "98%", mx: "auto", gap: "20px", mt: 3 }}
      >
        <Paper
          sx={{
            boxShadow: "0px 3px 6px #0000001F",
            display: "flex",
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
              pinnedObject?.WB === "ALL"
                ? "All Workbench"
                : pinnedObject?.WB === "OPEN"
                  ? "Open Workbench"
                  : "Close Workbench"
            }
            data={filteredRows}
            onSearch={handleSearch}
            items={["All Workbench", "Open Workbench", "Close Workbench"]}
            page="workbench"
            onApplyFilters={applyFiltersAndFetch}
            searchPermission={useHasAccessToFeature("F030", "P000000009")}
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
              data={filteredRows}
              fieldMapping={fieldMapping}
              onItemSelected={handleSelectedItem}
              page={"workbench"}
            />
          </Box>
        </Paper>
        <Box sx={{ width: "77%", display: "flex", flexDirection: "column" }}>
          <Paper
            sx={{
              boxShadow: "0px 3px 6px #0000001F",
              borderRadius: "20px",
              mb: 3,
            }}
          >
            <InfoboxHeader
              head={data?.reconciliationIdentifier}
              page={"reconciliations"}
              downloadPermission={isDownload}
              relatedTo={"Workbench"}
              relationName={data?.reconciliationIdentifier}
              relationId={reconcileId}
            />
            <ReconciliationInfoboxTable data={overviewData} />
          </Paper>
          <Box sx={{ display: "flex", gap: "20px" }}>
            <Paper
              sx={{
                boxShadow: "0px 3px 6px #0000001F",
                borderRadius: "20px",
                flex: 1,
                p: 1.5,
                height: "35vw",
                overflowY: "auto",
                scrollbarWidth: "none", // For Firefox
                msOverflowStyle: "none", // For Internet Explorer 10+
                "&::-webkit-scrollbar": {
                  display: "none", // For WebKit browsers like Chrome and Safari
                },
              }}
            >
              <Typography
                sx={{
                  color: "#404040",
                  fontSize: "13px",
                  fontWeight: "500",
                  mb: "7px",
                }}
              >
                Timesheet Task Hours Classification
              </Typography>
              <TaskHoursClassification
                columns={columnsTable1}
                data={overviewData}
              />
              <Typography
                sx={{
                  color: "#404040",
                  fontSize: "13px",
                  fontWeight: "500",
                  mb: "7px",
                  mt: "7px",
                }}
              >
                Timesheet Task Summary (for Uncertain Hours)
              </Typography>
              <Typography
                sx={{
                  color: "#404040",
                  fontSize: "13px",
                  fontWeight: "400",
                  mb: "7px",
                }}
              >
                {overviewData?.[0]?.timesheetSummary}
              </Typography>
              <Typography
                sx={{
                  color: "#404040",
                  fontSize: "13px",
                  fontWeight: "500",
                  mb: "7px",
                  mt: "7px",
                }}
              >
                Timesheet Tasks List (for Uncertain Hours)
              </Typography>
              <TaskList columns={columnsTable2} data={tableData} />
            </Paper>
            <Paper
              sx={{
                boxShadow: "0px 3px 6px #0000001F",
                borderRadius: "20px",
                flex: 1,
                height: "35vw",
                overflowX: "auto",
                // scrollbarWidth: "none", // For Firefox
                // msOverflowStyle: "none", // For Internet Explorer 10+
                // "&::-webkit-scrollbar": {
                //   display: "none", // For WebKit browsers like Chrome and Safari
                // },
              }}
            >
              <MainPanelHeader
                arr={arr}
                first={arr[0]?.name}
                onSelectedChange={handleSelectedTab}
                page={"reconciliation"}
              />
              {useHasAccessToFeature("F030", "P000000007") &&
                selectedTab === "Reconcile" && (
                  <Reconcile
                    data={overviewData?.uncertainHours}
                    handleSubmit={handleSubmit}
                  />
                )}
              {useHasAccessToFeature("F030", "P000000007") &&
                selectedTab === "Past Revisions" && (
                  <PastRevisions columns={columnsTable3} data={tableData2} />
                )}
              {useHasAccessToFeature("F023", "P000000003") &&
                selectedTab === "Interactions" && (
                  <Interactions data={interactionsData} />
                )}
            </Paper>
          </Box>
        </Box>
      </Box>
      <Toaster />
    </>
  );
}

export default ReconciliationDetails;
