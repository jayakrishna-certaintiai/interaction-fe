import { Box, Paper } from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import MainPanelHeader from "../../components/Common/MainPanelHeader";
import Details from "../../components/Projects/Details";
import Financial from "../../components/Projects/Financial";
import ProjectsInfoboxTable from "../../components/Projects/ProjectsInfoboxTable";
import Team from "../../components/Projects/Team";
import Task from "../../components/Projects/Task"
import Timesheet from "../../components/Projects/Timesheet";
import { BaseURL } from "../../constants/Baseurl";
import { NotificationContext } from "../../context/NotificationContext";
import {
  getTimeDifference,
  updateTimeDiff,
} from "../../utils/helper/UpdateTimeDifference";
import { Toaster } from "react-hot-toast";
import usePinnedData from "../../components/CustomHooks/usePinnedData";
import Documents from "../../components/Projects/Documents";
import { DocumentContext } from "../../context/DocumentContext";
import { FilterListContext } from "../../context/FiltersListContext";
import { ProjectContext } from "../../context/ProjectContext";
import { areFiltersApplied } from "../../utils/helper/AreFiltersApplied";
import { useHasAccessToFeature } from "../../utils/helper/HasAccessToFeature";
import TechnicalSummary from "../../components/Cases/TechnicalSummaryTab/TechnicalSummary";
import Interaction from "../../components/Cases/IneractionTab/Interaction";
import { useLocation } from "react-router-dom";
import { Authorization_header } from "../../utils/helper/Constant";
import ProjectsInfoboxHeader from "../../components/Common/ProjectsInfoboxHeader";
import InfoboxHeader from "../../components/Common/InfoboxHeader";
import RnDHistory from "../../components/Projects/RnDHistory";
import NewRndHistory from "../../components/Projects/NewRnDHistory";
import CompanyCC from "../../components/CompanyDetails/CompanyCC";

const fieldMapping = {
  Field0: "companyName",
  Field2: "projectManager",
  Field3: "projectName",
};

