import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Button,
  CircularProgress,
  InputBase,
  InputLabel,
  Menu,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  InputAdornment,
  Drawer, Badge,
  Tooltip,
} from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { BaseURL } from "../../../constants/Baseurl";
import ProjectTableCell from "../../Common/ProjectTableCell";
import CaseAddProjectModal from "./CaseAddProjectModal";
import { CaseContext } from "../../../context/CaseContext";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Authorization_header } from "../../../utils/helper/Constant";
import { ProjectContext } from "../../../context/ProjectContext";
import ProjectsFilters from "../../Projects/ProjectsFilters";
import MiniTableHeader from "../../Common/MiniTableHeader";
// import FlagProjectsModal from "../../Common/FlagProjectsModal";
import { HiFilter } from "react-icons/hi";
import { areFiltersApplied } from "../../../utils/helper/AreFiltersApplied";
import CaseProjectFilters from "../../FilterComponents/CaseProjectFilter";
import DataProjectTableCell from "../../Common/DataProjectTableCell";
import { Add } from "@mui/icons-material";
import CompanyTableCell from "../../Common/CompanyTableCell";
import { formatFyscalYear } from "../../../utils/helper/FormatFiscalYear";
import TechSummaryIcon from "./TechSummaryModal/TechSummaryIcon";
import TechnicalSummary from "../TechnicalSummaryTab/TechnicalSummary";
import TechSummaryModal from "./TechSummaryModal/TechSummaryModal";
import SurveysIcon from "./SurveysModal/SurveysIcon";
import SurveyModal from "./SurveysModal/SurveyModal";
import InteractionIcon from "./InteractionsModal/InteractionsIcon";
import InteractionsListModal from "./InteractionsModal/InteractionsListModal";
import { formatStatus } from "../../../utils/helper/FormatStatus";
// import TechSummaryIcon from "./TechSummaryIcon";



const styles = {
  flexBoxItem: {
    display: "flex",
    justifyContent: "space-between",
    px: 2,
  },
  label: {
    color: "#404040",
    fontSize: "14px",
    fontWeight: 600,
  },
  inputBase: {
    borderRadius: "20px",
    height: "40px",
    border: "1px solid #E4E4E4",
    pl: 1,
    width: "200px",
  },
  iconStyle: { fontSize: "17px", color: "#00A398" },
  paperStyle: {
    display: "flex",
    flexDirection: "column",
    // gap: "0 2rem",
    margin: "auto",
    maxWidth: "100%",
  },
  titleStyle: {
    textAlign: "left",
    fontWeight: 600,
    fontSize: "13px",
  },
  uploadBoxStyle: {
    border: "1px dashed #E4E4E4",
    borderWidth: "2px",
    ml: 2,
    mr: 2,
    borderRadius: "20px",
    height: "300px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  buttonStyle: {
    mr: 1,
    borderRadius: "20px",
    textTransform: "capitalize",
    backgroundColor: "#9F9F9F",
    "&:hover": { backgroundColor: "#9F9F9F" },
  },
  uploadButtonStyle: {
    borderRadius: "10px",
    textTransform: "capitalize",
    backgroundColor: "#00A398",
    "&:hover": { backgroundColor: "#00A398" },
    width: "0.5em",
    height: "2.5em",
    fontSize: "12px",
    minWidth: "unset",
    padding: "4px 20px !important",
    marginRight: 3
  },
  modalStyle: {
    display: "flex",
  },
  innerBox: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    cursor: "pointer",
  },
  buttonBox: {
    mt: 1,
    display: "flex",
    justifyContent: "flex-end",
    px: 2,
    mb: 2,
  },
  searchIconStyle: {
    color: "#9F9F9F",
    ml: "3px",
    mr: "-3px",
    width: "20px",
    height: "20px",
  },
  cellStyle: {
    whiteSpace: "nowrap",
    borderRight: "1px solid #ddd",
    textAlign: "left",
    fontSize: "13px",
    py: 1,
  },
  cellCurrencyStyle: {
    whiteSpace: "nowrap",
    borderRight: "1px solid #ddd",
    textAlign: "right",
    fontSize: "13px",
    py: 1,
  },
  headerRowStyle: {
    backgroundColor: "rgba(64, 64, 64, 0.1)",
  },
  topBoxStyle: {
    borderBottom: "1px solid #E4E4E4",
    px: 2.5,
    textAlign: "left",
    py: 1,
  },
  addIconStyle: {
    fontSize: "25px",
    fontWeight: "bold",
    strokeWidth: "10px",
    color: "#FFFFFF",
  },
};

const styleConstants = {
  filterDownloadStyle: {
    color: "white",
    borderRadius: "50%",
    backgroundColor: "#00A398",
    fontSize: "28px",
    padding: "5px",
    marginRight: "16px",
    cursor: "pointer",
  },
  tableContainerStyle: {
    borderLeft: "1px solid #E4E4E4",
  },
};

const tableData = {
  columns: [
    "Project ID",
    "Project Name",
    "References",
    "Project Cost - Total",
    "Project Cost - FTE",
    "Project Cost - Subcon",
    "QRE (%) - Potential",
    "QRE (%) - Adjustment",
    "QRE (%) - Final",
    "SPOC Name",
    "SPOC Email",
    "Project Status",
    "Project Hours - FTE",
    "Project Hours - Subcon",
    "Project Hours - Total",
    "QRE - FTE",
    "QRE - Subcon",
    "QRE - Total",
    "R&D Credits",
    "Data Gathering",
    "Pending Data",
    "Timesheet Status",
    "Cost Status - Employee",
    "Cost Status - Subcon",
    "Survey - Status",
    "Survey - Sent Date",
    "Survey - Reminder Sent Date",
    "Survey - Response Date",
    "Interaction - Status",
    "Technical Interview Status",
    "Technical Summary Status",
    "Financial summary Status",
    "Claims Form Status",
    "Final Review Status",
    "Notes",
    "Last Updated Date",
    "Last Updated By",
    "Project Identifer",
  ],
  rows: [
    {
      id: 1,
      projectId: "",
      timesheet: "",
      month: "",
      rndHours: "",
      hourlyRate: "",
      rndExpense: "",
    },
  ],
};

