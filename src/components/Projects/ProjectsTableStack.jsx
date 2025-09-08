import { CircularProgress, Table, TableContainer, Box, Drawer, Badge, Button, Select, MenuItem, TextField, Grid, Typography, IconButton, ThemeProvider, createTheme } from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { BaseURL } from "../../constants/Baseurl";
import { FilterListContext } from "../../context/FiltersListContext";
import { ProjectContext } from "../../context/ProjectContext";
import { areFiltersApplied } from "../../utils/helper/AreFiltersApplied";
import { useHasAccessToFeature } from "../../utils/helper/HasAccessToFeature";
import CustomPagination from "../Common/CustomPagination";
import TableHeader from "../Common/TableHeader";
import TableIntro from "../Common/TableIntro";
import usePinnedData from "../CustomHooks/usePinnedData";
import ProjectModal from "./ProjectModal";
import ProjectsTableBody from "./ProjectsTableBody";
import { Authorization_header, token_obj } from "../../utils/helper/Constant";
import SpocModalForm from "../Common/SpocModalForm";
import ProjectsAddModal from "./ProjectsAddModal";
import SheetsListing from "../Common/SheetsListing";
import { SheetsContext } from "../../context/SheetsContext";
import { HiFilter } from "react-icons/hi";
import ProjectsFilters from "./ProjectsFilters";
import DownloadModalForm from "../Common/DownloadModalForm";
import { ClientContext } from "../../context/ClientContext";
import { DataGrid, GridToolbarColumnsButton } from "@mui/x-data-grid";
import { postRecentlyViewed } from "../../utils/helper/PostRecentlyViewed";
import StraightIcon from '@mui/icons-material/Straight';
import { useNavigate } from "react-router-dom";
import { formatStatus } from "../../utils/helper/FormatStatus";
const tableData = {
  columns: [
    "Project Code", "Project Name", "Account", "Fiscal Year", "Project Cost - FTE",
    "Project Cost - Subcon", "Project Cost - Total", "QRE (%) - Potential", "QRE (%) - Adjustment", "QRE (%) - Final",
    "SPOC Name", "SPOC Email", "Project Status", "Project Hours - FTE", "Project Hours - Subcon", "Project Hours - Total",
    "QRE - FTE", "QRE - Subcon", "QRE - Total", "R&D Credits",
    "Data Gathering", "Pending Data", "Timesheet Status", "Cost Status - Employee", "Cost Status - Subcon", "Survey - Status",
    "Survey - Sent Date", "Survey - Reminder Sent Date", "Survey - Response Date", "Interaction - Status", "Technical Interview Status",
    "Technical Summary Status", "Financial summary Status", "Claims Form Status", "Final Review Status", "Notes",
    "Last Updated Date", "Last Updated By", "Project Identifier",
  ],
};
const styles = {
  uploadButtonStyle: {
    borderRadius: "20px",
    textTransform: "capitalize",
    backgroundColor: "#00A398",
    "&:hover": { backgroundColor: "#00A398" },
  },
  buttonStyle: {
    mr: 1,
    borderRadius: "20px",
    textTransform: "capitalize",
    backgroundColor: "#9F9F9F",
    "&:hover": { backgroundColor: "#9F9F9F" },
  }, iconStyle: { fontSize: "20px", color: "#9F9F9F" },
  newCompanyButtonStyle: {
    textTransform: "capitalize",
    borderRadius: "20px",
    backgroundColor: "#00A398",
    mr: 2,
    mb: "-5%",
    "&:hover": {
      backgroundColor: "#00A398",
    },
  },
  editedCellStyle: {
    backgroundColor: "red !important",
    color: "white!important",
  },
  redText: {
    color: "red",
  },
}
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
  overlay: {
  },
  containerDimmed: {
  },
};
const headerCellStyle = {
  fontSize: "13px",
  borderRight: "1px solid #ddd",
  borderLeft: "1px solid #ddd",
  whiteSpace: "nowrap",
  py: 0.8,
  textAlign: "left",
  position: "sticky",
  top: 0,
  zIndex: 10,
  backgroundColor: "#ececec",
  cursor: "pointer",
};
const theme = createTheme({
  components: {
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: '#00A398 !important',
          height: '-5em',
        },
        checked: {
          color: '#00A398 !important',

        },
        menu: {
          sx: {
            width: '150px',
            fontSize: '12px',
            padding: '4px 8px',
          },
        },
      },
    },
  },
});

