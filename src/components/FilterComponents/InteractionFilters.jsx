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
import SentToFilters from "./SentToFilters";

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

function InteractionFilters({ open, handleClose, onApplyFilters }) {
    const {
        caseFilterState,
        setCaseFilterState,
        clearCaseFilterTrigger,
        setIsCaseFilterApplied,
        triggerCaseClearFilters,
        detailedCase,
        getAllInteractions,
    } = useContext(CaseContext);
    const [interactionProjectNames, setProjectNames] = useState(caseFilterState.interactionProjectNames);
    const [caseId, setCaseId] = useState(caseFilterState.caseId);
    const [caseIdList, setCaseIdList] = useState([]);
    const [interactionStatus, setStatus] = useState(caseFilterState.interactionStatus || []);
    const [statusList, setStatusList] = useState([]);
    const [showStatus, setShowStatus] = useState(false);
    const [sentTo, setSentTo] = useState(caseFilterState.sentTo || []);
    const [sentToList, setSentToList] = useState([]);
    const [showSentTo, setShowSentTo] = useState(false);
    const [currentPageProjects, setCurrentPageProjects] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [filteredRows, setFilteredRows] = useState([]);
    const [projectNameList, setCaseProjectNameList] = useState([]);
    const [showCaseProjectName, setShowCaseProjectName] = useState(false);
    const [caseProjectCodes, setCaseProjectCodes] = useState(caseFilterState.caseProjectCodes || []);
    const [caseProjectCodesList, setCaseProjectCodesList] = useState([]);
    const [showCaseProjectCodes, setShowCaseProjectCodes] = useState(false);
    const [isAccordionOpen, setIsAccordionOpen] = useState(false);
    const [projectsCountError, setProjectsCountError] = useState('');
    const [positiveNumberError, setPositiveNumberError] = useState('');
    const [showSentDate, setShowSentDate] = useState(false);
    const [showResponseDate, setShowResponseDate] = useState(false);
    const [dateError, setDateError] = useState("");
    const [responseDateError, setResponseDateError] = useState("");
    const [showdateError, setShowDateError] = useState(false);
    const [sentStartDate, setSentStartDate] = useState('');
    const [sentEndDate, setSentEndDate] = useState('');
    const [responseReceivedStartDate, setResponseReceivedStartDate] = useState('');
    const [responseReceivedEndDate, setResponseReceivedEndDate] = useState('');
    const [showSentStartDate, setShowSentStartDate] = useState(false);
    const [showSentEndDate, setShowSentEndDate] = useState(false);
    const [showResponseReceivedEndDate, setShowResponseReceivedEndDate] = useState(false);
    const [showResponseReceivedStartDate, setShowResponseReceivedStartDate] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const filterFields = [
        { label: 'Project Name' },
        // { label: 'Project Code' },
        // { label: 'Status' },
        { label: 'Sent To' },
        { label: 'Sent Date' },
        { label: 'Response Date' },
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
        const updateCaseId = caseIdList?.find((c) => c?.name === caseId)?.caseIds;
        const updatedCaseProjectNameId = projectNameList?.find((proj) => proj?.caseprojectName === interactionProjectNames)?.caseProjectNamesId;
        const updatedCaseProjectCodesId = caseProjectCodesList?.find((proj) => proj?.name === caseProjectCodes)?.caseProjectCodesId;
        const updatedStatusId = statusList?.find((proj) => proj?.name === interactionStatus)?.statusId;
        const updatedSentToId = sentToList?.find((proj) => proj?.name === sentTo)?.sentToId;
        setCaseFilterState(prev => ({
            ...prev,
            caseprojectNameId: [updatedCaseProjectNameId],
            interactionProjectNames,
            caseProjectCodesId: [updatedCaseProjectCodesId],
            caseProjectCodes,
            statusId: [updatedStatusId],
            interactionStatus,
            sentToId: [updatedSentToId],
            sentTo,
            sentStartDate,
            sentEndDate,
            responseReceivedStartDate,
            responseReceivedEndDate,
            caseIds: [updateCaseId],
            caseId,
        }));
    }, [caseId, interactionProjectNames, interactionStatus, statusList, sentTo, sentToList, caseProjectCodes, projectNameList, caseProjectCodesList, sentStartDate,
        sentEndDate,
        responseReceivedStartDate,
        responseReceivedEndDate]);

    const fetchFilterInteractionList = async () => {
        try {
            const queryParams = new URLSearchParams();
            if (detailedCase?.caseId) queryParams.append("caseId", detailedCase.caseId);
            const queryString = queryParams.toString();
            const url = `${BaseURL}/api/v1/projects/get-interaction-filter-values${queryString ? `?${queryString}` : ""}`;
            const response = await axios.get(url, Authorization_header());
            const data = response?.data?.data || {};
            setCaseProjectNameList(data?.caseProjectNames || []);
            setCaseProjectCodesList(data?.caseProjectCodes || []);
            setStatusList(data?.interactionStatus || []);
            setSentToList(data?.sentToEmails || []);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchFilterInteractionList();
    }, [caseFilterState.companyIds]);

    useEffect(() => {
        if (clearCaseFilterTrigger) {
            setProjectNames([]);
            setSentStartDate([]);
            setSentEndDate([]);
            setResponseReceivedStartDate([]);
            setResponseReceivedEndDate([]);
            setCaseProjectCodes([]);
            setDateError([]);
            setSentTo([]);
            setResponseDateError([]);
            setStatus([]);
            setCaseFilterState({
                projectId: [],
                caseId: [],
                interactionProjectNames: [],
                caseProjectCodes: [],
                sentTo: [],
                interactionStatus: [],
                sentStartDate: [],
                sentEndDate: [],
                responseReceivedStartDate: [],
                responseReceivedEndDate: [],
            });
            setShowCaseProjectName(false);
            setShowCaseProjectName(false);
            setShowCaseProjectCodes(false);
            setShowResponseDate(false);
            setShowDateError(false);
            setShowSentStartDate(false);
            setShowResponseReceivedEndDate(false);
            setShowSentEndDate(false);
            setShowResponseReceivedStartDate(false);
            setShowStatus(false);
            setShowSentTo(false);

        }
    }, [clearCaseFilterTrigger]);

    let projectsOptions;
    useEffect(() => {
        const shouldFetchWithFiltersProjects =
            caseFilterState.projectId?.length > 0 ||
            caseFilterState.caseId?.length > 0 ||
            caseFilterState.interactionProjectNames?.length > 0 ||
            caseFilterState.interactionStatus?.length > 0 ||
            caseFilterState.sentTo?.length > 0 ||
            caseFilterState.caseProjectCodes?.length > 0;
        if (shouldFetchWithFiltersProjects) {
            projectsOptions = {
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
    }, [caseFilterState]);

    const clearFilters = () => {
        setProjectNames([]);
        setCaseProjectCodes([]);
        setSearchTerm('');
        setDateError([]);
        setStatus([]);
        setSentTo([]);
        setDateError([]);
        setResponseDateError([]);
        setCaseFilterState({
            projectId: [],
            interactionProjectNames: [],
            caseProjectCodes: [],
            interactionStatus: [],
            sentTo: [],
            sentStartDate: '',
            sentEndDate: '',
            responseReceivedStartDate: '',
            responseReceivedEndDate: '',
        });
        setPositiveNumberError('');
        setProjectsCountError('');
        onApplyFilters({});
        triggerCaseClearFilters();
        setIsCaseFilterApplied(false);
        setShowDateError(false);
        setShowStatus(false);
    };

    const applyFilters = () => {
        const filters = {
            ...(detailedCase?.caseId && { caseId: detailedCase?.caseId }),
            ...(interactionProjectNames?.length > 0 && { interactionProjectNames }),
            ...(caseProjectCodes?.length > 0 && { caseProjectCodes }),
            ...(interactionStatus?.length > 0 && { interactionStatus }),
            ...(sentTo?.length > 0 && { sentTo }),
            ...(sentStartDate && { sentStartDate }),
            ...(sentEndDate && { sentEndDate }),
            ...(responseReceivedStartDate && { responseReceivedStartDate }),
            ...(responseReceivedEndDate && { responseReceivedEndDate }),
        };
        getAllInteractions(filters);
    };

    const handleDateChange = (dateType) => (event) => {
        const value = event.target.value;

        if (dateType === 'sentStartDate') {
            setSentStartDate(value);
            if (sentEndDate && new Date(value) <= new Date(sentEndDate)) {
                setDateError("");
            }
        } else if (dateType === 'sentEndDate') {
            setSentEndDate(value);
            if (sentStartDate && new Date(value) < new Date(sentStartDate)) {
                setDateError("Lesser Start Date");
            } else {
                setDateError("");
            }
        } else if (dateType === 'responseReceivedStartDate') {
            setResponseReceivedStartDate(value);
            if (responseReceivedEndDate && new Date(value) <= new Date(responseReceivedEndDate)) {
                setResponseDateError("");
            }
        } else if (dateType === 'responseReceivedEndDate') {
            setResponseReceivedEndDate(value);
            if (responseReceivedStartDate && new Date(value) < new Date(responseReceivedStartDate)) {
                setResponseDateError("Lesser Start Date");
            } else {
                setResponseDateError("");
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
                        Interaction Filter
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
                                                                        : field.label === "Sent Date"
                                                                            ? showSentDate
                                                                            : field.label === "Response Date"
                                                                                ? showResponseDate
                                                                                : field.label === "Status"
                                                                                    ? showStatus
                                                                                    : field.label === "Sent To"
                                                                                        ? showSentTo
                                                                                        : false
                                                            }
                                                            onChange={(e) => {
                                                                if (field.label === "Project Name") {
                                                                    if (e.target.checked) {
                                                                        setShowCaseProjectName(true);
                                                                    } else {
                                                                        setShowCaseProjectName(false);
                                                                        setProjectNames([]);
                                                                    }
                                                                } else if (field.label === "Project Code") {
                                                                    if (e.target.checked) {
                                                                        setShowCaseProjectCodes(true);
                                                                    } else {
                                                                        setShowCaseProjectCodes(false);
                                                                        setCaseProjectCodes([]);
                                                                    }
                                                                }
                                                                else if (field.label === "Sent Date") {
                                                                    setShowSentDate(e.target.checked);
                                                                    if (!e.target.checked) {
                                                                        setSentStartDate("");
                                                                        setSentEndDate("");
                                                                        setDateError("");

                                                                    }
                                                                } else if (field.label === "Response Date") {
                                                                    setShowResponseDate(e.target.checked);
                                                                    if (!e.target.checked) {
                                                                        setResponseReceivedStartDate("");
                                                                        setResponseReceivedEndDate("");
                                                                        setResponseDateError("");
                                                                    }

                                                                }
                                                                else if (field.label === "Status") {
                                                                    if (e.target.checked) {
                                                                        setShowStatus(true);
                                                                    } else {
                                                                        setShowStatus(false);
                                                                        setStatus([]);
                                                                    }
                                                                }
                                                                else if (field.label === "Sent To") {
                                                                    if (e.target.checked) {
                                                                        setShowSentTo(true);
                                                                    } else {
                                                                        setShowSentTo(false);
                                                                        setSentTo([]);
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
                                                        projectNames={interactionProjectNames}
                                                        projectNamesList={projectNameList}
                                                        setProjectNames={setProjectNames} />
                                                </Collapse>
                                            )}
                                            {field.label === 'Project Code' && (
                                                <Collapse in={showCaseProjectCodes}>
                                                    <ProjectCodeSelect
                                                        caseProjectCodes={caseProjectCodes}
                                                        caseProjectCodesList={caseProjectCodesList}
                                                        setCaseProjectCodes={setCaseProjectCodes}
                                                    />
                                                </Collapse>
                                            )}
                                            {field.label === 'Status' && (
                                                <Collapse in={showStatus}>
                                                    <StatusFilter
                                                        status={interactionStatus}
                                                        statusList={statusList}
                                                        setStatus={setStatus}
                                                    />
                                                </Collapse>
                                            )}
                                            {field.label === 'Sent To' && (
                                                <Collapse in={showSentTo}>
                                                    <SentToFilters
                                                        sentTo={sentTo}
                                                        sentToList={sentToList}
                                                        setSentTo={setSentTo}
                                                    />
                                                </Collapse>
                                            )}
                                            {field.label === 'Sent Date' && (
                                                <Collapse in={showSentDate}>
                                                    <Box display="flex" gap={3}>
                                                        <TextField
                                                            type="date"
                                                            label="Start Date"
                                                            value={sentStartDate || ""}
                                                            onChange={handleDateChange('sentStartDate')}
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
                                                            value={sentEndDate || ""}
                                                            onChange={handleDateChange('sentEndDate')}
                                                            fullWidth
                                                            InputLabelProps={{ shrink: true }}
                                                            InputProps={{
                                                                sx: styles.textField,
                                                            }}
                                                        />
                                                    </Box>
                                                </Collapse>
                                            )}
                                            {field.label === 'Response Date' && (
                                                <Collapse in={showResponseDate}>
                                                    <Box display="flex" gap={3}>
                                                        <TextField
                                                            type="date"
                                                            label="Start Date"
                                                            value={responseReceivedStartDate || ""}
                                                            onChange={handleDateChange('responseReceivedStartDate')}
                                                            fullWidth
                                                            InputLabelProps={{ shrink: true }}
                                                            InputProps={{
                                                                sx: styles.textField,
                                                            }}
                                                            error={!!responseDateError}
                                                            helperText={responseDateError}
                                                        />
                                                        <TextField
                                                            type="date"
                                                            label="End Date"
                                                            value={responseReceivedEndDate || ""}
                                                            onChange={handleDateChange('responseReceivedEndDate')}
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

export default InteractionFilters;

