import {
  Box,
  Button,
  CircularProgress,
  InputLabel,
  Table,
  TableContainer,
  TablePagination,
  Tooltip,
  InputBase,
  InputAdornment,
  Drawer,
  Badge,
} from "@mui/material";
import React, { useContext, useEffect, useRef, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import MiniTableHeader from "../../Common/MiniTableHeader";
import CaseInteractionListingData from "./CaseInteractionListingData";
import { BaseURL } from "../../../constants/Baseurl";
import axios from "axios";
import { CaseContext } from "../../../context/CaseContext";
import NewInteractionModal from "../../Common/NewInteractionModal";
import toast from "react-hot-toast";
import { Authorization_header } from "../../../utils/helper/Constant";
import SpocIncludeProjectsModal from "../SpocIncludeProjectsModal";
import FormatDatetime from "../../../utils/helper/FormatDatetime";
import { HiFilter } from "react-icons/hi";
import { areFiltersApplied } from "../../../utils/helper/AreFiltersApplied";
import InteractionFilters from "../../FilterComponents/InteractionFilters";
import ProjectinteractionFilter from "../../FilterComponents/ProjectInteractionFilter";
import { ProjectContext } from "../../../context/ProjectContext";
import { Download, Edit, Send, Update, UploadFile } from "@mui/icons-material";
import CaseInteractionDownlaod from "../../Common/CaseInteractionDownlaod";
import ProjectInteractionDownlaod from "../../Common/ProjectInteractionDownlaod";
import UploadInteractionModalForm from "./UploadInteractionModalForm";

const columns = [
  "Interaction ID",
  "Interaction History",
  "Project ID",
  "Project Name",
  "Project Code",
  "Status",
  "Sent Date",
  "Response Date",
  // "Reminder Sent Date",
  "Sent To",
  "External Link",
];

const styles = {
  inputBase: {
    borderRadius: "20px",
    height: "40px",
    pl: 1,
    width: "100px",
    border: "1px solid #E4E4E4",
  },
  label: {
    color: "#404040",
    fontSize: "14px",
    fontWeight: 600,
    ml: "-160px",
  },
  searchIconStyle: {
    color: "#9F9F9F",
    ml: "3px",
    mr: "-3px",
    width: "10px",
    height: "20px",
  },
  uploadButtonStyle: {
    borderRadius: "20px",
    textTransform: "capitalize",
    backgroundColor: "#00A398",
    "&:hover": { backgroundColor: "#00A398" },
    width: "8.1em",
    height: "2.3em",
  },
  buttonStyle: {
    mr: 1,
    borderRadius: "20px",
    textTransform: "capitalize",
    backgroundColor: "#9F9F9F",
    "&:hover": { backgroundColor: "#9F9F9F" },
  },
  iconStyle: { fontSize: "20px", color: "#9F9F9F" },

  uploadButtonStyle1: {
    minWidth: 'auto',
    padding: '0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#00A398",
    "&:hover": { backgroundColor: "#00A398" },
    height: "2.2em",
    width: "2.2em",
    marginTop: "1px"
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

const CaseInteractionListing = ({
  documentType = "",
  handleShowInteractionListing,
  handleInteractionId,
  usedfor,
  caseId,
  projectId,
}) => {
  const {
    caseFilterState,
    interactionFilterData,
    detailedCase,
  } = useContext(CaseContext);
  const { projectInteractionData, projectFilterState } =
    useContext(ProjectContext);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [currentPageNumber, setCurrentPageNumber] = useState(0);
  const [interactionData, setInteractionData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [showSendInteractions, setShowSendInteractions] = useState(false);
  const [interactionIds, setInteractionIds] = useState([]);
  const [handleConfirmationModalOpen, setHandleConfirmationModalOpen] = useState(false);
  const [interactionPurpose, setInteractionPurpose] = useState(null);
  const [showUpdateSpocModal, setShowUpdateSpocModal] = useState(false);
  const [filterClicked, setFilterClicked] = useState(false);
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [page, setPage] = React.useState(0);
  const [interactionSortParams, setInteractionSortParams] = useState({
    sortField: null,
    sortOrder: null,
  });
  const [showUpdateDownloadModal, setShowUpdateDownloadModal] = useState(false);
  const [showUpdateSurveyModal, setShowUpdateSurveyModal] = useState(false);

  const isCase = usedfor === "case";
  const isProject = usedfor === "project";

  const UpdatePurposeRef = useRef();
  UpdatePurposeRef.current = "Interactions";

  useEffect(() => {
    setInteractionData(interactionFilterData);
  }, [interactionFilterData]);

  useEffect(() => {
    setInteractionData(projectInteractionData);
  }, [projectInteractionData]);

  useEffect(() => {
    document.body.style.overflow = filterPanelOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [filterPanelOpen]);

  function capitalizeFirstLetter(str) {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  const getInteractionSortParams = ({ sortField, sortOrder }) => {
    switch (sortField) {
      case "Interaction ID":
        sortField = "interactionsIdentifier";
        break;
      case "Interaction History":
        sortField = "projectId";
        break;
      case "Project ID":
        sortField = "projectId";
        break;
      case "Project Name":
        sortField = "projectName";
        break;
      case "Project Code":
        sortField = "projectCode";
        break;
      case "Status":
        sortField = "status";
        break;
      case "Sent Date":
        sortField = "sentDate";
        break;
      case "Response Date":
        sortField = "responseDate";
        break;
      case "Sent To":
        sortField = "sentTo";
        break;
      case "External link":
        sortField = "externalLink";
        break;
      default:
        sortField = null;
    }
    setInteractionSortParams({ sortField: sortField, sortOrder: sortOrder });
  };

  const handleSendMail = async ({ interactionIds, sendInteraction }) => {
    toast.loading(`${capitalizeFirstLetter(interactionPurpose)} sending...`);
    const querryData = { interactionIds: [...interactionIds] };
    if (interactionPurpose === "interactions") {
      querryData.sendInteraction = true;
    } else if (interactionPurpose === "reminder") {
      querryData.sendReminder = true;
    }
    try {
      const res = await axios.post(
        `${BaseURL}/api/v1/assessment/${localStorage.getItem(
          "userid"
        )}/send-interactions`,
        querryData,
        Authorization_header()
      );
      toast.dismiss();
      toast.success(
        `${capitalizeFirstLetter(interactionPurpose)} sent successfully...`
      );

      getAllInteractions();
    } catch (error) {
      toast.dismiss();
      toast.error(
        error?.response?.data?.message ||
        `Failed to send ${capitalizeFirstLetter(
          interactionPurpose
        )}. Server error`
      );
      console.error(error);
    }
  };

  const handleOpen = () => {
    setShowUpdateSpocModal(true);
  };

  const handleDownlaodOpen = () => {
    setShowUpdateDownloadModal(true);
  };

  const handleClose = () => {
    setShowUpdateSpocModal(false);
    setShowUpdateDownloadModal(false);
  };

  const handleSurveyUploadClick = () => {
    setShowUpdateSurveyModal(true);
  };

  const handleModalClose = () => {
    setShowUpdateSurveyModal(false);
    setShowUpdateDownloadModal(false);
  };

  const filteredColumns =
    usedfor === "project"
      ? columns.filter((column) => column != "Interaction History")
      : columns;
  const tableData = {
    columns: filteredColumns,
  };

  const handleSendInteractionsClick = (val) => {
    setInteractionIds([]);
    if (interactionPurpose == "interactions") {
      setShowSendInteractions(true);
    }
    setInteractionPurpose("interactions");
  };

  const handleSendReminderClick = () => {
    setInteractionIds([]);
    if (interactionPurpose == "reminder") {
      setShowSendInteractions(true);
    }
    setInteractionPurpose("reminder");
  };

  useEffect(() => {
    if (interactionPurpose) {
      setShowSendInteractions(true);
    }
  }, [interactionPurpose]);

  const handleShowSendInteractions = () => {
    setShowSendInteractions(!showSendInteractions);
  };
  const getAllInteractions = async (filters = {}) => {
    setLoader(true);
    let url_suffix = "";
    if (usedfor === "case") {
      url_suffix = `caseId=${caseId}`;
    } else if (usedfor === "project") {
      url_suffix = `projectIdentifier=${projectId}`;
    }
    const queryParams = new URLSearchParams();

    if (interactionSortParams?.sortField) {
      queryParams.append("sortField", interactionSortParams.sortField);
    }

    if (interactionSortParams?.sortOrder) {
      queryParams.append("sortOrder", interactionSortParams.sortOrder);
    }

    if (
      filters.interactionProjectNames &&
      filters.interactionProjectNames.length > 0
    )
      queryParams.append(
        "caseProjectNames",
        JSON.stringify(filters.interactionProjectNames)
      );
    if (filters.interactionStatus && filters.interactionStatus.length > 0)
      queryParams.append(
        "interactionStatus",
        JSON.stringify(filters.interactionStatus)
      );
    if (filters.sentTo && filters.sentTo.length > 0)
      queryParams.append("sentToEmails", JSON.stringify(filters.sentTo));
    if (filters.sentStartDate && filters.sentStartDate.length > 0)
      queryParams.append("sentStartDate", filters.sentStartDate);
    if (filters.sentEndDate && filters.sentEndDate.length > 0)
      queryParams.append("sentEndDate", filters.sentEndDate);
    if (
      filters.responseReceivedStartDate &&
      filters.responseReceivedStartDate.length > 0
    )
      queryParams.append(
        "responseReceivedStartDate",
        filters.responseReceivedStartDate
      );
    if (
      filters.responseReceivedEndDate &&
      filters.responseReceivedEndDate.length > 0
    )
      queryParams.append(
        "responseReceivedEndDate",
        filters.responseReceivedEndDate
      );

    const queryString = queryParams.toString();
    const url = `${BaseURL}/api/v1/projects/${localStorage?.getItem(
      "userid"
    )}/interaction-list?${url_suffix}${queryString ? `&${queryString}` : ""}`;

    const payload = { headers: Authorization_header().headers };
    setLoader(true);
    try {
      const response = await axios.get(url, payload);
      setInteractionData(response?.data?.data || []);
      setLoader(false);
    } catch (error) {
      setLoader(false);
      console.error("Error:", error);
    }
  };
  useEffect(() => {
    getAllInteractions();
  }, [caseId, projectId, interactionSortParams]);

  useEffect(() => {
    setRowsPerPage(5);
    setCurrentPageNumber(0);
  }, []);

  // for landing listing data
  useEffect(() => {
    if (usedfor === "case" || usedfor === "project") {
      const filtered = interactionData.filter(
        (data) =>
          data?.interactionsIdentifier
            ?.toLowerCase()
            .includes(search.toLowerCase()) ||
          data?.projectId?.toLowerCase().includes(search.toLowerCase()) ||
          data?.projectCode?.toLowerCase().includes(search.toLowerCase()) ||
          data?.projectName?.toLowerCase().includes(search.toLowerCase()) ||
          data?.status?.toLowerCase().includes(search.toLowerCase()) ||
          FormatDatetime(data?.sentDate)
            ?.toString()
            ?.toLowerCase()
            .includes(search.toLowerCase()) ||
          FormatDatetime(data?.responseDate)
            ?.toString()
            ?.toLowerCase()
            .includes(search.toLowerCase()) ||
          data?.spocEmail?.toLowerCase().includes(search.toLowerCase())
      );
      const newData = filtered?.slice(
        currentPageNumber * rowsPerPage,
        currentPageNumber * rowsPerPage + rowsPerPage
      );
      setFilteredData(newData);
    }
  }, [interactionData, search, rowsPerPage, currentPageNumber]);

  const handlePageChange = (event, value) => {
    setCurrentPageNumber(value);
  };
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPageNumber(0);
  };
  const handleSearch = (value) => {
    setSearch(value);
  };

  useEffect(() => {
    if (usedfor === "case") {
      const shouldFetchWithFiltersProjects =
        caseFilterState.projectId?.length > 0 ||
        caseFilterState.caseId?.length > 0 ||
        caseFilterState.interactionProjectNames?.length > 0 ||
        caseFilterState.interactionStatus?.length > 0 ||
        caseFilterState.sentTo?.length > 0 ||
        caseFilterState.caseProjectCodes?.length > 0;

      let options = {};

      if (shouldFetchWithFiltersProjects) {
        options = {
          ...(caseFilterState.caseId?.length > 0 && {
            caseId: caseFilterState.caseId,
          }),
          ...(caseFilterState.projectId?.length > 0 && {
            projectId: caseFilterState.projectId,
          }),
          ...(caseFilterState.interactionProjectNames?.length > 0 && {
            interactionProjectNames: caseFilterState.interactionProjectNames,
          }),
          ...(caseFilterState.caseProjectCodes?.length > 0 && {
            caseProjectCodes: caseFilterState.caseProjectCodes,
          }),
          ...(caseFilterState.interactionStatus?.length > 0 && {
            interactionStatus: caseFilterState.interactionStatus,
          }),
          ...(caseFilterState.sentTo?.length > 0 && {
            sentTo: caseFilterState.sentTo,
          }),
        };
      }
      // getAllInteractions(options);
    }
  }, [caseFilterState, interactionSortParams]);

  useEffect(() => {
    if (usedfor === "project") {
      const shouldFetchWithFiltersProjects =
        projectFilterState.interactionStatus?.length > 0 ||
        projectFilterState.sentTo?.length > 0 ||
        projectFilterState.sentDate?.length > 0;

      let options = {};

      if (shouldFetchWithFiltersProjects) {
        options = {
          ...(projectFilterState.interactionStatus?.length > 0 && {
            interactionStatus: projectFilterState.interactionStatus,
          }),
          ...(projectFilterState.sentTo?.length > 0 && {
            sentTo: projectFilterState.sentTo,
          }),
        };
      }
      getAllInteractions(options);
    }
  }, [projectFilterState, interactionSortParams]);

  const applyFiltersAndFetch = (filters) => {
    if (areFiltersApplied(appliedFilters)) {
      getAllInteractions(filters);
    } else {
      // toast.error("Please select at least one filter.");
      getAllInteractions(filters);
    }
  };

  const appliedFilters = {
    company: caseFilterState.company,
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
    if (Array.isArray(caseFilterState?.interactionProjectNames)) {
      if (
        caseFilterState.interactionProjectNames.some(
          (interactionProjectNames) => interactionProjectNames?.trim() !== ""
        )
      ) {
        count += 1;
      }
    }
    if (Array.isArray(caseFilterState?.interactionStatus)) {
      if (
        caseFilterState.interactionStatus.some(
          (interactionStatus) => interactionStatus?.trim() !== ""
        )
      ) {
        count += 1;
      }
    }
    if (Array.isArray(caseFilterState?.sentBy)) {
      if (caseFilterState.sentBy.some((sentBy) => sentBy?.trim() !== "")) {
        count += 1;
      }
    }
    if (Array.isArray(caseFilterState?.sentTo)) {
      if (caseFilterState.sentTo.some((sentTo) => sentTo?.trim() !== "")) {
        count += 1;
      }
    }
    if (Array.isArray(caseFilterState?.sentStartDate)) {
      if (
        caseFilterState.sentStartDate.some(
          (sentStartDate) => sentStartDate?.trim() !== ""
        )
      ) {
        count += 1;
      }
    }
    if (Array.isArray(caseFilterState?.responseReceivedStartDate)) {
      if (
        caseFilterState.responseReceivedStartDate.some(
          (responseReceivedStartDate) =>
            responseReceivedStartDate?.trim() !== ""
        )
      ) {
        count += 1;
      }
    }
    return count;
  };

  //interaction upload sheet
  const handleFormSubmit = async (formData) => {
    const data = new FormData();
    const apiUrl = `${BaseURL}/api/v1/assessment/${localStorage.getItem("userid")}/upload-interactions`;
    formData?.files?.forEach((file) => {
      data.append("files", file);
    });
    toast.loading("Uploading interaction...");
    try {
      const tokens = localStorage.getItem('tokens');
      const token_obj = JSON.parse(tokens);
      const response = await axios.post(apiUrl, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          'Authorization': `Bearer ${token_obj?.accessToken}`
        },
      });
      toast.dismiss();
      toast.success(response?.data?.message || "The files have been uploaded successfully and are currently in the processing queue.");
      handleModalClose();
    } catch (error) {
      console.error("er", error);
      toast.dismiss();
      toast.error(error?.response?.data?.message || "Failed to upload survey.");
    }
  };

  return (
    <>
      <Box
        sx={{
          borderTop: "1px solid #E4E4E4",
          p: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            px: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            margin: "0.5rem 0.3rem",
          }}
        >
          <Box
            sx={{
              marginLeft: "1px",
              marginTop: "-7px",
              display: "flex",
              alignItems: "center",
            }}
          >
            {!(page === "alerts") && (
              <Badge
                badgeContent={countActiveFilters()}
                color="error"
                overlap="circular"
                sx={{
                  zIndex: 2,
                  marginRight: "0px",
                  "& .MuiBadge-badge": {
                    minWidth: "10px",
                    height: "16px",
                    fontSize: "10px",
                    paddingLeft: "5",
                    transform: "translate(25%, -25%)",
                    backgroundColor: "#FD5707",
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
          <InputLabel sx={styles.label}>Project Interaction</InputLabel>
          <Drawer
            anchor="left"
            open={filterPanelOpen}
            onClose={handleFilterPanelClose}
            sx={{
              width: "300px",
              flexShrink: 0,
            }}
            variant="persistent"
          >
            {filterPanelOpen && (
              <>
                {usedfor === "case" ? (
                  <InteractionFilters
                    handleClose={handleFilterPanelClose}
                    open={filterPanelOpen}
                    page={page}
                    documentType={documentType}
                    onApplyFilters={applyFiltersAndFetch}
                    style={{ position: "absolute", left: 0 }}
                  />
                ) : (
                  <ProjectinteractionFilter
                    handleClose={handleFilterPanelClose}
                    projectId={projectId}
                    usedfor={usedfor}
                    open={filterPanelOpen}
                    page={page}
                    documentType={documentType}
                    onApplyFilters={applyFiltersAndFetch}
                    style={{ position: "absolute", left: 0 }}
                  />
                )}
              </>
            )}
          </Drawer>
          <InputBase
            type="text"
            placeholder="search..."
            onChange={(e) => {
              handleSearch(e.target.value);
            }}
            startAdornment={
              <InputAdornment position="start">
                <SearchIcon sx={styles.searchIconStyle} />
              </InputAdornment>
            }
            sx={{
              ...styles.inputBase,
              width: "20%",
              ml: "-500px",
              mr: -1,
              alignItems: "right",
            }}
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "1rem",
              width: "40%",
            }}
          >
            <Tooltip title="Download Intraction">
              <Button
                variant="contained"
                sx={{
                  borderRadius: "10px",
                  backgroundColor: "#00A398",
                  height: "2.2em",
                  minWidth: "5px",
                  padding: "0 0.5em",
                  "&:hover": {
                    backgroundColor: "#00A398",
                  },
                }}
                onClick={handleDownlaodOpen}
              >
                <Download sx={{ height: 20 }} />
              </Button>
            </Tooltip>
            {/* <NavigationWithId route={`/projects?tabName=Uploaded Sheets`}>
              <Tooltip title="Upload Survey List">
                <OpenInNewIcon sx={iconStyle} />
              </Tooltip>
            </NavigationWithId> */}
            <Tooltip title="Upload Survey">
              <Button
                variant="contained"
                sx={styles.uploadButtonStyle1}
                onClick={handleSurveyUploadClick}
              >
                <UploadFile />
              </Button>
            </Tooltip>
            <Tooltip title="Update SPOC">
              <Button
                variant="contained"
                sx={{ ...styles.uploadButtonStyle }}
                onClick={handleOpen}
              >
                <Edit sx={{ mr: 0.2, height: 16 }} />
                SPOC
              </Button>
            </Tooltip>
            <Tooltip title="Send Interaction">
              <Button
                variant="contained"
                sx={{ ...styles.uploadButtonStyle }}
                onClick={() => handleSendInteractionsClick("")}
              >
                <Send sx={{ mr: 0.2, height: 16 }} />
                Interactions
              </Button>
            </Tooltip>
            <Tooltip title="Send Reminder+">
              <Button
                variant="contained"
                sx={{ ...styles.uploadButtonStyle }}
                onClick={handleSendReminderClick}
              >
                <Send sx={{ mr: 0.2, height: 16 }} />
                Reminder
              </Button>
            </Tooltip>
          </Box>
        </Box>
        <Box
          sx={{
            flexGrow: 1,
            marginLeft: filterPanelOpen ? "300px" : "0",
            px: 2,
          }}
        >
          <TableContainer
            sx={{
              maxHeight: "82vh",
              overflowY: "auto",
              borderTopLeftRadius: "20px",
              height: 300,
              mt: 0.2,
              borderLeft: "1px solid #E4E4E4",
            }}
          >
            <Table stickyHeader aria-label="simple table">
              <MiniTableHeader
                tableData={tableData}
                usedfor={usedfor}
                fetchSortParams={getInteractionSortParams}
              />
              {!loader && (
                <CaseInteractionListingData
                  handleShowInteractionListing={handleShowInteractionListing}
                  handleInteractionId={handleInteractionId}
                  rowData={filteredData}
                  usedfor={usedfor}
                />
              )}
            </Table>
            {loader && (
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
            {filteredData.length === 0 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "50px",
                  minHeight: "380px",
                }}
              >
                No Interaction found.
              </div>
            )}
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={interactionData?.length}
            rowsPerPage={rowsPerPage}
            page={currentPageNumber}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        </Box>
      </Box>
      {isCase && (
        <CaseInteractionDownlaod
          open={showUpdateDownloadModal}
          handleClose={handleClose}
          updatePurpose={UpdatePurposeRef.current}
          projects={interactionData}
          postUpdate={getAllInteractions}
          usedfor="case"
        />
      )}
      {isProject && (
        <ProjectInteractionDownlaod
          open={showUpdateDownloadModal}
          handleClose={handleClose}
          updatePurpose={UpdatePurposeRef.current}
          projects={interactionData}
          postUpdate={getAllInteractions}
          usedfor="project"
        />
      )}
      <SpocIncludeProjectsModal
        open={showUpdateSpocModal}
        handleClose={handleClose}
        updatePurpose={UpdatePurposeRef.current}
        projects={interactionData}
        postUpdate={getAllInteractions}
      />
      <NewInteractionModal
        open={showSendInteractions}
        tableColumn={tableData}
        handleClose={handleShowSendInteractions}
        handleSendMail={handleSendMail}
        handleSurveysMailOpen={handleShowSendInteractions}
        handleConfirmationModalOpen={handleConfirmationModalOpen}
        interactionData={interactionData}
        interactionPurpose={interactionPurpose}
      />
      <UploadInteractionModalForm
        open={showUpdateSurveyModal}
        handleClose={handleModalClose}
        handleFormSubmit={handleFormSubmit}
        type={"upload"}
        caseId={detailedCase?.caseId}
      />
    </>
  );
};
export default CaseInteractionListing;
