import {
    Box,
    Accordion,
    AccordionDetails,
    Typography,
    Drawer,
    FormControlLabel,
    Checkbox,
    Collapse,
    TextField,
} from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { BaseURL } from "../../constants/Baseurl";
import ActionButton from "../FilterComponents/ActionButton";
import { Authorization_header } from "../../utils/helper/Constant";
import StatusFilter from "./StatusFilter";
import { useFormik } from "formik";
import { ProjectContext } from "../../context/ProjectContext";
import SentToFilters from "./SentToFilters";
import TeamMemberSelector from "./TeamMemberSelector";
import ProjectRolesSelector from "./ProjectRolesSelector";
import DocumentTypeSelector from "./DocumentTypeSelector";
import UploadedBy from "./UploadedBy";

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
            height: "37%",
            display: "flex",
            flexDirection: "column",
            marginTop: "21.5rem",
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
        width: "120px",
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

function ComDocFilters({ open, handleClose, projectId, page, onApplyFilters, fetchDocuments, companyId }) {
    const {
        projectFilterState,
        setProjectFilterState,
        clearProjectFilterTrigger,
        setIsProjectFilterApplied,
        triggerProjectClearFilters,
    } = useContext(ProjectContext);
    const [status, setStatus] = useState(projectFilterState.status || []);
    const [statusList, setStatusList] = useState([]);
    const [showStatus, setShowStatus] = useState(false);
    const [documentType, setDocumentType] = useState(projectFilterState.documentType || []);
    const [documentTypeList, setDocumentTypeList] = useState([]);
    const [showDocumentType, setShowDocumentType] = useState(false);
    const [uploadedBy, setUploadedBy] = useState(projectFilterState.uploadedBy || []);
    const [uploadedByList, setUploadedByList] = useState([]);
    const [showUploadedBy, setShowUploadedBy] = useState(false);
    const [currentPageProjects, setCurrentPageProjects] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [filteredRows, setFilteredRows] = useState([]);
    const [isAccordionOpen, setIsAccordionOpen] = useState(false);
    const [projectsCountError, setProjectsCountError] = useState('');
    const [positiveNumberError, setPositiveNumberError] = useState('');
    const [dateError, setDateError] = useState("");
    const [showdateError, setShowDateError] = useState(false);


    const [searchTerm, setSearchTerm] = useState('');
    const filterFields = [
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

    const currentData = filteredRows?.slice(
        (currentPageProjects - 1) * itemsPerPage,
        currentPageProjects * itemsPerPage
    );

    while (currentData?.length < itemsPerPage) {
        currentData?.push({});
    }

    useEffect(() => {
        const newDocumentTypeId = documentTypeList?.find((proj) => proj?.countryName === documentType)?.documetTypeId;
        const newStatusId = statusList?.find((proj) => proj?.countryName === status)?.statusId;
        const newUploadedById = uploadedByList?.find((proj) => proj?.countryName === uploadedBy)?.uploadedById;
        setProjectFilterState(prev => ({
            ...prev,
            documetTypeId: [newDocumentTypeId],
            documentType,
            statusId: [newStatusId],
            status,
            uploadedById: [newUploadedById],
            uploadedBy,
        }));
    }, [documentType, documentTypeList, status, statusList, uploadedBy, uploadedByList]);

    const fetchFilterTeamList = async () => {
        try {
            const url = `${BaseURL}/api/v1/documents/get-documents-filter-values?companyId=${companyId}`;
            const response = await axios.get(url, Authorization_header());
            const data = response?.data?.data || {};
            setDocumentTypeList(data?.documentType || []);
            setStatusList(data?.status || []);
            setUploadedByList(data?.uploadedBy || []);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchFilterTeamList();
    }, [projectFilterState.companyIds]);

    useEffect(() => {
        if (clearProjectFilterTrigger) {
            setDocumentType([]);
            setStatus([]);
            setUploadedBy([]);
            setDateError([]);
            setProjectFilterState({
                projectId: [],
                caseId: [],
                sentBy: [],
                documentType: [],
                status: [],
                uploadedBy: [],
            });
            setShowDateError(false);
            setShowDocumentType(false);
            setShowStatus(false);
            setShowUploadedBy(false);

        }
    }, [clearProjectFilterTrigger]);

    let projectsOptions;
    useEffect(() => {
        const shouldFetchWithFiltersProjects =
            projectFilterState.projectId?.length > 0 ||
            projectFilterState.caseId?.length > 0 ||
            projectFilterState.projectRoles?.length > 0 ||
            projectFilterState.names?.length > 0;
        if (shouldFetchWithFiltersProjects) {
            projectsOptions = {
                ...(projectFilterState.caseId?.length > 0 && {
                    caseId: projectFilterState.caseId,
                }),
                ...(projectFilterState.projectId?.length > 0 && {
                    projectId: projectFilterState.projectId,
                }),
                ...(projectFilterState.names?.length > 0 && {
                    names: projectFilterState.names,
                }),
                ...(projectFilterState.projectRoles?.length > 0 && {
                    projectRoles: projectFilterState.projectRoles,
                }),
            };
        }
    }, [projectFilterState]);

    const clearFilters = () => {
        setSearchTerm('');
        setStatus([]);
        setDateError([]);
        setDocumentType([]);
        setProjectFilterState({
            companyId: [],
            projectId: [],
            documentType: [],
            status: [],
            uploadedBy: [],
        });
        setPositiveNumberError('');
        setProjectsCountError('');
        fetchDocuments({ companyId: [companyId] });
        onApplyFilters({ companyId: [companyId] });
        triggerProjectClearFilters();
        setIsProjectFilterApplied(false);
        setShowDateError(false);
    };

    const applyFilters = () => {
        const filters = {
            ...(documentType?.length > 0 && { documentType }),
            ...(status?.length > 0 && { status }),
            ...(uploadedBy?.length > 0 && { uploadedBy }),
        };
        filters.companyId = [companyId];
        fetchDocuments(filters);
    };

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
                        Project Document Filter
                    </Typography>
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
                                                                field.label === "Category"
                                                                    ? showDocumentType
                                                                    : field.label === "Status"
                                                                        ? showStatus
                                                                        : field.label === "Uploaded By"
                                                                            ? showUploadedBy
                                                                            : false
                                                            }
                                                            onChange={(e) => {
                                                                if (field.label === "Category") {
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

export default ComDocFilters;