function ProjectsTableStack({ onApplyFilters, page, documentType = "", data, latestUpdateTime, getSelectedTab, projectsSheets }) {
  const { projects, fetchProjects, projectFilterState, setCurrentState, currentState, loading, setProjectFilterState, sortParams,
    setSortPrams,
    getProjectsSortParams,
  } = useContext(ProjectContext);
  const navigate = useNavigate();
  const { clientData } = useContext(ClientContext);
  const [currentPageProjects, setCurrentPageProjects] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filteredRows, setFilteredRows] = useState([]);
  const { pinnedObject } = usePinnedData();
  const { fetchUserDetails } = useContext(FilterListContext);
  const [updateIds, setUpdateIds] = useState([]);
  const [updatePurpose, setUpdatePurpose] = useState("updates");
  const [handleConfirmationModalOpen, setHandleConfirmationModalOpen] = useState(false);
  const [updateData, setUpdateData] = useState([]);
  const [downloadData, setDownloadData] = useState([]);
  const [showSendUpdates, setShowSendupdates] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [spocProjects, setSpocProjects] = useState([]);
  const { fetchProjectsSheets } = useContext(SheetsContext);
  const [spockName, setSpockName] = useState("");
  const [spockEmail, setSpockEmail] = useState("");
  const [sheetsToBeShown, setSheetsToBeShown] = useState([]);
  const [filterClicked, setFilterClicked] = useState(false);
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [activeFilterCount, setActiveFilterCount] = useState(0);
  const [dataGatheringOptions, setDataGatheringOptions] = useState([]);
  const [projectStatusOptions, setProjectStatusOptions] = useState([]);
  const [timesheetStatusOptions, setTimesheetStatusOptions] = useState([]);
  const [fteSalaryStatusOptions, setFTESalaryStatusOptions] = useState([]);
  const [subconSalaryStatusOptions, setSubconSalaryStatusOptions] = useState([]);
  const [technicalInterviewStatusOptions, setTechnicalInterviewStatusOptions] = useState([]);
  const [technicalSummaryStatusOptions, setTechnicalSummaryStatusOptions] = useState([]);
  const [financialSummaryStatusOptions, setFinancialSummaryStatusOptions] = useState([]);
  const [claimsFormStatusOptions, setClaimsFormStatusOptions] = useState([]);
  const [finalReviewStatusOptions, setFinalReviewStatusOptions] = useState([]);
  const [interactionStatusOptions, setInteractionStatusOptions] = useState([]);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const [highlightedRows, setHighlightedRows] = useState({});
  const [showSaveCancelButtons, setShowSaveCancelButtons] = useState(false);
  const [editFields, setEditFields] = useState({});
  const [editedCells, setEditedCells] = useState([]);
  const [editedValues, setEditedValues] = useState({});
  const fieldNameMapping = {
    projectid: "projectCode",
    projectcode: "projectCode",
    projectname: "projectName",
    account: "companyName",
    companyId: 'companyId',
    fiscalyear: "fiscalYear",
    spocname: "spocName",
    spocemail: "spocEmail",
    projectstatus: "s_project_status",
    projectcostfte: "s_fte_cost",
    projectcostsubcon: "s_subcon_cost",
    projectcosttotal: "s_total_project_cost",
    projecthoursfte: "s_fte_hours",
    projecthourssubcon: "s_subcon_hours",
    projecthourstotal: "s_total_hours",
    qrepotential: "rndPotential",
    qreadjustment: "s_rnd_adjustment",
    qrefinal: "rndFinal",
    qrefte: "s_fte_qre_cost",
    qresubcon: "s_subcon_qre_cost",
    qretotal: "s_qre_cost",
    rdcredits: "s_rd_credits",
    datagathering: "s_data_gathering",
    pendingdata: "s_pending_data",
    timesheetstatus: "s_timesheet_status",
    coststatusemployee: "s_fte_cost_status",
    coststatussubcon: "s_subcon_cost_status",
    surveystatus: "surveyStatus",
    surveysentdate: "surveySentDate",
    surveyremindersentdate: "reminderSentDate",
    surveyresponsedate: "surveyResponseDate",
    interactionstatus: "s_interaction_status",
    technicalinterviewstatus: "s_technical_interview_status",
    technicalsummarystatus: "s_technical_summary_status",
    financialsummarystatus: "s_financial_summary_status",
    claimsformstatus: "s_claims_form_status",
    finalreviewstatus: "s_final_review_status",
    notes: "s_notes",
    lastupdateddate: "s_last_updated_timestamp",
    lastupdatedby: "s_last_updated_by",
    projectidentifier: "projectIdentifier"
  };
  const formatFiscalYear = (fiscalYear) => {
    const currentYear = fiscalYear;
    const previousYear = currentYear - 1;
    return `${previousYear}-${currentYear?.toString()?.slice(-2)}`;
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
  }
  const removeSpecialCharsAndLowerCase = (str) => {
    return str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "");
  };

  useEffect(() => {
    // console.log(projects);
  }, [projects])

  useEffect(() => {
  if (Array.isArray(projects)) {
    const mappedRows = projects?.map((row) => {
      const mappedRow = {};
      Object.keys(fieldNameMapping)?.forEach((field) => {
        const mappedField = fieldNameMapping[field];

        if (mappedField === "fiscalYear") {
          mappedRow[field] = formatFiscalYear(row[mappedField]);
        } 
        else if (["s_fte_cost", "s_subcon_cost", "s_total_project_cost", "s_fte_qre_cost", "s_subcon_qre_cost", "s_qre_cost"]?.includes(mappedField)) {
          mappedRow[field] = formatCurrency(row[mappedField], 'en-US', row?.currency || 'USD');
        } 
        else if (["surveySentDate", "reminderSentDate", "surveyResponseDate"]?.includes(mappedField)) {
          const rawDate = row[mappedField];
          mappedRow[field] = rawDate ? rawDate?.split("T")[0] : "";
        } 
        else if (["s_last_updated_timestamp"]?.includes(mappedField)) {
          const rawDate = row[mappedField];
          mappedRow[field] = rawDate ? rawDate?.replaceAll("Z", "").replaceAll("T", " ") : "";
        } 
        else if ([
          "s_claims_form_status", "s_data_gathering", "s_final_review_status", "s_financial_summary_status",
          "s_fte_cost_status", "s_interaction_status", "s_project_status", "s_rnd_status",
          "s_technical_interview_status", "s_technical_summary_status", "s_timesheet_status", "surveyStatus", "s_subcon_cost_status"
        ]?.includes(mappedField)) {
          mappedRow[field] = formatStatus(row[mappedField] || "");
        } 
        else {
          mappedRow[field] = row[mappedField] || "";
        }
      });

      mappedRow.id = row.projectId || `generated-id-${Math?.random()}`;
      return mappedRow;
    });

    const lowerCaseSearch = search?.toLowerCase();
    const filteredData = search
      ? mappedRows.filter((row) =>
          Object.values(row)
            .filter(Boolean)
            .some((value) =>
              value.toString().toLowerCase().includes(lowerCaseSearch)
            )
        )
      : mappedRows;

    setFilteredRows(filteredData);
  } else {
    setFilteredRows([]);
  }
}, [projects, search]);


  const mappedRows = Array.isArray(projects)
    ? projects.map((row) => {
      const mappedRow = {};
      Object.keys(fieldNameMapping).forEach((field) => {
        const mappedField = fieldNameMapping[field];
        mappedRow[field] = row[mappedField] || "";
      });
      mappedRow.id = row.projectId;
      return mappedRow;
    })
    : [];

  const [rows, setRows] = useState(mappedRows);
  const handleColumnClick = (col) => {
    const fieldName = removeSpecialCharsAndLowerCase(col);
    const mappedField = fieldNameMapping[fieldName];
    if (sortField === mappedField) {
      if (sortOrder === "asc") {
        setSortOrder("dsc");
      } else if (sortOrder === "dsc") {
        setSortOrder(null);
        setSortField(null);
      } else {
        setSortOrder("asc");
      }
    } else {
      setSortField(mappedField);
      setSortOrder("asc");
    }
  };
  useEffect(() => {
    if (page === "projects") {
      getProjectsSortParams({ sortField, sortOrder });
      const options = {
        sortField,
        sortOrder
      };
      fetchProjects(options);
    }
  }, [sortField, sortOrder, page]);
  const renderSortIcons = (column, index) => {
    const fieldName = removeSpecialCharsAndLowerCase(column);
    const mappedField = fieldNameMapping[fieldName];
    let upColor = activeColor;
    let downColor = activeColor;
    let upOpacity = 0.6;
    let downOpacity = 0.6;
    if (sortField === mappedField) {
      if (sortOrder === "asc") {
        upColor = "#FD5707";
        downColor = inactiveColor;
        upOpacity = 10.8;
        downOpacity = 0.8;
      } else if (sortOrder === "dsc") {
        upColor = inactiveColor;
        downColor = "#FD5707";
        upOpacity = 0.2;
        downOpacity = 0.8;
      }
    }

    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <StraightIcon
          fontSize="small"
          style={{
            color: upColor,
            opacity: upOpacity,
            marginRight: -5,
            fontSize: "17px",
          }}
          onClick={() => handleColumnClick(column)}
        />
        <StraightIcon
          fontSize="small"
          style={{
            color: downColor,
            opacity: downOpacity,
            marginLeft: -5,
            fontSize: "17px",
            transform: "rotate(180deg)",
          }}
          onClick={() => handleColumnClick(column)}
        />
      </Box>
    );
  };
  const sortRows = (rows) => {
    if (!sortField || !sortOrder) return rows;
    return [...rows].sort((a, b) => {
      const fieldA = a[sortField];
      const fieldB = b[sortField];
      if (fieldA < fieldB) {
        return sortOrder === "asc" ? -1 : 1;
      }
      if (fieldA > fieldB) {
        return sortOrder === "asc" ? 1 : -1;
      }
      return 0;
    });
  };

  useEffect(() => {
    const sortedRows = sortRows(rows);
    setRows(sortedRows);
  }, [sortField, sortOrder]);
  const nonEditableFields = ["projectCode", "projectName", "companyName", "fiscalYear", "s_total_project_cost", "s_total_hours", "rndPotential", "rndFinal", "s_qre_cost", "surveyStatus", "surveySentDate", "surveyremindersentdate", "surveyResponseDate", "s_last_updated_timestamp", "s_last_updated_by", "projectIdentifier"];
  const handleEditValueChange = (event, params) => {
    const newValue = event.target.value;
    setEditedValues((prev) => ({
      ...prev,
      [`${params.id}-${params.field}`]: newValue,
    }));

    params.api.setEditCellValue({ id: params.id, field: params.field, value: newValue }, event);
  };

  const columns = tableData.columns.map((col) => {
    const fieldName = removeSpecialCharsAndLowerCase(col);
    const mappedField = fieldNameMapping[fieldName];
    return {
      field: fieldName,
      headerName: col,
      width: 250,
      editable: !nonEditableFields.includes(mappedField),
      sortable: false,
      headerAlign: 'center',
      renderHeader: () => (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {col}
          {renderSortIcons(col, mappedField)}
        </Box>
      ),
      renderCell: (params) => {
        const isCentered = ["fiscalyear", "surveysentdate", "surveyremindersentdate", "surveyresponsedate", "lastupdateddate", "projectidentifier"].includes(params.field);
        const isRightAligned = ["projectcostfte", "projectcostsubcon", "projectcosttotal", "projecthoursfte", "projecthourssubcon", "projecthourstotal", "qrepotential", "qreadjustment", "qrefinal", "qrefte", "qresubcon", "qretotal", "rdcredits"].includes(params.field);
        const isEditingCell = editedCells.some(
          (cell) => cell.rowId === params.row.id && cell.field === params.field
        );
        const isFieldEdited = editFields[params.row.id]?.hasOwnProperty(mappedField);
        const cellStyle = {
          backgroundColor: isEditingCell || isFieldEdited ? "#FBCEB1" : "transparent",
          padding: "0px",
          textAlign: isRightAligned ? 'right' : isCentered ? 'center' : 'left',
        };

        const displayValue = editedValues[`${params.id}-${params.field}`] || params.value;

        if (
          params.field === "projectname" ||
          params.field === "account" ||
          params.field === "projectcode" ||
          params.field === ""
        ) {
          return (
            <Typography
              className="value-text"
              sx={{
                display: "flex",
                justifyContent: isCentered ? "center" : "flex-start",
                alignItems: "center",
                color: "#00A398",
                textDecoration: "underline",
                fontSize: "13px",
                lineHeight: 2.5,
                marginBottom: "0",
                ...cellStyle,
              }}
              title={displayValue}
            >
              {displayValue}
            </Typography>
          );
        }

        return (
          <div style={cellStyle}>
            {displayValue}
          </div>
        );
      },
      ...(mappedField && {
        renderEditCell: (params) => {
          const handleCellEditStart = () => {
            setEditedCells((prev) => {
              const updatedCells = [...prev];
              const cellIndex = updatedCells.findIndex(
                (cell) => cell.rowId === params.row.id && cell.field === params.field
              );

              if (cellIndex === -1) {
                updatedCells.push({ rowId: params.row.id, field: params.field });
              }
              return updatedCells;
            });
          };

          let options = [];
          switch (fieldName) {
            case "projectstatus":
              options = projectStatusOptions;
              break;
            case "datagathering":
              options = dataGatheringOptions;
              break;
            case "timesheetstatus":
              options = timesheetStatusOptions;
              break;
            case "coststatusemployee":
              options = fteSalaryStatusOptions;
              break;
            case "coststatussubcon":
              options = subconSalaryStatusOptions;
              break;
            case "interactionstatus":
              options = interactionStatusOptions;
              break;
            case "technicalinterviewstatus":
              options = technicalInterviewStatusOptions;
              break;
            case "technicalsummarystatus":
              options = technicalSummaryStatusOptions;
              break;
            case "financialsummarystatus":
              options = financialSummaryStatusOptions;
              break;
            case "claimsformstatus":
              options = claimsFormStatusOptions;
              break;
            case "finalreviewstatus":
              options = finalReviewStatusOptions;
              break;
            default:
              break;
          }
          if (options.length === 0) {
            return (
              <TextField
                value={editedValues[`${params.id}-${params.field}`] || params.value || ""}
                onChange={(event) => handleEditValueChange(event, params)}
                fullWidth
              />
            );
          }
          return (
            <Select
              value={editedValues[`${params.id}-${params.field}`] || params.value || ""}
              onChange={(event) => handleEditValueChange(event, params)}
              fullWidth
            >
              {options.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          );
        },
      }),
    };
  });


  const activeColor = "#404040";
  const inactiveColor = "#ccc";
  let upColor = activeColor;
  let downColor = activeColor;
  if (sortField === columns) {
    if (sortOrder === "asc") {
      downColor = "#FD5707";
      upColor = inactiveColor;
    } else if (sortOrder === "dsc") {
      upColor = "#FD5707";
      downColor = inactiveColor;
    }
  }
  const handleProjectClick = (id) => {
    (async () => {
      await postRecentlyViewed(id, "projects");
      navigate(`/projects/info?projectId=${encodeURIComponent(id)}`);
    })();
  };
  const handleCompanyClick = (companyid) => {
    (async () => {
      await postRecentlyViewed(companyid, "company");
      navigate(`/accounts/info?companyId=${encodeURIComponent(companyid)}`);
    })();
  };
  const handleRowClick = (params) => {
    if (params.field === "projectcode" || params.field === "projectname") {
      handleProjectClick(params.row.id);
    }
    else if (params.field === "account") {
      handleCompanyClick(params?.row?.companyId);
    }
  };
  const handleCellEditStart = (params) => {
    setShowSaveCancelButtons(true);
    setEditedCells((prev) => [...prev, { rowId: params.id, field: params.field }]);
    if (!editedValues[`${params.id}-${params.field}`]) {
      setEditedValues((prev) => ({
        ...prev,
        [`${params.id}-${params.field}`]: params.value,
      }));
    }
  };

  const processRowUpdate = (newRow, oldRow) => {
    const { id } = newRow;
    const editedFields = Object.keys(newRow).filter(
      (key) => newRow[key] !== oldRow[key]
    );
    if (editedFields.length > 0) {
      const updatedFields = {};

      editedFields.forEach((field) => {
        const backendField = fieldNameMapping[field];
        if (backendField) {
          updatedFields[backendField] = newRow[field];
        }
      });
      if (Object.keys(updatedFields).length > 0) {
        setEditFields((prev) => ({
          ...prev,
          [id]: {
            ...prev[id],
            ...updatedFields,
          },
        }));
      }
      setRows((prevRows) =>
        prevRows.map((row) =>
          row.id === id ? { ...row, ...newRow } : row
        )
      );
    }
    setHighlightedRows((prev) => ({
      ...prev,
      [id]: false,
    }));
    return newRow;
  };
  const handleSave = async () => {
    const apiUrl = `${BaseURL}/api/v1/projects/${localStorage.getItem(
      "userid"
    )}/0/edit-project`;
    const data = {
      editFields: editFields
    };
    try {
      const response = await axios.post(apiUrl, JSON.stringify(data), {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token_obj.accessToken}`,
        },
      });

      if (response?.data?.success) {
        fetchProjects();
      } else {
        console.error("API call unsuccessful:", response?.data);
      }

      setEditFields({});
      setEditedCells([]);
      setEditedValues({});
      setShowSaveCancelButtons(false);
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      const url = `${BaseURL}/api/v1/projects/get-project-field-options`;
      try {
        const response = await axios.get(url, Authorization_header());
        setClaimsFormStatusOptions(response?.data?.data?.s_claims_form_status);
        setFinalReviewStatusOptions(response?.data?.data?.s_final_review_status);
        setFinancialSummaryStatusOptions(response?.data?.data?.s_financial_summary_status);
        setTechnicalSummaryStatusOptions(response?.data?.data?.s_technical_summary_status);
        setDataGatheringOptions(response?.data?.data?.s_data_gathering);
        setProjectStatusOptions(response?.data?.data?.s_project_status);
        setTimesheetStatusOptions(response?.data?.data?.s_timesheet_status);
        setFTESalaryStatusOptions(response?.data?.data?.s_fte_cost_status);
        setSubconSalaryStatusOptions(response?.data?.data?.s_subcon_cost_status);
        setTechnicalInterviewStatusOptions(response?.data?.data?.s_technical_interview_status);
        setInteractionStatusOptions(response?.data?.data?.s_interaction_status);
      } catch (error) {
        console.error("Failed to fetch Projects:", error);
      }
    };
    fetchData();
  }, []);
  const handleCancel = () => {
    fetchProjects();
    setEditFields({});
    setEditedCells([]);
    setEditedValues({});
    setShowSaveCancelButtons(false);
  };
  const projectNavs = [
    { name: "All Projects", isAuth: true },
    { name: "Uploaded Sheets", isAuth: true }
  ];
  const [selectedTab, setSelectedTab] = useState("All Projects");
  const [pinStates, setPinStates] = useState({
    "All Projects": false,
    "Recently Viewed": false,
  });
  const [showAddProjectsModal, setShowAddProjectsModal] = useState(false);

  const appliedFilters = {
    company: projectFilterState.company,
  };
  useEffect(() => {
    document.body.style.overflow = filterPanelOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [filterPanelOpen]);

  useEffect(() => {
    if (projectsSheets && projectsSheets.length > 0) {
      let i = 0;
      let newSheets = [];
      for (; i < itemsPerPage; i++) {
        let obj = {};
        for (let key in projectsSheets[0]) {
          obj[key] = "";
        }
        newSheets.push(obj);
      }
      setSheetsToBeShown(newSheets);
    }
  }, [itemsPerPage]);

  const handleUpdateSpockData = (spName, spMail) => {
    setSpockName(spName);
    setSpockEmail(spMail);
  }

  const handleSelectedTab = (name) => {
    setSelectedTab(name);
  }

  const handleSendMail = async ({ updateIds }) => {
    toast.loading(`${updatePurpose} sending...`);
    const querryData = { updateIds: [...updateIds], purpose: "PROJECT", spocName: spockName, spocEmail: spockEmail };
    if (updatePurpose === "updates") {
      querryData.sendupdate = true;
    }
    try {
      const res = await axios.post(`${BaseURL}/api/v1/contacts/${localStorage.getItem(
        "userid"
      )}/update-spoc`, querryData, Authorization_header());
      toast.dismiss();
      toast.success(`${updatePurpose} sent successfully...`);

    } catch (error) {
      toast.dismiss();
      toast.error(error?.response?.data?.message || `Failed to send ${updatePurpose}. Server error`);
      console.error(error);
    }
  }
  const filterSpocProjects = () => {
    if (Array.isArray(projects)) {
      const sp = projects.filter((p) => {
        return (!p.spocName || !p.spocEmail || p.spocEmail === "" || p.spocName === "");
      });
      setSpocProjects(sp);
    } else {
      setSpocProjects([]);
    }
  };


  useEffect(() => {
    filterSpocProjects();
  }, [projects])

  useEffect(() => {
    const updatedPinStates = {
      "All Projects": pinnedObject.PROJ === "ALL",
      "Recently Viewed": pinnedObject.PROJ === "RV",
    };
    setPinStates(updatedPinStates);
  }, [pinnedObject.PROJ]);

  useEffect(() => {
    const shouldFetchWithFiltersProjects =
      projectFilterState.companyIds?.length > 0 ||
      projectFilterState.spocName?.length > 0 ||
      projectFilterState.spocEmail?.length > 0 ||
      projectFilterState.accountingYear?.length > 0 ||
      projectFilterState.totalExpense?.length > 0 ||
      projectFilterState.rndExpense?.length > 0 ||
      projectFilterState.rndPotential?.length > 0;
    let projectOptions = {};
    if (shouldFetchWithFiltersProjects) {
      projectOptions = {
        ...(projectFilterState.companyIds?.length > 0 && {
          companyIds: projectFilterState.companyIds,
        }),
        ...(projectFilterState.accountingYear?.length > 0 && {
          accountingYear: projectFilterState.accountingYear,
        }),
        ...(projectFilterState.spocName?.length > 0 && {
          spocName: projectFilterState.spocName,
        }),
        ...(projectFilterState.spocEmail?.length > 0 && {
          spocEmail: projectFilterState.spocEmail,
        }),
        ...(projectFilterState.totalExpense && {
          minTotalExpense: projectFilterState.totalExpense[0],
          maxTotalExpense: projectFilterState.totalExpense[1],
        }),
        ...(projectFilterState.rndExpense && {
          minRnDExpense: projectFilterState.rndExpense[0],
          maxRnDExpense: projectFilterState.rndExpense[1],
        }),
        ...(projectFilterState.rndPotential && {
          minRnDPotential: projectFilterState.rndPotential[0],
          maxRnDPotential: projectFilterState.rndPotential[1],
        }),
      };
    }
  }, [projectFilterState, currentState]);

  const applyFiltersAndFetch = (filters) => {
    if (areFiltersApplied(appliedFilters)) {
      fetchProjects(filters);
    } else {
      fetchProjects(filters);
    }
  };

  const totalPagesProjects = Math.ceil(filteredRows?.length / itemsPerPage);
  const totalPagesSheets = Math.ceil(projectsSheets?.length / itemsPerPage);
  const handleChangePage = (newPage) => {
    setCurrentPageProjects(newPage);
  };
  const handleChangeItemsPerPage = (items) => {
    setItemsPerPage(items);
    setCurrentPageProjects(1);
  };
  const currentData = filteredRows?.slice(
    (currentPageProjects - 1) * itemsPerPage,
    currentPageProjects * itemsPerPage
  );

  while (currentData?.length < itemsPerPage) {
    currentData?.push({});
  }

  const handleUploadClick = () => {
    setModalOpen(true);
  };


  const handleProjectsUploadClick = () => {
    setShowAddProjectsModal(true);
  }

  const handleProjectsUploadClose = () => {
    setShowAddProjectsModal(false);
  }

  const handleSendUpdatesClick = (val) => {
    setUpdateIds([]);
    if (updatePurpose === 'updates') {
      setShowSendupdates(true);
    }
    setUpdatePurpose("updates");
  }

  const handleDownloadClick = (val) => {
    setDownloadData([]);
    setShowDownloadModal(true);
  }

  const handleDownloadClick2 = () => {
    // console.log("Download sheet");
  }

  const handleShowSendUpdates = () => {
    setShowSendupdates(!showSendUpdates);
  }

  const handleCloseDownloadModal = () => {
    setShowDownloadModal(false);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleSearch = (input) => {
    setSearch(input);
  };

  const handleSelectedHeaderItem = (item) => {
    setCurrentState(item);
  };

  useEffect(() => {
    setCurrentState(
      pinnedObject?.PROJ === "RV" ? "Recently Viewed" : "All Projects"
    );
  }, [localStorage?.getItem("keys")]);

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

  useEffect(() => {
    getSelectedTab(selectedTab);
    setCurrentPageProjects(1)
  }, [selectedTab])

  const handleUploadProject = async (values) => {
    const apiUrl = `${BaseURL}/api/v1/projects/${localStorage.getItem("userid")}/${values.companyId}/projects-upload`;

    const data = {
      companyId: values.companyId,
      projects: values.file,
    };
    toast.loading("Uploading projects sheet....");
    try {
      const tokens = localStorage.getItem('tokens');
      const token_obj = JSON.parse(tokens);
      const response = await axios.post(apiUrl, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          'Authorization': `Bearer ${token_obj?.accessToken}`
        }
      });
      handleProjectsUploadClose();
      fetchProjectsSheets();
      toast.dismiss();
      toast.success(response?.data?.message || "Projects uploaded successfully");
    } catch (error) {
      console.error(error);
      toast.dismiss();
      toast.error(error?.response?.data?.message || "Failed to upload projects sheet.");
    }
  };

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
  const countActiveFilters = () => {
    let count = 0;
    const storedFilters = JSON.parse(localStorage.getItem("projectFilters")) || projectFilterState;

    // if (storedFilters?.company?.length > 0) count += 1;
    // if (storedFilters?.accYear?.length > 0) count += 1;

    if (projectFilterState?.company?.length > 0) count += 1;
    if (projectFilterState?.fiscalYear?.length > 0) count += 1;

    if (Array.isArray(storedFilters?.spocName)) {
      if (storedFilters.spocName.some(spocName => spocName?.trim() !== "")) { count += 1; }
    }
    if (Array.isArray(storedFilters?.spocEmail)) {
      if (storedFilters.spocEmail.some(spocEmail => spocEmail?.trim() !== "")) { count += 1; }
    }

    if (Array.isArray(storedFilters?.dataGathering)) {
      if (storedFilters.dataGathering.some(dataGathering => dataGathering?.trim() !== "")) { count += 1; }
    }
    if (Array.isArray(storedFilters?.projectStatus)) {
      if (storedFilters.projectStatus.some(projectStatus => projectStatus?.trim() !== "")) { count += 1; }
    }
    if (Array.isArray(storedFilters?.surveyStatus)) {
      if (storedFilters.surveyStatus.some(surveyStatus => surveyStatus?.trim() !== "")) { count += 1; }
    }
    if (Array.isArray(storedFilters?.timesheetStatus)) {
      if (storedFilters.timesheetStatus.some(timesheetStatus => timesheetStatus?.trim() !== "")) { count += 1; }
    }
    if (Array.isArray(storedFilters?.fteCostStatus)) {
      if (storedFilters.fteCostStatus.some(fteCostStatus => fteCostStatus?.trim() !== "")) { count += 1; }
    }
    if (Array.isArray(storedFilters?.subconCostStatus)) {
      if (storedFilters.subconCostStatus.some(subconCostStatus => subconCostStatus?.trim() !== "")) { count += 1; }
    }
    if (Array.isArray(storedFilters?.technicalInterviewStatus)) {
      if (storedFilters.technicalInterviewStatus.some(technicalInterviewStatus => technicalInterviewStatus?.trim() !== "")) { count += 1; }
    }


    if (Array.isArray(storedFilters?.technicalSummaryStatus)) {
      if (storedFilters.technicalSummaryStatus.some(technicalSummaryStatus => technicalSummaryStatus?.trim() !== "")) { count += 1; }
    }

    if (Array.isArray(storedFilters?.financialSummaryStatus)) {
      if (storedFilters.financialSummaryStatus.some(financialSummaryStatus => financialSummaryStatus?.trim() !== "")) { count += 1; }
    }

    if (Array.isArray(storedFilters?.claimsFormstatus)) {
      if (storedFilters.claimsFormstatus.some(claimsFormstatus => claimsFormstatus?.trim() !== "")) { count += 1; }
    }

    if (Array.isArray(storedFilters?.finalReviewStatus)) {
      if (storedFilters.finalReviewStatus.some(finalReviewStatus => finalReviewStatus?.trim() !== "")) { count += 1; }
    }

    if (Array.isArray(storedFilters?.lastUpdateBy)) {
      if (storedFilters.lastUpdateBy.some(lastUpdateBy => lastUpdateBy?.trim() !== "")) { count += 1; }
    }
    if (Array.isArray(storedFilters?.s_fte_cost)) {
      if (storedFilters.s_fte_cost.some(expense => expense > 0)) { count += 1; }
    }
    if (Array.isArray(storedFilters?.s_subcon_cost)) {
      if (storedFilters.s_subcon_cost.some(expense => expense > 0)) { count += 1; }
    }
    if (Array.isArray(storedFilters?.s_total_project_cost)) {
      if (storedFilters.s_total_project_cost.some(expense => expense > 0)) { count += 1; }
    }
    if (Array.isArray(storedFilters?.s_fte_qre_cost)) {
      if (storedFilters.s_fte_qre_cost.some(expense => expense > 0)) { count += 1; }
    }
    if (Array.isArray(storedFilters?.s_subcon_qre_cost)) {
      if (storedFilters.s_subcon_qre_cost.some(expense => expense > 0)) { count += 1; }
    }
    if (Array.isArray(storedFilters?.s_qre_cost)) {
      if (storedFilters.s_qre_cost.some(expense => expense > 0)) { count += 1; }
    }
    if (Array.isArray(storedFilters?.s_fte_hours)) {
      if (storedFilters.s_fte_hours.some(expense => expense > 0)) { count += 1; }
    }
    if (Array.isArray(storedFilters?.s_subcon_hours)) {
      if (storedFilters.s_subcon_hours.some(expense => expense > 0)) { count += 1; }
    }
    if (Array.isArray(storedFilters?.s_total_hours)) {
      if (storedFilters.s_total_hours.some(expense => expense > 0)) { count += 1; }
    }
    if (Array.isArray(storedFilters?.s_rnd_adjustment)) {
      if (storedFilters.s_rnd_adjustment.some(expense => expense > 0)) { count += 1; }
    }
    if (Array.isArray(storedFilters?.rndFinal)) {
      if (storedFilters.rndFinal.some(expense => expense > 0)) { count += 1; }
    }
    if (Array.isArray(storedFilters?.s_rd_credits)) {
      if (storedFilters.s_rd_credits.some(expense => expense > 0)) { count += 1; }
    }
    if (Array.isArray(storedFilters?.rndPotential)) {
      if (storedFilters.rndPotential.some(potential => potential > 0)) { count += 1; }
    }
    return count;
  };

  const updateFilters = (newFilters) => {
    setProjectFilterState(newFilters);
    const count = countActiveFilters(newFilters);
    setActiveFilterCount(count);

    localStorage.setItem("projectFilters", JSON.stringify(newFilters));
  };

  const CustomToolbar = () => {
    return (
      <Box
        className="custom-toolbar"
        sx={{
          position: 'absolute',
          top: '10px',
          left: '5px',
          zIndex: 2,
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          p: 0.5,
        }}
      >
        <GridToolbarColumnsButton
          componentsProps={{
            menu: {
              sx: {
                height: "10px",
                width: '150px',
                fontSize: '12px',
                padding: '4px 8px',
              },
            },
          }}
          sx={{
            '& .MuiCheckbox-root': {
              color: 'red !important',
              height: '16px',
              width: '16px',
              padding: 0,
            },
            '& .Mui-checked': {
              color: 'red !important',
            },
          }}
        />
      </Box>
    );
  };

  return (
    <>
      {filterPanelOpen && <div style={styleConstants.overlay} />}
      <Box
        sx={{
          opacity: filterPanelOpen ? 15 : 1,
          transition: 'opacity 0.3s ease-in-out',
        }}
      >
        <Box>
          <DownloadModalForm open={showDownloadModal} tableColumn={tableData} handleClose={handleCloseDownloadModal} projects={projects} company={clientData} fetchProjects={fetchProjects} />
        </Box >
        <Box>
          <SpocModalForm open={showSendUpdates} tableColumn={tableData} handleClose={handleShowSendUpdates} handleSendMail={handleSendMail} handleSurveysMailOpen={handleShowSendUpdates} handleConfirmationModalOpen={handleConfirmationModalOpen} updateData={updateData} updatePurpose={updatePurpose} projects={projects} handleUpdateSpockData={handleUpdateSpockData} fetchProjects={fetchProjects} />
        </Box >
        <TableIntro
          heading={
            pinnedObject?.PROJ === "RV" ? "Recently Viewed" : "All Projects"
          }
          btnName={"Project"}
          btnName2={"SPOC"}
          btnNameD={""}
          btnName3={"Upload"}
          page={"project"}
          data={projects}
          totalItems={filteredRows?.length || 0}
          currentPage={currentPageProjects}
          itemsPerPage={itemsPerPage}
          onUploadClick={handleUploadClick}
          onUploadClick2={handleSendUpdatesClick}
          onUploadClick3={handleProjectsUploadClick}
          onDownloadClick={handleDownloadClick}
          onDownloadClick2={handleDownloadClick2}
          onSearch={handleSearch}
          items={["All Projects", "Recently Viewed"]}
          latestUpdateTime={latestUpdateTime}
          onApplyFilters={applyFiltersAndFetch}
          appliedFilters={appliedFilters}
          createPermission={useHasAccessToFeature("F013", "P000000007")}
          searchPermission={useHasAccessToFeature("F013", "P000000009")}
          onSelectedItem={handleSelectedHeaderItem}
          isPinnedState={pinStates[currentState]}
          onPinClicked={() => togglePinState(currentState)}
          projectNavs={projectNavs}
          handleSelectedTab={handleSelectedTab}
          selectedTab={selectedTab}
          totalSheetsNumber={projectsSheets?.length}
          countActiveFilters={countActiveFilters}
        />
        <ProjectsAddModal
          open={showAddProjectsModal}
          handleClose={handleProjectsUploadClose}
          handleSubmit={handleUploadProject}
          type={"upload"}
        />
        <ProjectModal
          open={modalOpen}
          handleClose={handleModalClose}
          fetchProjectData={fetchProjects}
        />
        {/*<CustomPagination
          currentPage={currentPageProjects}
          totalPages={selectedTab === "All Projects" ? totalPagesProjects : totalPagesSheets}
          changePage={handleChangePage}
          changeItemsPerPage={handleChangeItemsPerPage}
          minRows={20}
        /> */}
        <Box sx={{ display: "flex", pt: 0, pb: page === "activity" ? -1 : 0 }}>
          <Box sx={{ marginLeft: "14px", marginTop: "-85px", display: "flex", alignItems: "center" }}>
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
              <ProjectsFilters
                handleClose={handleFilterPanelClose}
                open={filterPanelOpen}
                page={page}
                documentType={documentType}
                onApplyFilters={onApplyFilters}
                countActiveFilters={countActiveFilters}
                style={{ position: 'absolute', left: 0 }}
              />
            )}
          </Drawer>
        </Box>
        <Box
          sx={{
            flexGrow: 1,
            marginLeft: filterPanelOpen ? '300px' : '0',
            // maxHeight: "82vh",
            // overflowY: "auto",
          }}
        >
          {selectedTab === "All Projects" && <TableContainer
            sx={{
              maxHeight: "75vh",
              // overflowY: "auto",
              position: 'relative',
              borderTopLeftRadius: "10px",
            }}>
            <div
              style={{
                ...headerCellStyle,
                textAlign: "center",
                width: "100%",
                height: "calc(101vh - 200px)",
              }}
            >
              <ThemeProvider theme={theme}>
                                                                             
                <DataGrid
                  columns={columns}
                  rows={filteredRows}
                  getRowId={(row) => row.projectId || row.id}
                  // hideFooter
                  loading={false}
                  // disableColumnResize={true}
                  processRowUpdate={processRowUpdate}
                  // onProcessRowUpdateError={handleProcessRowUpdateError}
                  onCellEditStart={handleCellEditStart}
                  onCellClick={handleRowClick}
                  currentPage={currentPageProjects}
                  itemsPerPage={itemsPerPage}
                  experimentalFeatures={{ newEditingApi: true }}
                  slots={{
                    toolbar: CustomToolbar,
                  }}
                  density="compact"
                  sx={{
                    backgroundColor: "white",
                    "& .MuiDataGrid-columnHeader": {
                      position: "sticky",
                      left: 0,
                      zIndex: 1,
                      backgroundColor: "#ececec !important",
                      borderTop: "1px solid #ddd",
                      borderRight: "1px solid #ddd",
                    },
                    "& .MuiDataGrid-cell": {
                      backgroundColor: "white",
                      borderRight: "1px solid #ccc",
                    },
                    '& .MuiDataGrid-row': {
                      backgroundColor: (params) =>
                        highlightedRows[params.id] ? '#FFCDD2' : 'inherit', // Red background for edited rows
                      transition: 'background-color 0.3s',
                    },
                    '& .MuiDataGrid-columnMenu': {
                      width: '150px',
                      fontSize: '12px',
                      '& .MuiMenuItem-root': {
                        padding: '6px 8px',
                      },
                    },
                    "& .MuiDataGrid-footerContainer": {
                      backgroundColor: "#ececec",
                      mt: "-10px"
                    },
                  }}
                />
              </ThemeProvider>
              {showSaveCancelButtons && (
                <Box
                  sx={{
                    position: "fixed",
                    bottom: 0,
                    marginTop: -4,
                    left: 0,
                    width: "100%",
                    display: "flex",
                    gap: 2,
                    justifyContent: "center",
                    bgcolor: "background.paper",
                    py: 1,
                    boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <Button
                    variant="contained"
                    onClick={handleCancel}
                    sx={{ bgcolor: "#9F9F9F", height: "2em", width: "5.5em", "&:hover": { bgcolor: "#9F9F9F" } }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleSave}
                    sx={{ bgcolor: "#00A398", height: "2em", "&:hover": { bgcolor: "#00A398" } }}
                  >
                    Save
                  </Button>
                </Box>
              )}
            </div>
            {/* <Table sx={{ minWidth: 650, borderBottomLeftRadius: "20px", }} aria-label="simple table">
              <TableHeader tableData={tableData} page="projects" />
              {!loading && <ProjectsTableBody
                data={currentData}
                currentPage={currentPageProjects}
                itemsPerPage={itemsPerPage}
                projectId={projectId}
                fetchProjects={fetchProjects}
                editFields={editFields}
              />
              }
            </Table> */}
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

            {currentData?.length === 0 && (
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
          </TableContainer>}
        </Box>
        <Box
          sx={{
            flexGrow: 1,
            marginLeft: filterPanelOpen ? '300px' : '0',
            // maxHeight: "82vh",
            // overflowY: "auto",
          }}
        >
          {selectedTab === "Uploaded Sheets" && <SheetsListing
            sx={{
              maxHeight: "82vh",
              overflowY: "auto",
              borderTopLeftRadius: "20px",
            }}
            page={"projects"} projectsSheets={projectsSheets} itemsPerPage={itemsPerPage} />}
        </Box>
      </Box>
      {/* <CustomPagination
        currentPage={currentPageProjects}
        totalPages={selectedTab === "All Projects" ? totalPagesProjects : totalPagesSheets}
        changePage={handleChangePage}
        changeItemsPerPage={handleChangeItemsPerPage}
        minRows={20}
      /> */}
      <Toaster />
    </>
  );
}

export default ProjectsTableStack;