const tableData = {
  columns: [
    "Task Date",
    "Project ID",
    "Task Description",
    "Employee",
    "QRE Classification",
    "Hourly Rate",
    "Task Effort(Hrs)",
    "Total Expense",
    "QRE Expense",
    "Created By",
    "Created Time",
    "Modified By",
    "Modified Time",
    "Task ID",
  ],
  rows: [
    {
      id: 1,
      taskDate: "12/10/2023",
      taskID: "43568",
      taskDesc: "Task Description",
      employee: "Ezra Romero",
      rndClassification: "QRE",
      hourlyRate: "$ 70.00",
      taskEffort: "8.00",
      totalExpense: "$ 560.00",
      rndExpense: "$ 560.00",
    },
  ],
};
function ProjectsInfo() {
  const arr = [
    // { name: "Financial", isAuth: useHasAccessToFeature("F014", "P000000003") },
    { name: "Project Details", isAuth: useHasAccessToFeature("F015", "P000000003") },
    { name: "Project Team", isAuth: useHasAccessToFeature("F017", "P000000003") },
    { name: "Timesheets", isAuth: useHasAccessToFeature("F018", "P000000003") },
    { name: "Task", isAuth: useHasAccessToFeature("F024", "P000000003") },
    { name: "Technical Summary", isAuth: useHasAccessToFeature("F022", "P000000003") },
    { name: "Interactions", isAuth: useHasAccessToFeature("F023", "P000000003") },
    { name: "Documents", isAuth: useHasAccessToFeature("F021", "P000000003") },
    { name: "QRE (%) - History", isAuth: useHasAccessToFeature("F021", "P000000003") },
    // { name: "Manage CC Recipents", isAuth: useHasAccessToFeature("F021", "P000000003") }
  ];
  const { pinnedObject } = usePinnedData();
  const {
    projects,
    fetchProjects,
    projectFilterState,
    setCurrentState,
    currentState,
  } = useContext(ProjectContext);
  const [selectedTab, setSelectedTab] = useState("Project Details");
  const [selectedProject, setSelectedProject] = useState(null);
  const [teamData, setTeamData] = useState(null);
  const [rndHistoryData, setRndHistoryData] = useState(null);
  const [timesheetData, setTimesheetData] = useState(null);
  // const [summaryDetails, setSummaryDetails] = useState(null);
  const [details, setDetails] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [filteredRows, setFilteredRows] = useState([]);
  const [financialData, setFinancialData] = useState(null);
  const [latestUpdateTime, setLatestUpdateTime] = useState("Just now");
  const [latestTimesheetUpdateTime, setLatestTimesheetUpdateTime] = useState("Just now");
  const [latestTeamUpdateTime, setLatestTeamUpdateTime] = useState("Just now");
  const [latestDetailUpdateTime, setDetailLatestUpdateTime] = useState("Just now");
  const [latestDocumentUpdateTime, setDocumentLatestUpdateTime] = useState("Just now");
  const [teamsSortParams, setTeamsSortParams] = useState({ sortField: null, sortOrder: null });
  const [timeSheetSortParams, setTimeSheetSortParams] = useState({ sortField: null, sortOrder: null });
  const [shouldRefetch, setShouldRefetch] = useState(false);
  const { documents, fetchDocuments } = useContext(DocumentContext);
  const { fetchUserDetails } = useContext(FilterListContext);
  const [loading, setLoading] = useState(true);
  const [projectId, setProjectId] = useState("");
  const [companyId, setCompanyId] = useState();
  const [projectName, setProjectName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [pinStates, setPinStates] = useState({
    "All Projects": false,
    "Recently Viewed": false,
  });
  const location = useLocation();


  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const ProjectId = queryParams.get("projectId");

    if (ProjectId) setProjectId(ProjectId);
  }, [location.search]);

  const getTeamSortParams = ({ sortField, sortOrder }) => {

    switch (sortField) {
      case "Employee ID":
        sortField = "employeeId";
        break;
      case "Employee Name":
        sortField = "firstName";
        break;
      case "Employement Type":
        sortField = "employementType";
        break;
      case "Designation":
        sortField = "employeeTitle";
        break;
      case "Total Hours":
        sortField = "totalHours";
        break;
      case "Hourly Rate":
        sortField = "hourlyRate";
        break;
      case "Total Expense":
        sortField = "totalCost";
        break;
      case "QRE Potential (%)":
        sortField = "rndPotential";
        break;
      case "R&D Credits":
        sortField = "rndCredits";
        break;
      case "QRE Cost":
        sortField = "qreCost";
        break;
      default:
        sortField = null;
    }
    setTeamsSortParams({ sortField: sortField, sortOrder: sortOrder });

  }
  const getTimeSheetSortParams = ({ sortField, sortOrder }) => {
    switch (sortField) {
      case "Timesheet":
        sortField = "originalFileName";
        break;
      case "Status":
        sortField = "status";
        break;
      case "Uploaded On":
        sortField = "uploadedOn";
        break;
      case "Total Hours":
        sortField = "totalhours";
        break;
      default:
        sortField = null;
    }
    setTimeSheetSortParams({ sortField: sortField, sortOrder: sortOrder });
  }
  const handleSelectedTab = (tab) => {
    setSelectedTab(tab);
  };
  const handleSelectedItem = (selectedItemData) => {
    setSelectedProject(selectedItemData);
    // setProjectId(selectedItemData?.projectId);
    setCompanyId(selectedItemData?.companyId);
    // fetchProjectDetails();
  };
  const handleDocumentUploadSuccess = () => {
    setShouldRefetch(true);
  };

  // const handleChangePage = (newPage) => {
  //   setPage(newPage);
  // };

  // const handleChangeRowsPerPage = (event) => {
  //   setItemsPerPage(parseInt(event.target.value, 10));
  //   setPage(0);
  // };

  useEffect(() => {
    fetchDocuments({
      companyIds: [companyId?.toString()],
      relatedTo: "projects",
      relationId: projectId?.toString(),
    });
    setShouldRefetch(false);
  }, [projectId, shouldRefetch]);

  // useEffect(() => {
  //   fetchProjectDetails({
  //     companyIds: [companyId?.toString()],
  //     relatedTo: "projects",
  //     relationId: projectId?.toString(),
  //   });
  //   setShouldRefetch(false);
  // }, [projectId, shouldRefetch]);

  // Fetch Team Data Function

  const fetchTeamData = async (filters = {}) => {
    try {
      const teamPayload = { headers: Authorization_header().headers };
      const queryParams = new URLSearchParams();

      // Add sorting parameters if present
      if (teamsSortParams?.sortField) { queryParams.append("sortField", teamsSortParams.sortField); }
      if (teamsSortParams?.sortOrder) { queryParams.append("sortOrder", teamsSortParams.sortOrder); }

      // Add filters if present
      if (filters?.employeeIds?.length > 0) { queryParams.append("employeeIds", JSON.stringify(filters.employeeIds)); }
      if (filters?.names?.length > 0) { queryParams.append("names", JSON.stringify(filters.names)); }
      if (filters?.employementTypes?.length > 0) { queryParams.append("employementTypes", JSON.stringify(filters.employementTypes)); }
      if (filters?.employeeTitles?.length > 0) {
        queryParams.append("employeeTitles", JSON.stringify(filters.employeeTitles));
      }
      //values filters
      let hourlyRate = [null, null];
      if (filters.minHourlyrate != null && filters.minHourlyrate !== 0) { hourlyRate[0] = Number(filters.minHourlyrate); }
      if (filters.maxHourlyrate != null) { hourlyRate[1] = Number(filters.maxHourlyrate); }
      if (hourlyRate[0] || hourlyRate[1]) { queryParams.append("hourlyRates", JSON.stringify(hourlyRate)); }

      let totalHours = [null, null];
      if (filters.minTotalHours != null && filters.minTotalHours !== 0) { totalHours[0] = Number(filters.minTotalHours); }
      if (filters.maxTotalHours != null) { totalHours[1] = Number(filters.maxTotalHours); }
      if (totalHours[0] || totalHours[1]) { queryParams.append("totalHourses", JSON.stringify(totalHours)); }

      let totalCosts = [null, null];
      if (filters.minTotalCost != null && filters.minTotalCost !== 0) { totalCosts[0] = Number(filters.minTotalCost); }
      if (filters.maxTotalCost != null) { totalCosts[1] = Number(filters.maxTotalCost); }
      if (totalCosts[0] || totalCosts[1]) { queryParams.append("totalCostses", JSON.stringify(totalCosts)); }

      let qreCost = [null, null];
      if (filters.minQRECost != null && filters.minQRECost !== 0) { qreCost[0] = Number(filters.minQRECost); }
      if (filters.maxQRECost != null) { qreCost[1] = Number(filters.maxQRECost); }
      if (qreCost[0] || qreCost[1]) { queryParams.append("qreCostes", JSON.stringify(qreCost)); }

      let rndPotential = [null, null];
      if (filters.minRndPotential != null && filters.minRndPotential !== 0) { rndPotential[0] = Number(filters.minRndPotential); }
      if (filters.maxRndPotential != null) { rndPotential[1] = Number(filters.maxRndPotential); }
      if (rndPotential[0] || rndPotential[1]) { queryParams.append("rndPotentials", JSON.stringify(rndPotential)); }

      const projectIds = [projectId];
      const queryString = queryParams.toString();
      const url = `${BaseURL}/api/v1/contacts/get-team-members?projectIds=${JSON.stringify(projectIds)}${queryString ? `&${queryString}` : ""}`;

      const response = await axios.get(url, teamPayload);
      setTeamData(response?.data?.list);
    } catch (error) {
      console.error("Error fetching team data:", error);
      return null;
    }
  };
  const fetchRnDHistoryData = async () => {
    try {
      const teamPayload = { headers: Authorization_header().headers };
      const url = `${BaseURL}/api/v1/projects/getRnDHistory?projectId=${projectId}`;
      const response = await axios.get(url, teamPayload);
      setRndHistoryData(response?.data);
    } catch (error) {
      console.error("Error fetching team data:", error);
      return null;
    }
  };

  // Fetch Financial Data Function
  // const fetchFinancialData = async () => {
  //   try {
  //     const headers = Authorization_header().headers;
  //     const url = `${BaseURL}/api/v1/projects/${localStorage.getItem(
  //       "userid"
  //     )}/${companyId}/${projectId}/get-project-financials`;

  //     const response = await axios.get(url, { headers });
  //     // return response.data?.data;
  //     setFinancialData(response?.data?.data);
  //   } catch (error) {
  //     console.error("Error fetching financial data:", error);
  //     return null;
  //   }
  // };



  useEffect(() => {
    setCompanyId(details?.overview[0]?.companyId);
    setCompanyName(details?.overview[0]?.companyName);
    setProjectName(details?.overview[0]?.projectName);
  }, [details])

  // Fetch Project Details Data Function
  const fetchProjectDetails = async () => {
    if (details) {

      return;
    }
    try {
      setLoading(true); // Start loading
      const headers = Authorization_header().headers;
      const url = `${BaseURL}/api/v1/projects/${localStorage.getItem("userid")}/${companyId}/${projectId}/project-details`;
      const response = await axios.get(url, { headers });

      setDetails(response?.data?.data);
    } catch (error) {
      console.error("Error fetching project details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    companyId && projectId && fetchProjectDetails();
  }, [companyId, projectId]);

  useEffect(() => {
    setCompanyId(details?.overview[0]?.companyId);
    setCompanyName(details?.overview[0]?.companyName);
    setProjectName(details?.overview[0]?.projectName);
  }, [details])

  // Fetch Timesheet Data Function
  const fetchTimesheetData = async (filters = {}) => {
    try {
      const timesheetPayload = { headers: Authorization_header().headers };

      if (timeSheetSortParams?.sortField && timeSheetSortParams?.sortOrder) {
        timesheetPayload.params = {
          sortField: timeSheetSortParams.sortField,
          sortOrder: timeSheetSortParams.sortOrder,
        };
      }
      const queryParams = new URLSearchParams();
      if (filters?.status?.length > 0) { queryParams.append("status", JSON.stringify(filters.status)); }
      if (filters.startUploadedOn?.length > 0) { queryParams.append("startUploadedOn", filters.startUploadedOn); }
      if (filters.endUploadedOn?.length > 0) { queryParams.append("endUploadedOn", filters.endUploadedOn); }
      if (filters.minTotalhours != null && filters.minTotalhours > 0) { queryParams.append("minTotalhours", filters.minTotalhours); }
      if (filters.maxTotalhours != null && filters.maxTotalhours < 100000) { queryParams.append("maxTotalhours", filters.maxTotalhours); }

      const queryString = queryParams.toString();

      const url = `${BaseURL}/api/v1/timesheets/${localStorage.getItem(
        "userid"
      )}/${companyId}/timesheet-logs?projectId=${projectId}${queryString ? `&${queryString}` : ""}`;

      const response = await axios.get(url, timesheetPayload);
      setTimesheetData(response?.data?.data?.list);
    } catch (error) {
      console.error("Error fetching timesheet data:", error);
      return null;
    }
  };

  const handleApiCalls = async (filters = {}) => {
    switch (selectedTab) {
      case "Project Team":
        const teamData = await fetchTeamData(filters);
        break;
      case "QRE (%) - History":
        const rndHistoryData = await fetchRnDHistoryData(filters);
        break;
      case "Project Details":
        const details = await fetchProjectDetails(filters);
        break;
      // case "Financial":
      //   try {
      //     const [financialData, projectDetails] = await Promise.all([
      //       fetchFinancialData(),
      //       fetchProjectDetails(),
      //     ]);
      //     setFinancialData(financialData);
      //     setDetails(projectDetails);
      //   } catch (error) {
      //     console.error("Error fetching financial or project details:", error);
      //   }
      //   break;
      // case "Details":
      //   // Only fetch project details if the data hasn't been set yet
      //   if (!details) {
      //     const projectDetails = await fetchProjectDetails();
      //     setDetails(projectDetails);
      //   }
      //   break;
      case "Timesheets":
        const timesheetData = await fetchTimesheetData(filters);
        break;
      default:
        console.error("Invalid tab selected");
        break;
    }
  };
  useEffect(() => {
    handleApiCalls();
  }, [selectedTab, projectId, companyId, teamsSortParams, timeSheetSortParams]);

  const handleSearch = (input) => {
    setSearch(input);

  };
  useEffect(() => {
    if (projects) {
      const filteredData = projects?.filter(
        (task) =>
          // task.projectManager.toLowerCase().includes(search.toLowerCase()) ||
          task?.projectName?.toLowerCase()?.includes(search?.toLowerCase()) ||
          task?.companyId?.toString()?.includes(search)
      );
      setFilteredRows(filteredData);
    }
  }, [projects, search]);

  useEffect(() => {
    const timeDifference = getTimeDifference(projects, "modifiedTime");
    setLatestUpdateTime(timeDifference);
    // const timeDifference1 = getTimeDifference(financialData, "modifiedTime");
    // setLatestFinancialUpdateTime(timeDifference1);
    const timeDifference2 = updateTimeDiff(details, "modifiedTime");
    setDetailLatestUpdateTime(timeDifference2);
    const timeDifference3 = getTimeDifference(teamData, "modifiedTime");
    setLatestTeamUpdateTime(timeDifference3);
    const timeDifference6 = getTimeDifference(rndHistoryData, "modifiedTime");
    setLatestTeamUpdateTime(timeDifference6);
    const timeDifference4 = getTimeDifference(timesheetData, "modifiedTime");
    const timeDifference5 = getTimeDifference(documents, "modifiedTime");
    setLatestTimesheetUpdateTime(timeDifference4);
    setDocumentLatestUpdateTime(timeDifference5);
  }, [projects, details, financialData, teamData, rndHistoryData, timesheetData]);
  const { updateAlertCriteria } = useContext(NotificationContext);
  useEffect(() => {
    const pageName = "projects";
    const relationId = projectId;
    updateAlertCriteria(pageName, relationId);
    return () => updateAlertCriteria(null, null);
  }, [projectId]);

  const appliedFilters = {
    Clients: projectFilterState.company,
    Projects: projectFilterState.project,
    AccountingYear: projectFilterState.accYear,
  };

  const applyFiltersAndFetch = (filters) => {
    if (areFiltersApplied(appliedFilters)) {
      fetchProjects(filters);
    } else {
      // toast.error("Please select at least one filter.");
      fetchProjects(filters);
    }
  };
  useEffect(() => {
    setCurrentState(
      pinnedObject?.PROJ === "RV" ? "Recently Viewed" : "All Projects"
    );
  }, [localStorage?.getItem("keys")]);

  useEffect(() => {
    const shouldFetchWithFiltersProjects =
      projectFilterState?.status?.length > 0 ||
      projectFilterState?.minTotalhours?.length > 0 ||
      projectFilterState?.maxTotalhours?.length > 0 ||
      projectFilterState?.startUploadedOn?.length > 0 ||
      projectFilterState?.endUploadedOn?.length > 0;
    if (shouldFetchWithFiltersProjects) {
      let filters = {
        ...(projectFilterState?.status?.length > 0 && { status: projectFilterState?.status, }),
        ...(projectFilterState?.startUploadedOn?.length > 0 && { startUploadedOn: projectFilterState?.startUploadedOn, }),
        ...(projectFilterState?.endUploadedOn?.length > 0 && { endUploadedOn: projectFilterState?.endUploadedOn, }),
        ...(projectFilterState?.minTotalhours?.length > 0 && { minTotalhours: projectFilterState?.minTotalhours, }),
        ...(projectFilterState?.maxTotalhours?.length > 0 && { maxTotalhours: projectFilterState?.maxTotalhours, }),
      };
      fetchTimesheetData(filters);
    } else {
      // fetchTimesheetData();
    }
  }, [currentState, timeSheetSortParams]);
  useEffect(() => {
    const shouldFetchWithFiltersProjects =
      projectFilterState?.names?.length > 0 ||
      projectFilterState?.projectRoles?.length > 0 ||
      projectFilterState?.minTotalExpense?.length > 0 ||
      projectFilterState?.maxTotalExpense?.length > 0 ||
      projectFilterState?.minRnDExpense?.length > 0 ||
      projectFilterState?.maxRnDExpense?.length > 0 ||
      projectFilterState?.minTotalHourlyrate?.length > 0 ||
      projectFilterState?.maxTotalHourlyrate?.length > 0;
    if (shouldFetchWithFiltersProjects) {
      let filters = {
        ...(projectFilterState?.names?.length > 0 && { names: projectFilterState?.names, }),
        ...(projectFilterState?.projectRoles?.length > 0 && { projectRoles: projectFilterState?.projectRoles, }),
        ...(projectFilterState?.minTotalExpense?.length > 0 && { minTotalExpense: projectFilterState?.minTotalExpense, }),
        ...(projectFilterState?.maxTotalExpense?.length > 0 && { maxTotalExpense: projectFilterState?.maxTotalExpense, }),
        ...(projectFilterState?.minRnDExpense?.length > 0 && { minRnDExpense: projectFilterState?.minRnDExpense, }),
        ...(projectFilterState?.maxRnDExpense?.length > 0 && { maxRnDExpense: projectFilterState?.maxRnDExpense, }),
        ...(projectFilterState?.minTotalHourlyrate?.length > 0 && { minTotalHourlyrate: projectFilterState?.minTotalHourlyrate, }),
        ...(projectFilterState?.maxTotalHourlyrate?.length > 0 && { maxTotalHourlyrate: projectFilterState?.maxTotalHourlyrate, }),
      };
      fetchTeamData(filters);
      fetchRnDHistoryData(filters);
    } else {
      // fetchTeamData();
    }
  }, [currentState, teamsSortParams]);

  const handleSelectedHeaderItem = (item) => {
    setCurrentState(item);
  };
  const isDownload = useHasAccessToFeature("F013", "P000000006");
  useEffect(() => {
    const updatedPinStates = {
      "All Projects": pinnedObject.PROJ === "ALL",
      "Recently Viewed": pinnedObject.PROJ === "RV",
    };
    setPinStates(updatedPinStates);
  }, [pinnedObject.PROJ]);

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
        !newState["All Projects"] && !newState["Recently Viewed"];
      if (allFalse) {
        newState["All Projects"] = true;
      }
      return newState;
    });
  };

  const updatePinState = async (newState) => {
    const newPinnedObject = {
      ...pinnedObject,
      PROJ: newState,
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
      const newStateValue = newState === "All Projects" ? "ALL" : "RV";
      updatePinState(newStateValue)
        .then(() => {
        })
        .catch((error) => {
          console.error("Failed to update pin state:", error);
        });
    }
  }, [pinStates]);

  const codePoint = parseInt(details?.overview[0]?.currencySymbol, 16);
  const symbol = String.fromCharCode(codePoint);

  return (
    <>

      <Box
        sx={{ display: "flex", width: "98%", mx: "auto", gap: "20px", mt: 1.5 }}
      >
        {/* <Paper
          sx={{
            display: "flex",
            // flex: 1,
            width: "23%",
            borderRadius: "20px",
            flexDirection: "column",
            height: "100vh",
            mb: 3,
            overflowY: "hidden",
            boxShadow: "0px 3px 6px #0000001F",
          }}
        >
          <SearchboxHeader
            type={
              pinnedObject?.PROJ === "RV" ? "Recently Viewed" : "All Projects"
            }
            onSearch={handleSearch}
            data={filteredRows}
            latestUpdateTime={latestUpdateTime?.difference}
            items={["All Projects", "Recently Viewed"]}
            page="projects"
            onApplyFilters={applyFiltersAndFetch}
            searchPermission={useHasAccessToFeature("F013", "P000000009")}
            onSelectedItem={handleSelectedHeaderItem}
            isPinnedState={pinStates[currentState]}
            onPinClicked={() => togglePinState(currentState)}
          />
          <Box sx={{ overflowY: "auto" }}>
            <SearchboxBody
              data={filteredRows}
              fieldMapping={fieldMapping}
              onItemSelected={handleSelectedItem}
              page={"project"}
            />
          </Box>
        </Paper> */}
        <Box sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
          <Paper
            sx={{
              borderRadius: "20px",
              mb: 3,
              boxShadow: "0px 3px 6px #0000001F",
            }}
          >
            <InfoboxHeader
              head={selectedProject?.projectName}
              projectId={details?.overview[0]?.projectId}
              page={"projects"}
              downloadPermission={isDownload}
              data={filteredRows}
              fieldMapping={fieldMapping}
              onItemSelected={handleSelectedItem}
            />
            {/* <ProjectsInfoboxHeader
              // head1={details?.overview[0]?.projectCode}
              // head={details?.overview[0]?.projectName}
              projectId={details?.overview[0]?.projectId}
              head1={selectedTab?.projectCode}
              head={selectedTab?.projectName}
              // projectId={selectedTab?.projectId}
              page={"project"}
              downloadPermission={isDownload}
              data={filteredRows}
              fieldMapping={fieldMapping}
              onItemSelected={handleSelectedItem}
            /> */}
            <ProjectsInfoboxTable
              info={details?.overview[0]}
              onSelectedChange={handleSelectedTab}
              symbol={symbol}
            />
          </Paper>
          <Box sx={{ display: "flex", gap: "20px", mt: -1.5 }}>
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
              {/* {useHasAccessToFeature("F014", "P000000003") &&
                selectedTab === "Financial" && (
                  <Financial
                    symbol={symbol}
                    currency={details?.overview[0]?.currency}
                    data={details?.overview}
                    info={details?.overview[0]}
                    totalBudget={totalBudget}
                    totalExpense={totalExpense}
                    rndExpense={rndExpense}
                    date={date}
                    latestUpdateTime={latestDetailUpdateTime}
                    modifiedBy={details?.modifiedBy}
                    fetchData={fetchProjectDetails}
                  />
                )} */}
              {useHasAccessToFeature("F015", "P000000003") &&
                selectedTab === "Project Details" && (
                  <Details
                    data={details?.overview[0]}
                    surveyDetails={details?.survey?.surveyDetails}
                    sureveyQuestions={details?.survey?.questionAnswer}
                    sentToEmail={details?.survey?.surveyDetails?.sentToEmail}
                    latestUpdateTime={latestDetailUpdateTime}
                    modifiedBy={details?.modifiedBy}
                    s_last_updated_by={details?.s_last_updated_by}
                    s_last_updated_timestamp={details?.s_last_updated_timestamp}
                    fetchData={fetchProjectDetails}
                    milestones={details?.milestones}
                  />
                )}
              {useHasAccessToFeature("F017", "P000000003") &&
                selectedTab === "Project Team" && (
                  <Team
                    projectId={projectId}
                    symbol={symbol}
                    // data={teamData}
                    teamData={teamData}
                    latestUpdateTime={latestTeamUpdateTime?.difference}
                    modifiedBy={latestTeamUpdateTime?.modifiedBy}
                    fetchTeamData={fetchTeamData}
                    details={details?.overview[0]}
                    getTeamSortParams={getTeamSortParams}
                  />
                )}
              {useHasAccessToFeature("F018", "P000000003") &&
                selectedTab === "Timesheets" && (
                  <Timesheet
                    timesheetData={timesheetData}
                    fetchTimesheetData={fetchTimesheetData}
                    projectId={projectId}
                    latestUpdateTime={latestTimesheetUpdateTime?.difference}
                    modifiedBy={latestTimesheetUpdateTime?.modifiedBy}
                    getTimeSheetSortParams={getTimeSheetSortParams}
                  />
                )}
              {useHasAccessToFeature("F017", "P000000003") &&
                selectedTab === "Task" && (
                  <Task
                    details={details?.overview[0]}
                    symbol={symbol}
                    projectId={projectId}
                  />
                )}
              {useHasAccessToFeature("F018", "P000000003") &&
                selectedTab === "Technical Summary" && (
                  <TechnicalSummary usedfor={'project'} projectId={projectId} />
                )}
              {useHasAccessToFeature("F022", "P000000003") &&
                selectedTab === "Interactions" && (
                  <Interaction usedfor={'project'} projectId={projectId} />
                )}
              {useHasAccessToFeature("F021", "P000000003") &&
                selectedTab === "Documents" && (
                  <Documents
                    data={documents}
                    onProjectDocumentUploadSuccess={handleDocumentUploadSuccess}
                    page="project"
                    comId={companyId}
                    projId={projectId}
                    projName={projectName}
                    comName={companyName}
                    latestUpdateTime={latestDocumentUpdateTime?.difference}
                    modifiedBy={latestDocumentUpdateTime?.modifiedBy}
                    fetchDocuments={fetchDocuments}
                  />
                )}
              {useHasAccessToFeature("F017", "P000000003") &&
                selectedTab === "QRE (%) - History" && (
                  // <RnDHistory />
                  <NewRndHistory
                    projectId={projectId}
                    symbol={symbol}
                    // data={teamData}
                    rndHistoryData={rndHistoryData}
                    latestUpdateTime={latestTeamUpdateTime?.difference}
                    modifiedBy={latestTeamUpdateTime?.modifiedBy}
                    fetchRnDHistoryData={fetchRnDHistoryData}
                    details={details?.overview[0]}
                    getTeamSortParams={getTeamSortParams}
                    page={"project"}
                  />
                )}
                {useHasAccessToFeature("F021", "P000000003") &&
                 selectedTab === "Manage CC Recipents" && (
                  <CompanyCC tab="Projects" projectId={projectId}/>
                 )}
            </Paper>
          </Box>
        </Box>
        <Toaster />
      </Box>
    </>
  );
}

export default ProjectsInfo;