const CaseProjectsTab = ({ company, currencySymbol, currency, documentType = "" }) => {
  const [search, setSearch] = useState("");
  const [filteredProject, setFilteredProject] = useState([]);
  const [caseProject, setCaseProjects] = useState(null);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(true);
  const { detailedCase, caseProjects, getSortParams, caseFilterState } = useContext(CaseContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [fetchCompanyProjects, setFetchCompanyProjects] = useState(false);
  const [flagModalOpen, setFlagModalOpen] = useState(false);
  const [filterClicked, setFilterClicked] = useState(false);
  // const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [projectSortParams, setProjectSortParams] = useState({ sortField: null, sortOrder: null });
  const { projectFilterState, currentState, } = useContext(ProjectContext);
  const [showTechSummary, setShowTechSummary] = useState(false);
  const textFieldRef = useRef(null);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [showInteraction, setShowInteraction] = useState(false);
  const [showSurveys, setShowSurveys] = useState(false);

  useEffect(() => {
    document.body.style.overflow = filterPanelOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [filterPanelOpen]);


  const fetchSortParams = ({ sortField, sortOrder }) => {
    switch (sortField) {
      case "Project Name":
        sortField = "projectName";
        break;
      case "Project ID":
        sortField = "projectCode";
        break;
      // case "Project Code":
      //   sortField = "projectCode";
      //   break;
      case "Account":
        sortField = "companyName";
        break;
      case "Fiscal Year":
        sortField = "fiscalYear";
        break;
      case "SPOC Name":
        sortField = "spocName";
        break;
      case "SPOC Email":
        sortField = "spocEmail";
        break;
      case "Data Gathering":
        sortField = "s_data_gathering";
        break;
      case "Pending Data":
        sortField = "s_pending_data";
        break;
      case "Project Status":
        sortField = "s_project_status";
        break;
      case "Survey - Status":
        sortField = "surveyStatus";
        break;
      case "interaction - Status":
        sortField = "s_interaction_status";
        break;
      case "Project Cost - FTE":
        sortField = "s_fte_cost";
        break;
      case "Project Cost - Subcon":
        sortField = "s_subcon_cost";
        break;
      case "Project Cost - Total":
        sortField = "s_total_project_cost";
        break;
      case "QRE Expense":
        sortField = "rndExpense";
        break;
      case "QRE (%) - Potential":
        sortField = "rndPotential";
        break;
      case "QRE (%) - Adjustment":
        sortField = "s_rnd_adjustment";
        break;
      case "QRE (%) - Final":
        sortField = "rndFinal";
        break;
      case "QRE - FTE":
        sortField = "s_fte_qre_cost";
        break;
      case "QRE - Subcon":
        sortField = "s_subcon_qre_cost";
        break;
      case "QRE - Final":
        sortField = "s_qre_cost";
        break;
      case "QRE - Total":
        sortField = "s_qre_cost";
        break;
      case "QRE Credits":
        sortField = "s_rd_credits";
        break;
      case "Timesheet Status":
        sortField = "s_timesheet_status";
        break;
      case "Cost Status - Employee":
        sortField = "s_fte_cost_status";
        break;
      case "Cost Status - Subcon":
        sortField = "s_subcon_cost_status";
        break;
      case "Survey - Sent Date":
        sortField = "surveySentDate";
        break;
      case "Survey - Reminder Sent Date":
        sortField = "reminderSentDate";
        break;
      case "Survey - Response Date":
        sortField = "surveyResponseDate";
        break;
      case "Interaction - Status":
        sortField = "s_interaction_status";
        break;
      case "Technical Interview Status":
        sortField = "s_technical_interview_status";
        break;
      case "Technical Summary Status":
        sortField = "s_technical_summary_status";
        break;
      case "Financial summary Status":
        sortField = "s_financial_summary_status";
        break;
      case "Claims Form Status":
        sortField = "s_claims_form_status";
        break;
      case "Final Review Status":
        sortField = "s_final_review_status";
        break;
      case "Last Updated Date":
        sortField = "s_last_updated_timestamp";
        break;
      case "Last Updated By":
        sortField = "s_last_updated_by";
        break;
      case "Project Hours - FTE":
        sortField = "s_fte_hours";
        break;
      case "Project Hours - Subcon":
        sortField = "s_subcon_hours";
        break;
      case "Project Hours - Total":
        sortField = "s_total_hours";
        break;
      case "Pending Data":
        sortField = "s_pending_data";
        break;
      case "Notes":
        sortField = "s_notes";
        break;
      case "Project Identifer":
        sortField = "projectIdentifier";
        break;
      case "Project Cost - Subcon":
        sortField = "s_subcon_cost";
        break;
      case "R&D Credits":
        sortField = "s_rd_credits";
        break;
      default:
        sortField = null;
    }
    setProjectSortParams({ sortField: sortField, sortOrder: sortOrder });
    getSortParams({ sortField, sortOrder });
  }

  const handleFlagModalClose = () => {
    setFlagModalOpen(false);
  };

  const handleFlagModalOpen = () => {
    setFlagModalOpen(true);
  }

  const handleSubmenuClick = (event, index) => {
    setAnchorEl(event.currentTarget);
    setSelectedIndex(index);
  };

  const handleAnchorClose = () => {
    setAnchorEl(null);
    setSelectedIndex(null);
  };

  const fetchAddedCaseProjects = async (filters = {}) => {
    setLoading(true);
    setCaseProjects([]);
    const options = caseFilterState;
    const payload = { headers: Authorization_header().headers };

    try {
      if (company) {
        const queryParams = new URLSearchParams();

        if (detailedCase?.caseId) queryParams.append("caseId", `${detailedCase.caseId}`);
        // if (options.caseId && options.caseId.length > 0) {
        //   queryParams.append("caseId", (options.caseId));
        // }
        // dropdown filter values
        // if (options.companyId && options.companyId?.length > 0)
        // queryParams.append("companyIds", JSON.stringify(options.companyId));
        if (options.spocName) { queryParams.append("spocNames", JSON.stringify(options.spocName)); }
        if (options.fiscalYear) { queryParams.append("fiscalYears", JSON.stringify(options.fiscalYear)); }
        if (options.spocEmail) { queryParams.append("spocEmails", JSON.stringify(options.spocEmail)); }
        if (options.dataGathering) { queryParams.append("dataGatherings", JSON.stringify(options.dataGathering)); }
        if (options.projectStatus) { queryParams.append("projectStatuses", JSON.stringify(options.projectStatus)); }
        if (options.surveyStatus) { queryParams.append("surveyStatuses", JSON.stringify(options.surveyStatus)); }
        if (options.interactionStatus) { queryParams.append("interactionStatuses", JSON.stringify(options.interactionStatus)); }
        if (options.timesheetStatus) { queryParams.append("timesheetStatuses", JSON.stringify(options.timesheetStatus)); }
        if (options.fteCostStatus) { queryParams.append("fteCostStatuses", JSON.stringify(options.fteCostStatus)); }
        if (options.subconCostStatus) { queryParams.append("subconCostStatuses", JSON.stringify(options.subconCostStatus)); }
        if (options.technicalInterviewStatus) { queryParams.append("technicalInterviewStatuses", JSON.stringify(options.technicalInterviewStatus)); }
        if (options.technicalSummaryStatus) { queryParams.append("technicalSummaryStatuses", JSON.stringify(options.technicalSummaryStatus)); }
        if (options.financialSummaryStatus) { queryParams.append("financialSummaryStatuses", JSON.stringify(options.financialSummaryStatus)); }
        if (options.claimsFormstatus) { queryParams.append("claimsFormStatuses", JSON.stringify(options.claimsFormstatus)); }
        if (options.finalReviewStatus) { queryParams.append("finalReviewStatuses", JSON.stringify(options.finalReviewStatus)); }
        if (options.lastUpdateBy) { queryParams.append("lastUpdatedBys", JSON.stringify(options.lastUpdateBy)); }

        //numeric value filter filed
        let rndPotential = [null, null];
        if (options.minRnDPotential != null && options.minRnDPotential !== 0) { rndPotential[0] = Number(options.minRnDPotential); }
        if (options.maxRnDPotential != null) { rndPotential[1] = Number(options.maxRnDPotential); }
        if (rndPotential[0] || rndPotential[1]) { queryParams.append("rndPotentials", JSON.stringify(rndPotential)); }

        let s_fte_cost = [null, null];
        if (options.minFteCost != null && options.minFteCost !== 0) { s_fte_cost[0] = (Number(options.minFteCost)); }
        if (options.maxFteCost != null) { s_fte_cost[1] = (Number(options.maxFteCost)); }
        if (s_fte_cost[0] || s_fte_cost[1]) { queryParams.append("fteCosts", JSON.stringify(s_fte_cost)); }

        let s_subcon_cost = [null, null];
        if (options.minSubconCost != null && options.minSubconCost !== 0) { s_subcon_cost[0] = Number(options.minSubconCost); }
        if (options.maxSubconCost != null) { s_subcon_cost[1] = Number(options.maxSubconCost); }
        if (s_subcon_cost[0] || s_subcon_cost[1]) { queryParams.append("subconCosts", JSON.stringify(s_subcon_cost)); }

        let s_total_project_cost = [null, null];
        if (options.minTotalProjectCost != null && options.minTotalProjectCost !== 0) { s_total_project_cost[0] = Number(options.minTotalProjectCost); }
        if (options.maxTotalProjectCost != null) { s_total_project_cost[1] = Number(options.maxTotalProjectCost); }
        if (s_total_project_cost[0] || s_total_project_cost[1]) { queryParams.append("totalProjectCosts", JSON.stringify(s_total_project_cost)); }

        let s_fte_qre_cost = [null, null];
        if (options.minQreFte != null && options.minQreFte !== 0) { s_fte_qre_cost[0] = Number(options.minQreFte); }
        if (options.maxQreFte != null) { s_fte_qre_cost[1] = Number(options.maxQreFte); }
        if (s_fte_qre_cost[0] || s_fte_qre_cost[1]) { queryParams.append("fteQreCosts", JSON.stringify(s_fte_qre_cost)); }

        let s_subcon_qre_cost = [null, null];
        if (options.minQreSubcon != null && options.minQreSubcon !== 0) { s_subcon_qre_cost[0] = Number(options.minQreSubcon); }
        if (options.maxQreSubcon != null) { s_subcon_qre_cost[1] = Number(options.maxQreSubcon); }
        if (s_subcon_qre_cost[0] || s_subcon_qre_cost[1]) { queryParams.append("subconQreCosts", JSON.stringify(s_subcon_qre_cost)); }

        let s_qre_cost = [null, null];
        if (options.minQreTotal != null && options.minQreTotal !== 0) { s_qre_cost[0] = Number(options.minQreTotal); }
        if (options.maxQreTotal != null) { s_qre_cost[1] = Number(options.maxQreTotal); }
        if (s_qre_cost[0] || s_qre_cost[1]) { queryParams.append("qreCosts", JSON.stringify(s_qre_cost)); }

        let s_fte_hours = [null, null];
        if (options.minFteHours != null && options.minFteHours !== 0) { s_fte_hours[0] = Number(options.minFteHours); }
        if (options.maxFteHours != null) { s_fte_hours[1] = Number(options.maxFteHours); }
        if (s_fte_hours[0] || s_fte_hours[1]) { queryParams.append("FTEhours", JSON.stringify(s_fte_hours)); }

        let s_subcon_hours = [null, null];
        if (options.minSubconHours != null && options.minSubconHours !== 0) { s_subcon_hours[0] = Number(options.minSubconHours); }
        if (options.maxSubconHours != null) { s_subcon_hours[1] = Number(options.maxSubconHours); }
        if (s_subcon_hours[0] || s_subcon_hours[1]) { queryParams.append("SubconHours", JSON.stringify(s_subcon_hours)); }

        let s_total_hours = [null, null];
        if (options.minTotalHours != null && options.minTotalHours !== 0) { s_total_hours[0] = Number(options.minTotalHours); }
        if (options.maxTotalHours != null) { s_total_hours[1] = Number(options.maxTotalHours); }
        if (s_total_hours[0] || s_total_hours[1]) { queryParams.append("TotalHours", JSON.stringify(s_total_hours)); }

        let s_rnd_adjustment = [null, null];
        if (options.minRndAdjustment != null && options.minRndAdjustment !== 0) { s_rnd_adjustment[0] = Number(options.minRndAdjustment); }
        if (options.maxRndAdjustment != null) { s_rnd_adjustment[1] = Number(options.maxRndAdjustment); }
        if (s_rnd_adjustment[0] || s_rnd_adjustment[1]) { queryParams.append("rndAdjustments", JSON.stringify(s_rnd_adjustment)); }

        let rndFinal = [null, null];
        if (options.minRndFinal != null && options.minRndFinal !== 0) { rndFinal[0] = Number(options.minRndFinal); }
        if (options.maxRndFinal != null) { rndFinal[1] = Number(options.maxRndFinal); }
        if (rndFinal[0] || rndFinal[1]) { queryParams.append("rndFinals", JSON.stringify(rndFinal)); }

        let s_rd_credits = [null, null];
        if (options.minRndCredits != null && options.minRndCredits !== 0) { s_rd_credits[0] = Number(options.minRndCredits); }
        if (options.maxRndCredits != null) { s_rd_credits[1] = Number(options.maxRndCredits); }
        if (s_rd_credits[0] || s_rd_credits[1]) { queryParams.append("rndCredits", JSON.stringify(s_rd_credits)); }

        //date filters

        const surveySentDates = [null, null];
        if (options.surveySentStartDate) { surveySentDates[0] = options.surveySentStartDate; }
        if (options.surveySentEndDate) { surveySentDates[1] = options.surveySentEndDate; }
        if (surveySentDates[0] || surveySentDates[1]) { queryParams.append("surveySentDates", JSON.stringify(surveySentDates)); }


        const reminderSentDates = [null, null];
        if (options.surveyReminderStartDate) { reminderSentDates[0] = (options.surveyReminderStartDate); }
        if (options.surveyReminderEndDate) { reminderSentDates[1] = options.surveyReminderEndDate; }
        if (reminderSentDates[0] || reminderSentDates[1]) { queryParams.append("reminderSentDates", JSON.stringify(reminderSentDates)); }

        const surveyResponseDates = [null, null];
        if (options.surveyResponseStartDate) { surveyResponseDates[0] = (options.surveyResponseStartDate); }
        if (options.surveyResponseEndDate) { surveyResponseDates[1] = options.surveyResponseEndDate; }
        if (surveyResponseDates[0] || surveyResponseDates[1]) { queryParams.append("surveyResponseDates", JSON.stringify(surveyResponseDates)); }

        const lastUpdatedDates = [null, null];
        if (options.lastUpdatedStartDate) { lastUpdatedDates[0] = (options.lastUpdatedStartDate); }
        if (options.lastUpdatedEndDate) { lastUpdatedDates[1] = options.lastUpdatedEndDate; }
        if (lastUpdatedDates[0] || lastUpdatedDates[1]) { queryParams.append("lastUpdatedTimestamps", JSON.stringify(lastUpdatedDates)); }

        // if (options?.timesheetId !== null && options?.timesheetId) {
        //   queryParams.append("timesheetId", (options.timesheetId));
        // }
        // if (options?.projectId !== null && options?.projectId) {
        //   queryParams.append("projectId", (options.projectId));
        // }

        if (options?.sortField != null && options?.sortField) {
          queryParams.append("sortField", options.sortField)
        }
        if (options?.sortOrder != null && options?.sortOrder) {
          queryParams.append("sortOrder", options.sortOrder)
        }


        if (projectSortParams?.sortField) queryParams.append("sortField", projectSortParams.sortField);
        if (projectSortParams?.sortOrder) queryParams.append("sortOrder", projectSortParams.sortOrder);

        const queryString = queryParams.toString();
        const url = `${BaseURL}/api/v1/projects/${localStorage.getItem("userid")}/projects${queryString ? `?${queryString}` : ""}`;

        const response = await axios.get(url, payload);
        setCaseProjects(response?.data?.data?.list || []);
        setFetchCompanyProjects(!fetchCompanyProjects);
        setLoading(false);
      } else {
        console.error("CaseId not available in data object");
        setLoading(false);
        setCaseProjects([]);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      setCaseProjects([]);
    }
  };
  useEffect(() => {
    const shouldFetchWithFiltersProjects =
      projectFilterState.companyIds?.length > 0 ||
      projectFilterState.projectNames?.length > 0 ||
      projectFilterState.spocName?.length > 0 ||
      projectFilterState.spocEmail?.length > 0 ||
      projectFilterState.accountingYear?.length > 0 ||
      projectFilterState.totalefforts?.length > 0 ||
      projectFilterState.rndExpense?.length > 0 ||
      projectFilterState.rndPotential?.length > 0;

    let options = {
      ...(projectFilterState.companyId?.length > 0 && { client: projectFilterState.companyId }),
      ...(projectFilterState.projectNames?.length > 0 && { projectNames: projectFilterState.projectNames }),
      ...(projectFilterState.spocName?.length > 0 && { spocName: projectFilterState.spocName }),
      ...(projectFilterState.spocEmail?.length > 0 && { spocEmail: projectFilterState.spocEmail }),
      ...(projectFilterState.totalefforts && { minTotalExpense: projectFilterState.totalefforts[0] }),
      ...(projectFilterState.totalefforts && { maxTotalExpense: projectFilterState.totalefforts[1] }),
      ...(projectFilterState.rndExpense && { minRnDExpense: projectFilterState.rndExpense[0] }),
      ...(projectFilterState.rndExpense && { maxRnDExpense: projectFilterState.rndExpense[1] }),
      ...(projectFilterState.rndPotential && { minRnDPotential: projectFilterState.rndPotential[0] }),
      ...(projectFilterState.rndPotential && { maxRnDPotential: projectFilterState.rndPotential[1] }),
    };

    fetchAddedCaseProjects(options);
  }, [currentState, projectSortParams]);

  const applyFiltersAndFetch = (filters) => {
    if (areFiltersApplied(appliedFilters)) {
      fetchAddedCaseProjects(filters);
    } else {
      // toast.error("Please select at least one filter.");
      fetchAddedCaseProjects(filters);
    }
  };
  const appliedFilters = {
    company: projectFilterState.company,
  };
  const handleRemoveProject = async (projectId) => {
    try {
      const response = await axios.put(
        `${BaseURL}/api/v1/case/${localStorage.getItem(
          "userid"
        )}/projects/${projectId}/remove`, {}, Authorization_header()
      );
      if (response?.data?.success) fetchAddedCaseProjects();
    } catch (error) {
      console.error(error);
    }
  };

  const handleFlagProject = async (projectId, caseFlag) => {
    try {
      const response = await axios.post(
        `${BaseURL}/api/v1/case/${localStorage.getItem("userid")}/caseFlag`,
        {
          projectId: projectId,
          caseId: detailedCase?.caseId,
          caseFlag: !caseFlag,
        }, Authorization_header()
      );
      fetchAddedCaseProjects();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setPage(0);
    fetchAddedCaseProjects();
    // fetchFilterProjectsList();
  }, [detailedCase?.caseId]);

  const handleFilterClick = () => {
    setFilterClicked(!filterClicked);
    setFilterPanelOpen(!filterPanelOpen);
    setFilterPanelOpen(!filterPanelOpen);
  };

  const handleFilterPanelClose = () => {
    setFilterPanelOpen(false);
    setTimeout(() => {
      setFilterPanelOpen(false);
      setFilterClicked(false);
    }, 0);
  };

  const handleFilterClose = () => {
    setFilterPanelOpen(false);
  };

  const handleTechSummaryClose = () => {
    setShowTechSummary(false);
  };

  const handleSurveyClose = () => {
    setShowSurveys(false);
  };

  const handleInteractionClose = () => {
    setShowInteraction(false);
  }

  const countActiveFilters = () => {
    let count = 0;
    if (projectFilterState?.company?.length > 0) count += 1;

    if (Array.isArray(projectFilterState?.projectNames)) {
      if (projectFilterState.projectNames.some(projectNames => projectNames?.trim() !== "")) {
        count += 1;
      }
    }

    if (Array.isArray(projectFilterState?.spocName)) {
      if (projectFilterState.spocName.some(spocName => spocName?.trim() !== "")) {
        count += 1;
      }
    }

    if (Array.isArray(projectFilterState?.spocEmail)) {
      if (projectFilterState.spocEmail.some(spocEmail => spocEmail?.trim() !== "")) {
        count += 1;
      }
    }

    if (Array.isArray(projectFilterState?.totalefforts)) {
      if (projectFilterState.totalefforts.some(expense => expense > 0)) {
        count += 1;
      }
    }

    if (Array.isArray(projectFilterState?.rndExpense)) {
      if (projectFilterState.rndExpense.some(expense => expense > 0)) {
        count += 1;
      }
    }

    if (Array.isArray(projectFilterState?.rndPotential)) {
      if (projectFilterState.rndPotential.some(potential => potential > 0)) {
        count += 1;
      }
    }

    return count;
  };

  useEffect(() => {
    if (caseProjects) {
      const searchText = search?.trim();
      const filteredData = caseProjects?.filter(
        (task) => {
          return task?.projectName?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
            task?.projectId?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
            task?.projectCode?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
            task.firstName?.toString()?.toLowerCase().includes(search.toLowerCase()) ||
            task.lastName?.toString()?.toLowerCase().includes(search.toLowerCase()) ||
            task.middleName?.toString()?.toLowerCase().includes(search.toLowerCase()) ||
            task.companyName?.toString()?.toLowerCase().includes(search.toLowerCase()) ||
            task.spocEmail?.toString()?.toLowerCase().includes(search.toLowerCase()) ||
            task.spocName?.toString()?.toLowerCase().includes(search.toLowerCase()) ||
            task?.s_data_gathering?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
            task?.companyId?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
            task?.company?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
            task?.accountingYear?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
            task?.s_pending_data?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
            task?.s_project_status?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
            task?.surveyStatus?.toString()?.toLowerCase()?.includes(search?.toLocaleLowerCase()) ||
            task.s_fte_cost?.toString()?.toLowerCase().includes(search.toLowerCase()) ||
            task.s_subcon_cost?.toString()?.toLowerCase().includes(search.toLowerCase()) ||
            task.s_total_project_cost?.toString()?.toLowerCase().includes(search.toLowerCase()) ||
            task?.s_data_gathering?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
            task?.rndPotential?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
            task?.s_rnd_adjustment?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
            task?.rndFinal?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
            task?.s_fte_qre_cost?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
            task?.s_subcon_qre_cost?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
            task?.s_qre_cost?.toString()?.toLowerCase()?.includes(search?.toLocaleLowerCase()) ||
            task?.s_rd_credits?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
            task?.s_timesheet_status?.toString()?.toLowerCase()?.includes(search?.toLocaleLowerCase()) ||
            task.s_fte_cost_status?.toString()?.toLowerCase().includes(search.toLowerCase()) ||
            task.s_subcon_cost_status?.toString()?.toLowerCase().includes(search.toLowerCase()) ||
            task.surveySentDate?.toString()?.toLowerCase().includes(search.toLowerCase()) ||
            task?.reminderSentDate?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
            task?.surveyResponseDate?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
            task?.surveyResponse?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
            task?.s_technical_interview_status?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
            task?.s_technical_summary_status?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
            task?.s_financial_summary_status?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
            task?.s_claims_form_status?.toString()?.toLowerCase()?.includes(search?.toLocaleLowerCase()) ||
            task?.s_final_review_status?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
            task?.s_last_updated_timestamp?.toString()?.toLowerCase()?.includes(search?.toLocaleLowerCase()) ||
            task.s_last_updated_by?.toString()?.toLowerCase().includes(search.toLowerCase()) ||
            task.s_fte_hours?.toString()?.toLowerCase().includes(search.toLowerCase()) ||
            task.s_subcon_hours?.toString()?.toLowerCase().includes(search.toLowerCase()) ||
            task?.s_total_hours?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
            task?.s_pending_data?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
            task?.s_notes?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
            task?.s_interaction_status?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
            task?.projectIdentifier?.toString()?.includes(search?.toLowerCase());
        })
      setFilteredProject(filteredData);
      setPage(0);
    }
  }, [caseProjects, search]);

  useEffect(() => {
    if (caseProject) {
      const searchText = search?.trim();
      const filteredData = caseProject?.filter(
        (task) =>
          task?.projectName?.toLowerCase()?.includes(search?.toLowerCase()) ||
          (task?.projectId + "")?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
          (task?.projectCode + "")?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
          task?.projectManager?.toLowerCase()?.includes(search?.toLowerCase()) ||
          task?.spocName?.toLowerCase()?.includes(search?.toLowerCase()) ||
          task?.spocEmail?.toLowerCase()?.includes(search?.toLowerCase()) ||
          task?.totalEfforts?.toString()?.includes(search?.toLowerCase()) ||
          task?.totalCosts?.toString()?.includes(search?.toLowerCase()) ||
          task?.totalRnDEfforts?.toString()?.includes(search?.toLowerCase()) ||
          task?.totalRnDCosts?.toString()?.includes(search?.toLowerCase())
      );
      setFilteredProject(filteredData);
      setPage(0);
    }
  }, [caseProject, search]);

  const handleChangePage = (event, newPage) => {
    const pageNum = Number(newPage);
    setPage(Number.isFinite(pageNum) ? pageNum : 0);
  };

  const handleChangeRowsPerPage = (event) => {
    const value = parseInt(event.target.value, 10);
    setRowsPerPage(Number.isFinite(value) ? value : 5);
    setPage(0);
  };

  const handleModalClose = () => {
    setOpen(!open);
  };

  const handleModalClose1 = () => {
    setModalOpen(false);
  };

  function formatCurrency(amount, locale, currency) {
    const formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    });
    let formattedAmount = formatter.format(amount);
    formattedAmount = formattedAmount.replace(/[a-zA-Z]/g, '').trim();

    return formattedAmount;
  };
  return (
    <>
      <TechSummaryModal open={showTechSummary} textFieldRef={textFieldRef} handleClose={handleTechSummaryClose} projectId={selectedProjectId} />
      <SurveyModal open={showSurveys} handleClose={handleSurveyClose} projectId={selectedProjectId} />
      <InteractionsListModal open={showInteraction} handleClose={handleInteractionClose} projectId={selectedProjectId} />
      <CaseAddProjectModal
        open={open}
        company={company}
        handleClose={handleModalClose}
        fetchAddedCaseProjects={fetchAddedCaseProjects}
        fetchCompanyProjects={fetchCompanyProjects}
        currencySymbol={currencySymbol}
        currency={currency}
      />
      <Paper
        sx={{ ...styles.paperStyle, ...(!open ? { display: "none" } : {}) }}
      >
        <Box
          sx={{
            px: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            margin: "0.3rem 0.3rem",
          }}
        >
          <Box sx={{ display: "flex", pt: 0, pb: page === "activity" ? -1 : 0 }}>
            <Box sx={{ marginLeft: "1px", marginTop: "-7px", display: "flex", alignItems: "center" }}>
              {!(page === "alerts") && (
                <Badge
                  badgeContent={countActiveFilters()}
                  color="error"
                  overlap="circular"
                  sx={{
                    zIndex: 2,
                    marginRight: "0px",
                    '& .MuiBadge-badge': {
                      minWidth: '10px',
                      height: '16px',
                      fontSize: '10px',
                      paddingLeft: '5',
                      transform: 'translate(25%, -25%)',
                      backgroundColor: '#FD5707',
                    },
                  }}
                >
                  <HiFilter
                    style={styleConstants.filterDownloadStyle}
                    onClick={handleFilterClick}
                  />
                </Badge>
              )}
            </Box>
            <InputLabel sx={styles.label}>Case Projects</InputLabel>
            <Drawer
              anchor="left"
              open={filterPanelOpen}
              onClose={handleFilterPanelClose}
              sx={{
                width: '300px',
                flexShrink: 0,
              }}
              variant="persistent"
            >
              {filterPanelOpen && (
                <CaseProjectFilters
                  handleClose={handleFilterPanelClose}
                  open={filterPanelOpen}
                  page={page}
                  documentType={documentType}
                  onApplyFilters={applyFiltersAndFetch}
                  style={{ position: 'absolute', left: 0 }}
                />
              )}
            </Drawer>
          </Box>
          <Box sx={{ display: "flex", gap: "2rem" }}>
            <Tooltip title="Add Projects">
              <Button
                variant="contained"
                sx={styles.uploadButtonStyle}
                onClick={() => handleModalClose()}
              >
                <Add style={styleConstants.addIconStyle} />
              </Button>
            </Tooltip>
          </Box>
          <InputBase
            type="text"
            value={search}
            placeholder="Search..."
            onChange={(e) => setSearch(e.target.value)}
            startAdornment={
              <InputAdornment position="start">
                <SearchIcon sx={styles.searchIconStyle} />
              </InputAdornment>
            }
            sx={{
              ...styles.inputBase,
              width: "30%",
              alignItems: "right",
              mr: -0.5,
              ml: -42,
              height: "35px",
              mb: 0.2
            }}
          />
          {/* <Box sx={{ display: "flex", gap: "2rem" }}>
            <Button
              variant="contained"
              sx={styles.uploadButtonStyle}
              onClick={() => handleModalClose()}
            >
              <Add style={styleConstants.addIconStyle} />
            </Button>
          </Box> */}
        </Box>
        <Box
          sx={{
            flexGrow: 1,
            marginLeft: filterPanelOpen ? '300px' : '0',
            px: 2,
          }}
        >
          <TableContainer sx={{
            maxHeight: "82vh",
            overflowY: "auto",
            borderTopLeftRadius: "20px",
            height: 300,
          }}>
            <Table stickyHeader aria-label="simple table">
              {/* <TableHead>
                <TableRow sx={styles?.headerRowStyle}>
                  <TableCell
                    sx={{
                      ...styles?.cellStyle,
                      textAlign: "left",
                      backgroundColor: "#ECECEC",
                    }}
                  >
                    Project Id
                  </TableCell>
                  <TableCell
                    sx={{
                      ...styles?.cellStyle,
                      textAlign: "left",
                      backgroundColor: "#ECECEC",
                    }}
                  >
                    Project Name
                  </TableCell>
                  <TableCell
                    sx={{
                      ...styles?.cellStyle,
                      textAlign: "left",
                      backgroundColor: "#ECECEC",
                    }}
                  >
                    Project Code
                  </TableCell>
                  <TableCell
                    sx={{
                      ...styles?.cellStyle,
                      textAlign: "left",
                      backgroundColor: "#ECECEC",
                    }}
                  >
                    SPOC Name
                  </TableCell>
                  <TableCell
                    sx={{
                      ...styles?.cellStyle,
                      textAlign: "left",
                      backgroundColor: "#ECECEC",
                    }}
                  >
                    SPOC Email
                  </TableCell>
                  {/* <TableCell
                    sx={{
                      ...styles?.cellStyle,
                      textAlign: "left",
                      backgroundColor: "#ECECEC",
                    }}
                  >
                    Total Efforts(Hrs)
                  </TableCell> 
                  <TableCell
                    sx={{
                      ...styles?.cellStyle,
                      textAlign: "right",
                      backgroundColor: "#ECECEC",
                    }}
                  >
                    {`Total Cost (${currencySymbol} ${currency})`}

                  </TableCell>
                  {/* <TableCell
                    sx={{
                      ...styles?.cellStyle,
                      textAlign: "left",
                      backgroundColor: "#ECECEC",
                    }}
                  >
                    Total QRE Efforts(Hrs)
                  </TableCell> 
                  <TableCell
                    sx={{
                      ...styles?.cellStyle,
                      textAlign: "left",
                      backgroundColor: "#ECECEC",
                    }}
                  >
                    {`QRE Cost (${currencySymbol} ${currency})`}
                  </TableCell>
                  <TableCell
                    sx={{
                      ...styles?.cellStyle,
                      textAlign: "left",
                      backgroundColor: "#ECECEC",
                    }}
                  >
                    QRE Potential(%)
                  </TableCell>
                </TableRow>
              </TableHead> */}
              <MiniTableHeader tableData={tableData} fetchSortParams={fetchSortParams} />
              <TableBody>
                {filteredProject
                  ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  ?.map((row, rowIndex) => {
                    return (
                      <TableRow
                        hover
                        tabIndex={-1}
                        key={row?.projectId + row?.FirstName}
                        sx={{
                          cursor: "pointer",
                          backgroundColor: row?.flag ? "#F4C4AE" : "",
                        }}
                      >
                        <DataProjectTableCell
                          id={row?.projectId}
                          name={`${row?.projectCode || ""}`}
                        // name={`${row?.projectId || ""}`}
                        />
                        <ProjectTableCell
                          id={row?.projectId}
                          name={`${row?.projectName}`}
                        />
                        <TableCell sx={{ ...styles?.cellStyle }} onClick={() => {
                          setSelectedProjectId(row?.projectId);
                        }}>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between', // Evenly space the icons
                              alignItems: 'center',          // Center vertically
                              width: '100%',                 // Ensure the box takes up the full width
                            }}
                          >
                            <TechSummaryIcon showTechSummary={showTechSummary} setShowTechSummary={setShowTechSummary} />
                            <SurveysIcon showSurvey={showSurveys} setShowSurvey={setShowSurveys} />
                            <InteractionIcon showInteractions={showInteraction} setShowInteractions={setShowInteraction} />
                          </Box>
                        </TableCell>
                        {/* <DataProjectTableCell
                          id={row?.projectId}
                          name={`${row?.projectCode || ""}`}
                        // name={`${row?.projectId || ""}`}
                        /> */}
                        {/* <CompanyTableCell id={row?.companyId} name={row?.companyName} /> */}
                        {/* <TableCell sx={{ ...styles?.cellStyle, textAlign: "center" }}>{row?.fiscalYear ? formatFyscalYear(row?.fiscalYear) : ""}</TableCell> */}
                        <TableCell sx={styles?.cellCurrencyStyle}>
                          {row?.s_total_project_cost ? formatCurrency(row?.s_total_project_cost, "en-US", row?.currency || "USD") : ""}
                        </TableCell>
                        <TableCell sx={styles?.cellCurrencyStyle}>
                          {row?.s_fte_cost ? formatCurrency(row?.s_fte_cost, "en-US", row?.currency || "USD") : ""}
                        </TableCell>
                        {/* <TableCell sx={styles?.cellCurrencyStyle}>
                          {row?.rndPotential ? `${currencySymbol}` + new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(row?.rndPotential) : ""}
                        </TableCell> */}
                        <TableCell sx={styles?.cellCurrencyStyle}>
                          {row?.s_subcon_cost ? formatCurrency(row?.s_subcon_cost, "en-US", row?.currency || "USD") : ""}
                        </TableCell>
                        <TableCell sx={{ ...styles?.cellCurrencyStyle, textAlign: "right" }}>
                          {row?.rndPotential !== null & row?.rndPotential !== undefined
                            ? parseFloat(row?.rndPotential).toFixed(2).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                            : ""}
                        </TableCell>
                        {/* <TableCell sx={{ ...styles?.cellCurrencyStyle, textAlign: "left" }}>
                          {row?.rndFinal !== null & row?.rndFinal !== undefined
                            ? parseFloat(row?.rndFinal).toFixed(2).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                            : ""}
                        </TableCell> */}
                        <TableCell sx={{ ...styles?.cellStyle, textAlign: "right" }}>
                          {(row?.s_rnd_adjustment || "")}
                        </TableCell>
                        <TableCell sx={{ ...styles?.cellCurrencyStyle, textAlign: "right" }}>
                          {(row?.rndFinal !== null & row?.rndFinal !== undefined) ? parseFloat(row?.rndFinal).toFixed(2).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ""}
                        </TableCell>
                        <TableCell sx={{ ...styles?.cellStyle, textAlign: "left" }}>
                          {(row?.spocName || "")}
                        </TableCell>
                        <TableCell sx={{ ...styles?.cellStyle, textAlign: "left" }}>
                          {(row?.spocEmail || "")}
                        </TableCell>
                        
                        <TableCell sx={styles?.cellCurrencyStyle}>
                          {row?.s_project_status ? formatStatus(row?.s_project_status) : ""}
                        </TableCell>
                        
                        
                        <TableCell sx={styles?.cellCurrencyStyle}>
                          {row?.s_fte_hours ? row?.s_fte_hours : ""}
                        </TableCell>
                        <TableCell sx={styles?.cellCurrencyStyle}>
                          {row?.s_subcon_hours ? row?.s_subcon_hours : ""}
                        </TableCell>
                        <TableCell sx={{ ...styles?.cellStyle, textAlign: "right" }}>
                          {(row?.s_total_hours || "")}

                        </TableCell>
                        


                        {/* <TableCell sx={{ ...styles?.cellCurrencyStyle, textAlign: "left" }}>
                        {row?.rndFinal ? formatCurrency(row?.rndFinal, "en-US", row?.currency || "USD") : ""}
                        </TableCell> */}
                        <TableCell sx={{ ...styles?.cellCurrencyStyle, textAlign: "left" }}>
                          {row?.s_fte_qre_cost ? formatCurrency(row?.s_fte_qre_cost, "en-US", row?.currency || "USD") : ""}
                        </TableCell>
                        <TableCell sx={{ ...styles?.cellCurrencyStyle, textAlign: "left" }}>
                          {row?.s_subcon_qre_cost ? formatCurrency(row?.s_subcon_qre_cost, "en-US", row?.currency || "USD") : ""}
                        </TableCell>
                        <TableCell sx={{ ...styles?.cellStyle, color: "#00A398", textAlign: "left", position: "relative", }}>{row?.s_qre_cost ? formatCurrency(row?.s_qre_cost, "en-US", row?.currency || "USD") : ""}</TableCell>
                        <TableCell sx={{ ...styles?.cellStyle, color: "#00A398", textAlign: "left", position: "relative", }}>{row?.s_rd_credits ? formatCurrency(row?.s_rd_credits, "en-US", row?.currency || "USD") : ""}</TableCell>
                        <TableCell sx={{ ...styles?.cellStyle, textAlign: "left" }}>
                          {(row?.s_data_gathering || "")}
                        </TableCell>
                        <TableCell sx={{ ...styles?.cellStyle, textAlign: "left" }}>
                          {row?.s_pending_data || ""}
                        </TableCell>
                        <TableCell sx={{ ...styles?.cellStyle, textAlign: "left" }}>
                          {formatStatus(row?.s_timesheet_status) || ""}
                        </TableCell>
                        <TableCell sx={{ ...styles?.cellStyle, textAlign: "left" }}>
                          {formatStatus(row?.s_fte_cost_status) || ""}
                        </TableCell>
                        <TableCell sx={{ ...styles?.cellStyle, textAlign: "left" }}>
                          {formatStatus(row?.s_subcon_cost_status) || ""}
                        </TableCell>
                        <TableCell sx={{ ...styles?.cellStyle, textAlign: "left" }}>
                          {row?.surveyStatus
                            ? row?.surveyStatus
                              .toLowerCase()
                              .replace(/(^\w|[^a-zA-Z0-9]+(\w))/g, (match, p1, chr) => ' ' + p1.toUpperCase())
                              .trim()
                            : ""}
                        </TableCell>
                        <TableCell sx={styles?.cellCurrencyStyle}>{row?.surveySentDate?.replaceAll('Z', '').replaceAll('T', ' ')}</TableCell>
                        <TableCell sx={styles?.cellCurrencyStyle}>{row?.reminderSentDate?.replaceAll('Z', '').replaceAll('T', ' ')}</TableCell>
                        <TableCell sx={styles?.cellCurrencyStyle}>{row?.surveyResponseDate?.replaceAll('Z', '').replaceAll('T', ' ')}</TableCell>

                        <TableCell sx={{ ...styles?.cellStyle, textAlign: "left" }}>
                          {formatStatus(row?.s_interaction_status) || ""}
                        </TableCell>
                        <TableCell sx={{ ...styles?.cellStyle, textAlign: "left" }}>
                          {formatStatus(row?.s_technical_interview_status) || ""}
                        </TableCell>
                        <TableCell sx={{ ...styles?.cellStyle, textAlign: "left" }}>
                          {formatStatus(row?.s_technical_summary_status) || ""}
                        </TableCell>
                        <TableCell sx={{ ...styles?.cellStyle, textAlign: "left" }}>
                          {formatStatus(row?.s_financial_summary_status) || ""}
                        </TableCell>
                        <TableCell sx={{ ...styles?.cellStyle, textAlign: "left" }}>
                          {formatStatus(row?.s_claims_form_status) || ""}
                        </TableCell>
                        <TableCell sx={{ ...styles?.cellStyle, textAlign: "left" }}>
                          {formatStatus(row?.s_final_review_status) || ""}
                        </TableCell>
                        <TableCell sx={{ ...styles?.cellStyle, textAlign: "left" }}>
                          {row?.s_notes || ""}
                        </TableCell>
                        <TableCell sx={styles?.cellCurrencyStyle}>{row?.s_last_updated_timestamp?.replaceAll('Z', '').replaceAll('T', ' ')}</TableCell>
                        <TableCell sx={styles?.cellCurrencyStyle}>{row?.s_last_updated_by}</TableCell>
                        <TableCell sx={{ ...styles?.cellStyle, color: "#00A398", textAlign: "left", position: "relative", }}>{row?.projectIdentifier}</TableCell>
                        {/* <TableCell sx={styles?.cellStyle}>
                          {row?.totalRnDEfforts ? new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(row?.totalRnDEfforts) : ""}
                        </TableCell> */}
                        {/* <TableCell sx={styles?.cellCurrencyStyle}>
                          {row?.rndExpense ? `${currencySymbol}` + new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(row?.rndExpense) : ""}
                        </TableCell> */}
                        {/* <TableCell sx={styles?.cellCurrencyStyle}>
                          {row?.rndPotential || ""}
                        </TableCell> */}
                        {/* <TableCell sx={styles?.cellStyle}>
                          <MoreVertIcon
                            sx={{
                              color: "#9F9F9F",
                              cursor: "pointer",
                              transform:
                                selectedIndex !== rowIndex
                                  ? "none"
                                  : "rotate(90deg)",
                            }}
                            onClick={(event) =>
                              handleSubmenuClick(event, rowIndex)
                            }
                          />
                          <Menu
                            anchorEl={anchorEl}
                            open={
                              Boolean(anchorEl) && selectedIndex === rowIndex
                            }
                            onClose={handleAnchorClose}
                          >
                            {row?.surveyCode &&
                              <MenuItem onClick={handleAnchorClose}>
                                {row?.surveyCode}
                              </MenuItem>
                            }
                            <MenuItem
                              onClick={() =>
                                handleRemoveProject(row?.caseProjectId)
                              }
                            >
                              Remove Project
                            </MenuItem>
                          </Menu>
                        </TableCell> */}
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
            {loading && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "50px",
                  minHeight: "380px",
                }}
              >
                <CircularProgress sx={{ color: "#00A398" }} />
              </div>
            )}
            {filteredProject.length === 0 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "50px",
                  minHeight: "380px",
                }}
              >
                No projects found.
              </div>
            )}
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredProject?.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
        {/* <FlagProjectsModal open={flagModalOpen} handleClose={handleFlagModalClose} /> */}
        <Toaster />
      </Paper>
    </>
  );
};

export default CaseProjectsTab
