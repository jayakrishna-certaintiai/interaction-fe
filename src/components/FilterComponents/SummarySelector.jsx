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
import { FilterListContext } from "../../context/FiltersListContext";
import { Authorization_header } from "../../utils/helper/Constant";
import { CaseContext } from "../../context/CaseContext";
import StatusFilter from "./StatusFilter";
import { useFormik } from "formik";
import SentByFilters from "./SentByFilters";
import ProjectSelector from "./ProjectSelector";
import ProjectCodeSelect from "./ProjectCodeSelect";

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
            marginTop: "25rem",
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

function SummarySelector({ open, handleClose, onApplyFilters, getSummaryListing }) {
    const {
        caseFilterState,
        setCaseFilterState,
        clearCaseFilterTrigger,
        setIsCaseFilterApplied,
        triggerCaseClearFilters,
        detailedCase,
        // getSummaryListing,
    } = useContext(CaseContext);
    const [summaryProjectNames, setProjectNames] = useState(caseFilterState.summaryProjectNames);
    const [createdOn, setCreatedON] = useState(caseFilterState.createdOn);
    const [showCreatedOn, setShowCreatedON] = useState(false);
    const [caseId, setCaseId] = useState(caseFilterState.caseId);
    const [caseIdList, setCaseIdList] = useState([]);
    const [currentPageProjects, setCurrentPageProjects] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [filteredRows, setFilteredRows] = useState([]);
    const [projectNameList, setCaseProjectNameList] = useState([]);
    const [showCaseProjectName, setShowCaseProjectName] = useState(false);
    const [projectCodes, setProjectCodes] = useState(caseFilterState.projectCodes || []);
    const [projectCodesList, setCaseProjectCodesList] = useState([]);
    const [showCaseProjectCodes, setShowCaseProjectCodes] = useState(false);
    const [isAccordionOpen, setIsAccordionOpen] = useState(false);
    const [showSentDate, setShowSentDate] = useState(false);
    const [showResponseDate, setShowResponseDate] = useState(false);
    const [createdOnStartDate, setCreatedOnStartDate] = useState('');
    const [createdOnEndDate, setCreatedOnEndDate] = useState('');
    const [dateError, setDateError] = useState("");
    const [responseDateError, setResponseDateError] = useState("");
    const [showdateError, setShowDateError] = useState(false);


    const [searchTerm, setSearchTerm] = useState('');
    const filterFields = [
        { label: 'Project Name' },
        { label: 'Project Code' },
        { label: 'Created On' },
    ];
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
        const updateCaseId = caseIdList?.find((c) => c?.name === caseId)?.caseIds;
        const updatedCaseProjectNameId = projectNameList?.find((proj) => proj?.caseprojectName === summaryProjectNames)?.caseProjectNamesId;
        const updatedCaseProjectCodesId = projectCodesList?.find((proj) => proj?.name === projectCodes)?.caseProjectCodesId;
        setCaseFilterState(prev => ({
            ...prev,
            caseprojectNameId: [updatedCaseProjectNameId],
            summaryProjectNames,
            caseProjectCodesId: [updatedCaseProjectCodesId],
            projectCodes,
            createdOnStartDate,
            createdOnEndDate,
            caseIds: [updateCaseId],
            caseId,
        }));
    }, [caseId, summaryProjectNames, projectCodes, projectNameList, projectCodesList, createdOnStartDate, createdOnEndDate,]);

    const fetchFilterSurveyList = async () => {
        try {
            const queryParams = new URLSearchParams();
            if (detailedCase?.caseId) queryParams.append("caseId", detailedCase.caseId);
            const queryString = queryParams.toString();
            const url = `${BaseURL}/api/v1/projects/get-summary-filter-values${queryString ? `?${queryString}` : ""}`;
            const response = await axios.get(url, Authorization_header());
            const data = response?.data?.data || {};
            setCaseProjectNameList(data?.caseProjectNames || []);
            setCaseProjectCodesList(data?.caseProjectCodes || []);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchFilterSurveyList();
    }, [caseFilterState.companyIds]);

    useEffect(() => {
        if (clearCaseFilterTrigger) {
            setProjectNames([]);
            setCreatedOnStartDate([]);
            setCreatedOnEndDate([]);
            setProjectCodes([]);
            setDateError([]);
            setResponseDateError([]);
            setCaseFilterState({
                projectId: [],
                caseId: [],
                summaryProjectNames: [],
                projectCodes: [],
                sentBy: [],
                sentTo: [],
                createdOnStartDate: [],
                createdOnEndDate: [],
            });
            setShowCaseProjectName(false);
            setShowCaseProjectName(false);
            setShowCaseProjectCodes(false);
            setShowResponseDate(false);
            setShowSentDate(false);
            setShowDateError(false);
            setShowCreatedON(false);

        }
    }, [clearCaseFilterTrigger]);

    let projectsOptions;
    useEffect(() => {
        const shouldFetchWithFiltersProjects =
            caseFilterState.projectId?.length > 0 ||
            caseFilterState.caseId?.length > 0 ||
            caseFilterState.projectNames?.length > 0 ||
            caseFilterState.summaryStatus?.length > 0 ||
            caseFilterState.projectCodes?.length > 0;
        if (shouldFetchWithFiltersProjects) {
            projectsOptions = {
                ...(caseFilterState.caseId?.length > 0 && {
                    caseId: caseFilterState.caseId,
                }),
                ...(caseFilterState.projectId?.length > 0 && {
                    projectId: caseFilterState.projectId,
                }),
                ...(caseFilterState.summaryStatus?.length > 0 && {
                    summaryStatus: caseFilterState.summaryStatus,
                }),
                ...(caseFilterState.summaryProjectNames?.length > 0 && {
                    summaryProjectNames: caseFilterState.summaryProjectNames,
                }),
                ...(caseFilterState.projectCodes?.length > 0 && {
                    projectCodes: caseFilterState.projectCodes,
                }),
            };
        }
    }, [caseFilterState]);

    const clearFilters = () => {
        setProjectNames([]);
        setProjectCodes([]);
        setSearchTerm('');
        setDateError([]);
        setCaseFilterState({
            projectId: [],
            summaryProjectNames: [],
            caseProjectCodes: [],
            createdOnStartDate: '',
            createdOnEndDate: '',
        });
        onApplyFilters({});
        triggerCaseClearFilters();
        setIsCaseFilterApplied(false);
        setShowDateError(false);
        setShowCreatedON(false);
    };

    const applyFilters = () => {
        const filters = {
            ...(detailedCase?.caseId && { caseId: detailedCase?.caseId }),
            ...(summaryProjectNames?.length > 0 && { summaryProjectNames: summaryProjectNames }),
            ...(projectCodes?.length > 0 && { caseProjectCodes: projectCodes }),
            ...(createdOnStartDate && { createdOnStartDate }),
            ...(createdOnEndDate && { createdOnEndDate }),
        };
        getSummaryListing(filters);
    };
    const handleDateChange = (dateType) => (event) => {
        const value = event.target.value;

        if (dateType === 'createdOnStartDate') {
            setCreatedOnStartDate(value);
            if (createdOnEndDate && new Date(value) <= new Date(createdOnEndDate)) {
                setDateError("");
            }
        } else if (dateType === 'createdOnEndDate') {
            setCreatedOnEndDate(value);
            if (createdOnStartDate && new Date(value) < new Date(createdOnStartDate)) {
                setDateError("Lesser Start Date");
            } else {
                setDateError("");
            }
        }
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
                        Summary Filter
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
                                                                field.label === "Project Name"
                                                                    ? showCaseProjectName
                                                                    : field.label === "Project Code"
                                                                        ? showCaseProjectCodes
                                                                        : field.label === "Created On"
                                                                            ? showCreatedOn
                                                                            : false
                                                            }
                                                            onChange={(e) => {
                                                                if (field.label === "Project Name") {
                                                                    setProjectNames([]);
                                                                    if (e.target.checked) {
                                                                        setShowCaseProjectName(true);
                                                                    } else {
                                                                        setShowCaseProjectName(false);
                                                                    }
                                                                } else if (field.label === "Project Code") {
                                                                    setProjectCodes([]);
                                                                    if (e.target.checked) {
                                                                        setShowCaseProjectCodes(true);
                                                                    } else {
                                                                        setShowCaseProjectCodes(false);
                                                                    }
                                                                }
                                                                else if (field.label === "Created On") {
                                                                    setShowCreatedON(e.target.checked);
                                                                    setCreatedON([]);
                                                                    if (!e.target.checked) {
                                                                        setCreatedOnStartDate("");
                                                                        setCreatedOnEndDate("");
                                                                        setDateError("");
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
                                            {field.label === 'Project Name' && (
                                                <Collapse in={showCaseProjectName}>
                                                    <ProjectSelector
                                                        projectNames={summaryProjectNames}
                                                        projectNamesList={projectNameList}
                                                        setProjectNames={setProjectNames} />
                                                </Collapse>
                                            )}
                                            {field.label === 'Project Code' && (
                                                <Collapse in={showCaseProjectCodes}>
                                                    <ProjectCodeSelect
                                                        projectCodes={projectCodes}
                                                        projectCodesList={projectCodesList}
                                                        setProjectCodes={setProjectCodes}
                                                    />
                                                </Collapse>
                                            )}
                                            {field.label === 'Created On' && (
                                                <Collapse in={showCreatedOn}>
                                                    <Box display="flex" gap={3}>
                                                        <TextField
                                                            type="date"
                                                            label="Start Date"
                                                            value={createdOnStartDate || ""}
                                                            onChange={handleDateChange('createdOnStartDate')}
                                                            fullWidth
                                                            InputLabelProps={{ shrink: true }}
                                                            InputProps={{
                                                                sx: styles.textField,
                                                            }}
                                                            error={!!dateError}
                                                            helperText={dateError}
                                                        />
                                                        <TextField
                                                            type="date"
                                                            label="End Date"
                                                            value={createdOnEndDate || ""}
                                                            onChange={handleDateChange('createdOnEndDate')}
                                                            fullWidth
                                                            InputLabelProps={{ shrink: true }}
                                                            InputProps={{
                                                                sx: styles.textField,
                                                            }}
                                                        />
                                                    </Box>
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

export default SummarySelector;

