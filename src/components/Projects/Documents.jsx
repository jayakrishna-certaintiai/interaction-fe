
import { Box, Button, InputAdornment, InputBase, Table, TableContainer, Drawer, Badge, Tooltip } from "@mui/material";
import axios from "axios";
import React, { useContext, useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { GoUpload } from "react-icons/go";

import { BaseURL } from "../../constants/Baseurl";
import { FilterListContext } from "../../context/FiltersListContext";
import { DocumentContext } from "../../context/DocumentContext";
import MiniTableHeader from "../Common/MiniTableHeader";
import UpdationDetails2 from "../Common/UpdationDetails2";
import DocumentsModal from "../Documents/DocumentsModal";
import DocumentTableBody from "./DocumentTableBody";
import { token_obj } from "../../utils/helper/Constant";
import { useHasAccessToFeature } from "../../utils/helper/HasAccessToFeature";
import SearchIcon from "@mui/icons-material/Search";
import { formatFyscalYear } from "../../utils/helper/FormatFiscalYear";
import { formattedDate } from "../../utils/helper/FormatDatetime";
import Teamfilters from "../FilterComponents/Teamfilters";
import { HiFilter } from "react-icons/hi";
import { areFiltersApplied } from "../../utils/helper/AreFiltersApplied";
import { ProjectContext } from "../../context/ProjectContext";
import ProjectDocFilter from "../FilterComponents/ProjectDocFilter";
import { FileUpload } from "@mui/icons-material";
import ComDocFilters from "../FilterComponents/ComDocFilters";

const tableData = {
  columns: [/*"Document Type",*/ "Document Name", "Category", "Status", "Uploaded On", "Uploaded By"],
  rows: [
    {
      name: "Attachment 01",
      category: "POC",
      uploadedOn: "18/11/2023",
      uploadedBy: "Prabhu Balakrishnan",
    },
  ],
};

const styleConstants = {
  inputStyle: {
    borderRadius: "20px",
    width: "30%",
    height: "33px",
    border: "1px solid #9F9F9F",
    mr: 5,
    ml: 10
  },
  searchIconStyle: {
    color: "#9F9F9F",
    ml: "3px",
    mr: "-3px",
    width: "20px",
    height: "20px",
  },
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
}

const documentType = ["SOW", "Technical Documents", "Project Status Reports", "JIRA Dumps", "Minutes of Meetings (MOMs)"];

function Documents({
  data,
  page,
  comId,
  comName,
  projId,
  projName,
  onClientDocumentUploadSuccess,
  onProjectDocumentUploadSuccess,
  fetchDocuments,
  modifiedBy,

}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [documentData, setDocumentData] = useState(null);
  const [search, setSearch] = useState("");
  const [filterRows, setFilterRows] = useState([]);
  const { clientList } = useContext(FilterListContext);
  const { documents, getDocumentsSortParams } = useContext(DocumentContext);
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [filterClicked, setFilterClicked] = useState(false);
  // const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const { projectFilterState } = useContext(ProjectContext);

  useEffect(() => {
    document.body.style.overflow = filterPanelOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [filterPanelOpen]);

  useEffect(() => {

    // Ensure comId and projId are not null or undefined
    if (comId || projId) {
      const companyIds = [comId.toString()];
      const relationId = projId ? projId.toString() : '';
      if (page === "clients") {
        fetchDocuments({ companyIds, relatedTo: 'clients', relationId });
      } else {
        fetchDocuments({ companyIds, relatedTo: "projects", relationId });
      }
    }
  }, [comId, projId]);



  useEffect(() => {
    const filteredData = data?.filter(task => (
      task?.documentName?.toString()?.toLowerCase()?.includes(search?.toString()?.toLowerCase()) ||
      task?.aistatus?.toString()?.toLowerCase()?.includes(search?.toString()?.toLowerCase()) ||
      formattedDate(task?.createdTime)?.toString()?.toLowerCase().includes(search?.toString()?.toLowerCase()) ||
      task?.createdBy?.toString().toLowerCase().includes(search?.toString()?.toLowerCase()) ||
      task?.documentType?.toString().toLowerCase().includes(search?.toString()?.toLowerCase())
      // task?.spocName?.toString().toLowerCase().includes(search?.toString()?.toLowerCase()) ||
      // task?.totalCosts?.toString().toLowerCase().includes(search?.toString()?.toLowerCase()) ||
      // task?.rndExpense?.toString().toLowerCase().includes(search?.toString()?.toLowerCase()) ||
      // task?.rndPotential?.toString().toLowerCase().includes(search?.toString()?.toLowerCase()) ||
      // formatFyscalYear(task?.accountingYear)?.toString().toLowerCase().includes(search?.toString()?.toLowerCase())
    ))
    setFilterRows(filteredData);
  }, [search, data])

  const handleSearchInputChange = (event) => {
    setSearch(event?.target?.value);
  }

  // useEffect(() => {
  //   fetchDocuments({
  //     companyIds: [companyId?.toString()],
  //     relatedTo: "projects",
  //     relationId: projectId?.toString(),
  //   });
  //   setShouldRefetch(false);
  // }, [projectId, shouldRefetch]);

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleUploadClick = () => {
    setModalOpen(true);
  };

  const handleDocumentUploadSuccess = () => {
    if (page === "account") {
      onClientDocumentUploadSuccess();
    } else {
      onProjectDocumentUploadSuccess();
    }
  };

  const handleFormSubmit = async (formData) => {

    const apiUrl = `${BaseURL}/api/v1/documents/${localStorage.getItem("userid")}/upload-doc`;

    const formDataToSubmit = new FormData();
    formData?.files?.forEach((file) => {
      formDataToSubmit.append("documents", file);
    });
    formDataToSubmit.append("companyId", formData.companyId);
    formDataToSubmit.append("relatedTo", formData.relatedTo);
    formDataToSubmit.append("relationId", formData.relationId);
    formDataToSubmit.append("docType", formData.doc);

    toast.loading("Uploading Documents...");
    try {
      const tokens = localStorage.getItem('tokens');
      const token_obj = JSON.parse(tokens);

      const response = await axios.post(apiUrl, formDataToSubmit, {
        headers: {
          "Content-Type": "multipart/form-data",
          'Authorization': `Bearer ${token_obj?.accessToken}`
        },
      });

      setDocumentData(response?.data?.data);
      fetchDocuments({ companyIds: [formData.companyId], relatedTo: "projects", relationId: formData.relationId });
      handleModalClose();
      toast.dismiss();
      toast.success(response?.data?.message || "The file has been uploaded successfully.");
    } catch (error) {
      toast.dismiss();
      toast.error(error?.response?.data?.message || "Failed to upload document.");
    }
  };

  const applyFiltersAndFetch = (filters) => {
    if (areFiltersApplied(appliedFilters)) {
    } else {
      // toast.error("Please select at least one filter.");
    }
  };

  const appliedFilters = {
    company: projectFilterState.company,
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

  const handleFilterClose = () => {
    setFilterPanelOpen(false);
  };

  const countActiveFilters = () => {
    let count = 0;
    if (Array.isArray(projectFilterState?.documentType)) {
      if (projectFilterState.documentType.some(documentType => documentType?.trim() !== "")) {
        count += 1;
      }
    }

    if (Array.isArray(projectFilterState?.status)) {
      if (projectFilterState.status.some(status => status?.trim() !== "")) {
        count += 1;
      }
    }

    if (Array.isArray(projectFilterState?.uploadedBy)) {
      if (projectFilterState.uploadedBy.some(uploadedBy => uploadedBy?.trim() !== "")) {
        count += 1;
      }
    }
    return count;
  };

  return (
    <>
      <Box sx={{ borderTop: "1px solid #E4E4E4", p: 1, display: "flex", flexDirection: "column" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", pt: 0, pb: page === "activity" ? -1 : 0 }}>
              <Box sx={{ marginLeft: "10px", marginTop: "-7px", display: "flex", alignItems: "center" }}>
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
                  <>
                    {page === 'project' ? (
                      <ProjectDocFilter
                        handleClose={handleFilterPanelClose}
                        open={filterPanelOpen}
                        page={page}
                        fetchDocuments={fetchDocuments}
                        onApplyFilters={applyFiltersAndFetch}
                        appliedFilters={appliedFilters}
                        style={{ position: 'absolute', left: 0 }}
                        projectId={projId}
                        companyId={comId}
                      />
                    ) : (
                      <ComDocFilters
                        handleClose={handleFilterPanelClose}
                        open={filterPanelOpen}
                        page={page}
                        fetchDocuments={fetchDocuments}
                        onApplyFilters={applyFiltersAndFetch}
                        appliedFilters={appliedFilters}
                        style={{ position: 'absolute', left: 0 }}
                        projectId={projId}
                        companyId={comId}
                      />
                    )}
                  </>
                )}
              </Drawer>
            </Box>
            {useHasAccessToFeature("F021", "P000000002") && (
              <Tooltip title="Upload File">
                <Button
                  sx={{
                    textTransform: "capitalize",
                    borderRadius: "10px",
                    backgroundColor: "#00A398",
                    color: "white",
                    mr: -7,
                    ml: 65,
                    width: "0.5em",
                    height: "2.5em",
                    fontSize: "12px",
                    minWidth: "unset",
                    padding: "10px 20px !important",
                    "&:hover": {
                      backgroundColor: "#00A398",
                    },
                  }}
                  onClick={handleUploadClick}
                >
                  <FileUpload style={{ fontSize: "20px", ml: 10 }} />
                </Button>
              </Tooltip>
            )}
            <InputBase
              type="text"
              placeholder="Search..."
              onChange={handleSearchInputChange}
              startAdornment={
                <InputAdornment position="start">
                  <SearchIcon sx={styleConstants.searchIconStyle} />
                </InputAdornment>
              }
              sx={styleConstants.inputStyle}
            />
          </Box>
          {/* {useHasAccessToFeature("F021", "P000000002") && (
            <Tooltip title="Upload File">
              <Button
                sx={{
                  textTransform: "capitalize",
                  borderRadius: "10px",
                  backgroundColor: "#00A398",
                  color: "white",
                  mr: 2,
                  width: "0.5em",
                  height: "2.5em",
                  fontSize: "12px",
                  minWidth: "unset",
                  padding: "10px 20px !important",
                  "&:hover": {
                    backgroundColor: "#00A398",
                  },
                }}
                onClick={handleUploadClick}
              >
                <FileUpload style={{ fontSize: "20px", mr: -20 }} />
              </Button>
            </Tooltip>
          )} */}

          <DocumentsModal
            open={modalOpen}
            handleClose={handleModalClose}
            type={"upload"}
            clients={clientList}
            docType={documentType}
            handleSubmit={handleFormSubmit}
            page={page}
            comId={comId}
            comName={comName}
            projId={projId}
            projName={projName}
          />
        </Box>
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          marginLeft: filterPanelOpen ? '300px' : '0',
          px: 2,
        }}
      >
        <TableContainer sx={{ width: "100%", overflowX: "auto", borderTopLeftRadius: "20px", maxHeight: "50vh" }}>
          <Table stickyHeader aria-label="simple table">
            <MiniTableHeader tableData={tableData} fetchSortParams={getDocumentsSortParams} />
            <DocumentTableBody filledRows={filterRows} />
          </Table>
        </TableContainer>
      </Box>
      <Toaster />
    </>
  );
}

export default Documents;