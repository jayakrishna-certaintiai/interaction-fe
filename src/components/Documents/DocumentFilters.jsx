import {
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Drawer,
  IconButton,
  FormControlLabel,
  Checkbox,
  Collapse,
  TextField,
  InputBase,
  InputAdornment,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ActionButton from "../FilterComponents/ActionButton";
import SearchIcon from "@mui/icons-material/Search";
import React, { useContext, useEffect, useState } from "react";
import CompanySelector from "../FilterComponents/CompanySelector";
import ProjectSelector from "../FilterComponents/ProjectSelector";
import DocumentTypeSelector from "../FilterComponents/DocumentTypeSelector";
import axios from "axios";
import { BaseURL } from "../../constants/Baseurl";
import { DocumentContext } from "../../context/DocumentContext";
import { Authorization_header } from "../../utils/helper/Constant";
import CancelIcon from "@mui/icons-material/Cancel";
import { FilterListContext } from "../../context/FiltersListContext";
import StatusFilter from "../FilterComponents/StatusFilter";
import UploadedBy from "../FilterComponents/UploadedBy";
const triangleStyle = {
  display: 'inline-block',
  width: 0,
  height: 0,
  marginTop: "5px",
  marginRight: '10px',
  borderLeft: '8px solid transparent',
  borderRight: '8px solid transparent',
  borderBottom: '12px solid black',
  transition: 'transform 0.3s ease',
};
const styles = {
  drawerPaper: {
    "& .MuiDrawer-paper": {
      // borderRadius: "20px",
      height: "72.5%",
      display: "flex",
      flexDirection: "column",
      marginTop: "12.5rem",
      marginLeft: "20px",
      borderBottom: "1px solid #E4E4E4",
      borderTopLeftRadius: "20px",
      borderTopRightRadius: "20px",
      borderLeft: "1px solid #E4E4E4",
    },
  },
  drawerContainer: {
    display: "flex",
    flexDirection: "column",
    flex: 10,
    marginTop: "-0%",
    width: "17rem"
  },
  header: {
    display: "flex",
    alignItems: "center",
    borderBottom: "1px solid #E4E4E4",
    borderTop: "1px solid #E4E4E4",
    px: 2,
    height: "45px",
    justifyContent: "space-between",
    backgroundColor: "#ececec",
  },
  title: {
    fontWeight: "500",
    textTransform: "capitalize",
    marginRight: '-2px',
    color: 'black',
    fontSize: '16px',
    position: "sticky",
    backgroundColor: "#ececec",
  },
  closeButton: {
    color: "#9F9F9F",
    "&:hover": { color: "#FD5707" },
    marginRight: "-15px"
  },
  accordion: {
    flex: 1,
    overflow: 'auto',
    backgroundColor: 'transparent',
  },
  accordionSummary: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    '&:hover': { backgroundColor: '#03A69B1A' },
    padding: '10px',
    marginTop: "-20px"
  },
  accordionDetails: {
    overflowX: 'hidden',
  },
  footer: {
    display: "flex",
    justifyContent: "flex-end",
    padding: "16px",
    borderTop: "1px solid #E4E4E4",
    marginTop: "1px",
    gap: 1,
  },
  textField: {
    fontSize: '0.82rem',
    padding: '2px 0px',
    height: '32px',
    width: "100px",
    borderRadius: "20px",
  },
  applyButton: {
    color: "#00A398",
  },
  clearButton: {
    color: "#9F9F9F",
  },
  searchBox: {
    mt: 1,
    alignItems: "center",
    display: "flex",
    p: 1,
    pl: 2,
    width: "115%"
  },
  inputBase: {
    borderRadius: "20px",
    width: "80%",
    height: "35px",
    border: "1px solid #9F9F9F",
    mr: 2,
  },
  searchIcon: {
    color: "#9F9F9F",
    ml: "3px",
    mr: "-3px",
    width: "20px",
    height: "20px",
  },
  inputStyle: {
    borderRadius: "20px",
    width: "90%",
    height: "37px",
    border: "1px solid #9F9F9F",
    mt: 2,
    ml: 1.5,
  },
};
function DocumentFilters({ open, handleClose, clientData, documentClientData, onApplyFilters }) {
  const { docFilterState, setDocFilterState, isDocFilterApplied, clearFilterTrigger, triggerClearFilters,
    setIsDocFilterApplied, fetchDocuments } =
    useContext(DocumentContext);
  const { clientList } = useContext(FilterListContext);
  const [company, setCompany] = useState(docFilterState.company);
  const [showCompany, setShowCompany] = useState(false);
  const [project, setProject] = useState(docFilterState.project || []);
  // const [projectNameList, setProjectNameList] = useState([]);
  const [showProjectName, setShowProjectName] = useState(false);
  const [documentType, setDocumentType] = useState(docFilterState.documentType || []);
  const [documentTypeList, setDocumentTypeList] = useState([]);
  const [showDocumentType, setShowDocumentType] = useState(false);
  const [uploadedBy, setUploadedBy] = useState(docFilterState.uploadedBy || []);
  const [uploadedByList, setUploadedByList] = useState([]);
  const [showUploadedBy, setShowUploadedBy] = useState(false);
  const [status, setStatus] = useState(docFilterState.status || []);
  const [statusList, setStatusList] = useState([]);
  const [showStatus, setShowStatus] = useState(false);
  const [companyProjects, setCompanyProjects] = useState(null);
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasFetchedData, setHasFetchedData] = useState(false);
  const [projectsCountError, setProjectsCountError] = useState('');
  const [positiveNumberError, setPositiveNumberError] = useState('');
  const [showRnDPotential, setShowRnDPotential] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const filterFields = [
    { label: 'Account' },
    { label: 'Category' },
    { label: 'Status' },
    { label: 'Uploaded By' },
  ];

  const handleSearchInputChange = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
  };

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [open]);
  const handleFilterChange = ({ field, scale }) => (event, newValue) => {
    const value = newValue ?? event.target.value;

    if (value < 0) {
      setPositiveNumberError("Only positive num.");
    } else {
      setPositiveNumberError("");
    }
    setDocFilterState((prev) => {
      if (scale === "min" || scale === "max") {
        const updatedField = Array.isArray(prev[field]) ? [...prev[field]] : [];
        updatedField[scale === "min" ? 0 : 1] = value;

        // Validation for min and max
        const minValue = parseFloat(updatedField[0]);
        const maxValue = parseFloat(updatedField[1]);

        if (minValue && maxValue && minValue > maxValue) {
          setProjectsCountError("Max should be greater than Min");
        } else {
          setProjectsCountError('');
        }

        return {
          ...prev,
          [field]: updatedField
        };
      } else {
        return {
          ...prev,
          [field]: value
        };
      }
    });

  };

  const clearAllFilters = () => {
    setCompany("");
    setProject([]);
    setDocumentType("");
    setSortField("");
    setSortOrder("");
    setDocFilterState({
      companyId: [],
      projectId: "",
      documentType: [],
      company: "",
      project: "",
      status: [],
      uploadedBy: [],
    });
  };

  useEffect(() => {
    const newCompanyId = documentClientData?.find((client) => client?.companyName === company)?.companyId;
    const newProjectId = companyProjects?.find((proj) => proj?.project === project)?.projectId;
    const newDocumentTypeCountryId = documentTypeList?.find((proj) => proj?.countryName === documentType)?.countryId;
    const newStatusCountryId = statusList?.find((proj) => proj?.countryName === status)?.countryId;
    const newUploadedByCountryId = uploadedByList?.find((proj) => proj?.countryName === uploadedBy)?.countryId;

    setDocFilterState((prevState) => {
      const updatedState = {
        ...prevState,
        companyId: [newCompanyId], // Make sure this is an array
        projectId: newProjectId,
        company,
        project,
        documentType,
        // Default to an empty array if none of the country IDs are found
        countryId: [
          newDocumentTypeCountryId || newStatusCountryId || newUploadedByCountryId || null,
        ],
        status,
        uploadedBy,
      };

      // Check if the updated state is different from the previous state
      const isDifferent =
        (prevState.companyId[0] !== undefined && prevState.companyId[0] !== updatedState.companyId[0]) ||
        prevState.projectId !== updatedState.projectId ||
        prevState.company !== updatedState.company ||
        prevState.project !== updatedState.project ||
        prevState.documentType !== updatedState.documentType ||
        prevState.status !== updatedState.status ||
        prevState.uploadedBy !== updatedState.uploadedBy ||
        (prevState.countryId[0] !== undefined && prevState.countryId[0] !== updatedState.countryId[0]);

      return isDifferent ? updatedState : prevState; // Update only if there are changes
    });
  }, [company, project, documentType, status, uploadedBy, documentClientData, companyProjects, documentTypeList, statusList, uploadedByList]);





  useEffect(() => {
    setDocFilterState({
      ...docFilterState,
      sortField: sortField,
    })
  }, [sortField])

  useEffect(() => {
    setDocFilterState({
      ...docFilterState,
      sortOrder: sortOrder,
    });
  }, [sortOrder])

  const fetchData = async () => {
    // try {
    //   if (docFilterState?.companyId) {
    //     const response3 = await axios.get(
    //       `${BaseURL}/api/v1/get-documents-filter-values`, Authorization_header()
    //     );
    //     setCompanyProjects(response3.data.data);
    //     setHasFetchedData(true);
    //   } else {
    //     console.error("companyId not available in data object");
    //   }
    // } catch (error) {
    //   console.error(error);
    // }
    try {
      const url = `${BaseURL}/api/v1/documents/get-documents-filter-values`;
      const response = await axios.get(url, Authorization_header());
      const data = response?.data?.data || {};
      setCompanyProjects(data?.companyIds || []);
      setDocumentTypeList(data?.documentType || []);
      setStatusList(data?.status || []);
      setUploadedByList(data?.uploadedBy || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [docFilterState?.companyId]);

  useEffect(() => {
    if (clearFilterTrigger) {
      setCompany([]);
      setProject([]);
      setDocumentType([]);
      setStatus([]);
      setUploadedBy([]);
      setDocFilterState({
        ...docFilterState,
        companyId: [],
        company: [],
        documentType: [],
        rndPotential: [0, null],
        status: [],
        uploadedBy: [],
        projectId: [],
        project: [],
      })
      setShowCompany(false);
      setShowDocumentType(false);
      setShowStatus(false);
      setShowUploadedBy(false);
      setShowProjectName(false);
    }
  }, [clearFilterTrigger]);
  const handleAccordionChange = (event, isExpanded) => {
    setIsExpanded(isExpanded);
    if (isExpanded && !hasFetchedData) {
      fetchData();
    }
  };

  const clearFilters = () => {
    setCompany([]);
    setDocumentType([]);
    setProject([]);
    setSearchTerm('');
    setDocFilterState({
      companyId: [],
      documentType: [],
      rndPotential: [0, null],
      status: [],
      uploadedBy: [],
      projectId: [],
      project: [],
    });
    setPositiveNumberError('');
    setProjectsCountError('');
    onApplyFilters({});
    triggerClearFilters();
  };

  const applyFilters = () => {
    const filters = {
      ...(company.length > 0 && { companyId: company.map(c => c.companyId) }),
      ...(documentType?.length > 0 && { documentType }),
      ...(status?.length > 0 && { status }),
      ...(uploadedBy?.length > 0 && { uploadedBy }),
      ...(project.length > 0 && { projectId: project.map(c => c.projectId) }),
      // ...(docFilterState.rndPotential && {
      //   minRnDPotential: docFilterState.rndPotential[0],
      //   maxRnDPotential: docFilterState.rndPotential[1],
      // }),
    };

    fetchDocuments(filters);
  };
  //  <CompanySelector
  //         clients={documentClientData}
  //         company={company}
  //         setCompany={setCompany}
  //       />
  //       <ProjectSelector
  //         companyProjects={companyProjects}
  //         project={project}
  //         setProject={setProject}
  //       />
  //       <DocumentTypeSelector docType={documentType} doc={doc} setDoc={setDoc} />
  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={handleClose}
      variant="persistent"
      sx={styles.drawerPaper}
    >
      <Box sx={styles.drawerContainer}>
        <Box sx={styles.header}>
          <Typography sx={styles.title}>
            {/* {page === "company" ? "Account" : page} */}
            Document Filter
          </Typography>
          {/* <IconButton onClick={handleClose} sx={styles.closeButton}>
            <CancelIcon />
          </IconButton> */}
        </Box>
        <Box>
          <InputBase
            type="text"
            placeholder="Search Field Here..."
            startAdornment={
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            }
            value={searchTerm}
            onChange={handleSearchInputChange}
            sx={styles.inputStyle}
          />
        </Box>
        <Box sx={styles.accordion}>
          <Accordion
            sx={{
              height: "100%",
              overflow: 'auto',
              backgroundColor: isAccordionOpen ? '#FFFFFF' : 'transparent',
              '&:hover': { backgroundColor: '#FFFFFF' },
              boxShadow: 'none',
              borderRadius: "20px",
            }}
            expanded={isAccordionOpen}
          >
            <AccordionDetails sx={styles.accordionDetails}>
              <Box>
                {filterFields
                  .filter(field => field.label.toLowerCase().includes(searchTerm))
                  .map((field, index) => (
                    <Box key={index}>
                      <FormControlLabel
                        control={
                          <>
                            <Checkbox
                              checked={
                                field.label === "Account"
                                  ? showCompany
                                  : field.label === "Category"
                                    ? showDocumentType
                                    : field.label === "Status"
                                      ? showStatus
                                      : field.label === "Uploaded By"
                                        ? showUploadedBy
                                        : false
                              }
                              onChange={(e) => {
                                if (field.label === "Account") {
                                  if (e.target.checked) {
                                    setShowCompany(true);
                                  } else {
                                    setShowCompany(false);
                                    setCompany([]);
                                  }
                                } else if (field.label === "Category") {
                                  if (e.target.checked) {
                                    setShowDocumentType(true);
                                  } else {
                                    setShowDocumentType(false);
                                    setDocumentType([]);
                                  }
                                } else if (field.label === "Status") {
                                  if (e.target.checked) {
                                    setShowStatus(true);
                                  } else {
                                    setShowStatus(false);
                                    setStatus([]);
                                  }
                                } else if (field.label === "Uploaded By") {
                                  if (e.target.checked) {
                                    setShowUploadedBy(true);
                                  } else {
                                    setShowUploadedBy(false);
                                    setUploadedBy([]);
                                  }
                                }
                              }}
                              sx={{
                                "&.Mui-checked": {
                                  color: "#00A398",
                                },
                                "& .MuiSvgIcon-root": {
                                  fontSize: 20,
                                },
                              }}
                            />
                          </>
                        }
                        label={field.label}
                      />
                      {field.label === 'Account' && (
                        <Collapse in={showCompany}>
                          <CompanySelector
                            clientList={clientList}
                            company={company}
                            setCompany={setCompany}
                          />
                        </Collapse>
                      )}
                      {field.label === 'Category' && (
                        <Collapse in={showDocumentType}>
                          <DocumentTypeSelector documentType={documentType} documentTypeList={documentTypeList} setDocumentType={setDocumentType} />
                        </Collapse>
                      )}
                      {field.label === 'Status' && (
                        <Collapse in={showStatus}>
                          <StatusFilter
                            status={status}
                            statusList={statusList}
                            setStatus={setStatus}
                          />
                        </Collapse>
                      )}
                      {field.label === 'Uploaded By' && (
                        <Collapse in={showUploadedBy}>
                          <UploadedBy
                            uploadedBy={uploadedBy}
                            uploadedByList={uploadedByList}
                            setUploadedBy={setUploadedBy}
                          />
                        </Collapse>
                      )}
                    </Box>
                  ))}
              </Box>
            </AccordionDetails>
          </Accordion>
        </Box>
        <Box sx={styles.footer}>
          <ActionButton
            label="Clear"
            color={styles.clearButton.color}
            onClick={clearFilters}
          />
          {/* <ActionButton
              label="Cancel"
              color="#9F9F9F"
              onClick={handleClose}
            /> */}
          <ActionButton
            label="Apply"
            color={styles.applyButton.color}
            onClick={applyFilters}
          />
        </Box>
      </Box>
    </Drawer>
  );
}

export default DocumentFilters;
