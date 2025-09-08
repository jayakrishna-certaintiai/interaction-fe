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
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { BaseURL } from "../../constants/Baseurl";
import { ProjectContext } from "../../context/ProjectContext";
import AccYearSelector from "../FilterComponents/AccYearSelector";
import CompanySelector from "../FilterComponents/CompanySelector";
import ActionButton from "../FilterComponents/ActionButton";
import { ClientContext } from "../../context/ClientContext";
import SliderInput from "../FilterComponents/SliderInput";
import CancelIcon from "@mui/icons-material/Cancel";
import { FilterListContext } from "../../context/FiltersListContext";
import { Authorization_header } from "../../utils/helper/Constant";
import SpocNameFilters from "../FilterComponents/SpocNameFilters";
import SpocEmailFilters from "../FilterComponents/SpocEmailFilters";
import { CaseContext } from "../../context/CaseContext";
import ProjectNameFilters from "./ProjectNameFilters";
import StatusFilter from "./StatusFilter";
import { useFormik } from "formik";
import SentByFilter from "./SentByFilters";
import SentToFilter from "./SentToFilters";
import SentByFilters from "./SentByFilters";
import SentToFilters from "./SentToFilters";
import ProjectSelector from "./ProjectSelector";
// import PortfolioSelector from "../FilterComponents/PortfolioSelector";

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
            height: "37%",
            display: "flex",
            flexDirection: "column",
            marginTop: "25.5rem",
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

function CaseSurveyFilters({ open, handleClose, onApplyFilters }) {
    const {
        caseFilterState,
        setCaseFilterState,
        clearCaseFilterTrigger,
        setIsCaseFilterApplied,
        triggerCaseClearFilters,
        detailedCase,
        fetchSurveyList,
    } = useContext(CaseContext);
    const [surveyProjectNames, setProjectNames] = useState(caseFilterState.surveyProjectNames);
    const [caseId, setCaseId] = useState(caseFilterState.caseId);
    const [caseIdList, setCaseIdList] = useState([]);
    const [currentPageProjects, setCurrentPageProjects] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [filteredRows, setFilteredRows] = useState([]);
    const [projectNameList, setCaseProjectNameList] = useState([]);
    const [showCaseProjectName, setShowCaseProjectName] = useState(false);
    const [status, setStatus] = useState(caseFilterState.status || []);
    const [statusList, setStatusList] = useState([]);
    const [showStatus, setShowStatus] = useState(false);
    const [sentBy, setSentBy] = useState(caseFilterState.sentBy || []);
    const [sentByList, setSentByList] = useState([]);
    const [showSentStartDate, setShowSentStartDate] = useState(false);
    const [showSentEndDate, setShowSentEndDate] = useState(false);
    const [showResponseReceivedEndDate, setShowResponseReceivedEndDate] = useState(false);
    const [showResponseReceivedStartDate, setShowResponseReceivedStartDate] = useState(false);
    const [showSentBy, setShowSentBy] = useState(false);
    const [sentTo, setSentTo] = useState(caseFilterState.sentTo || []);
    const [sentToList, setSentToList] = useState([]);
    const [showSentTo, setShowSentTo] = useState(false);
    const [isAccordionOpen, setIsAccordionOpen] = useState(false);
    const { clientList } = useContext(FilterListContext);
    const [showSentDate, setShowSentDate] = useState(false);
    const [showResponseDate, setShowResponseDate] = useState(false);
    const [sentStartDate, setSentStartDate] = useState('');
    const [sentEndDate, setSentEndDate] = useState('');
    const [responseReceivedStartDate, setResponseReceivedStartDate] = useState('');
    const [responseReceivedEndDate, setResponseReceivedEndDate] = useState('');
    const [dateError, setDateError] = useState("");
    const [responseDateError, setResponseDateError] = useState("");
    const [showdateError, setShowDateError] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const filterFields = [
        { label: 'Project Name' },
        { label: 'Status' },
        { label: 'Sent By' },
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
        const updatedCaseProjectNameId = projectNameList?.find((proj) => proj?.caseprojectName === surveyProjectNames)?.caseProjectNamesId;
        const updatedStatusId = statusList?.find((proj) => proj?.name === status)?.statusId;
        const updatedSentById = sentByList?.find((proj) => proj?.name === sentBy)?.sentById;
        const updatedSentToId = sentToList?.find((proj) => proj?.name === sentTo)?.sentToId;
        setCaseFilterState(prev => ({
            ...prev,
            caseprojectNameId: [updatedCaseProjectNameId],
            surveyProjectNames,
            statusId: [updatedStatusId],
            status,
            sentById: [updatedSentById],
            sentBy,
            sentToId: [updatedSentToId],
            sentTo,
            sentStartDate,
            sentEndDate,
            responseReceivedStartDate,
            responseReceivedEndDate,
            caseIds: [updateCaseId],
            caseId,
        }));
    }, [caseId, clientList, surveyProjectNames, status, sentBy, sentByList, sentTo, sentToList, projectNameList, statusList, sentStartDate,
        sentEndDate,
        responseReceivedStartDate,
        responseReceivedEndDate,]);

    const fetchFilterSurveyList = async () => {
        try {
            const queryParams = new URLSearchParams();
            if (detailedCase?.caseId) queryParams.append("caseId", detailedCase.caseId);
            const queryString = queryParams.toString();
            const url = `${BaseURL}/api/v1/case/get-surveys-filter-values${queryString ? `?${queryString}` : ""}`;
            const response = await axios.get(url, Authorization_header());
            const data = response?.data?.data || {};
            setCaseProjectNameList(data?.caseProjectNames || []);
            setStatusList(data?.status || []);
            setSentByList(data?.sentByEmails || []);
            setSentToList(data?.sentToEmails || []);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchFilterSurveyList();
        // fetchFilterProjectsList();
    }, [caseFilterState.companyIds]);

    useEffect(() => {
        if (clearCaseFilterTrigger) {
            setProjectNames([]);
            setSentStartDate([]);
            setSentEndDate([]);
            setResponseReceivedStartDate([]);
            setResponseReceivedEndDate([]);
            setStatus([]);
            setSentBy([]);
            setSentTo([]);
            setDateError([]);
            setResponseDateError([]);
            setCaseFilterState({
                projectId: [],
                caseId: [],
                surveyProjectNames: [],
                status: [],
                sentBy: [],
                sentTo: [],
                sentStartDate: [],
                sentEndDate: [],
                responseReceivedStartDate: [],
                responseReceivedEndDate: [],
                totalefforts: [0, null],
                rndExpense: [0, null],
                rndPotential: [0, null],
            });
            setShowCaseProjectName(false);
            setShowCaseProjectName(false);
            setShowStatus(false);
            setShowSentBy(false);
            setShowSentTo(false);
            setShowSentDate(false);
            setShowResponseDate(false);
            setShowSentStartDate(false);
            setShowResponseReceivedStartDate(false);
            setShowSentEndDate(false);
            setShowResponseReceivedEndDate(false);
            setShowDateError(false);
        }
    }, [clearCaseFilterTrigger]);

    let projectsOptions;
    useEffect(() => {
        const shouldFetchWithFiltersProjects =
            caseFilterState.projectId?.length > 0 ||
            caseFilterState.caseId?.length > 0 ||
            caseFilterState.surveyProjectNames?.length > 0 ||
            caseFilterState.status?.length > 0 ||
            caseFilterState.sentBy?.length > 0 ||
            caseFilterState.sentTo?.length > 0 ||
            caseFilterState.sentStartDate?.length > 0 ||
            caseFilterState.sentEndDate?.length > 0 ||
            caseFilterState.responseReceivedStartDate?.length > 0 ||
            caseFilterState.responseReceivedEndDate?.length > 0;
        if (shouldFetchWithFiltersProjects) {
            projectsOptions = {
                ...(caseFilterState.caseId?.length > 0 && {
                    caseId: caseFilterState.caseId,
                }),
                ...(caseFilterState.projectId?.length > 0 && {
                    projectId: caseFilterState.projectId,
                }),
                ...(caseFilterState.surveyProjectNames?.length > 0 && {
                    surveyProjectNames: caseFilterState.surveyProjectNames,
                }),
                ...(caseFilterState.status?.length > 0 && {
                    status: caseFilterState.status,
                }),
                ...(caseFilterState.sentBy?.length > 0 && {
                    sentBy: caseFilterState.sentBy,
                }),
                ...(caseFilterState.sentTo?.length > 0 && {
                    sentTo: caseFilterState.sentTo,
                }),
                ...(caseFilterState.sentStartDate?.length > 0 && {
                    sentStartDate: caseFilterState.sentStartDate,
                }),
                ...(caseFilterState.sentEndDate?.length > 0 && {
                    sentEndDate: caseFilterState.sentEndDate,
                }),
                ...(caseFilterState.responseReceivedStartDate?.length > 0 && {
                    responseReceivedStartDate: caseFilterState.responseReceivedStartDate,
                }),
                ...(caseFilterState.responseReceivedEndDate?.length > 0 && {
                    responseReceivedEndDate: caseFilterState.responseReceivedEndDate,
                }),
            };
        }
    }, [caseFilterState]);

    const clearFilters = () => {
        setProjectNames([]);
        setStatus([]);
        setSentBy([]);
        setSentTo([]);
        setSearchTerm('');
        setDateError([]);
        setResponseDateError([]);
        setCaseFilterState({
            projectId: [],
            surveyProjectNames: [],
            status: [],
            sentBy: [],
            sentTo: [],
            sentStartDate: '',
            sentEndDate: '',
            responseReceivedStartDate: '',
            responseReceivedEndDate: '',
        });
        onApplyFilters({});
        triggerCaseClearFilters();
        setIsCaseFilterApplied(false);
        setShowSentBy(false);
        setShowDateError(false);
    };

    const applyFilters = () => {
        const filters = {
            ...(detailedCase?.caseId && { caseId: detailedCase?.caseId }),
            ...(surveyProjectNames?.length > 0 && { surveyProjectNames }),
            ...(status?.length > 0 && { status }),
            ...(sentBy?.length > 0 && { sentBy }),
            ...(sentTo?.length > 0 && { sentTo }),
            ...(sentStartDate && { sentStartDate }),
            ...(sentEndDate && { sentEndDate }),
            ...(responseReceivedStartDate && { responseReceivedStartDate }),
            ...(responseReceivedEndDate && { responseReceivedEndDate }),
        };
        fetchSurveyList(filters);
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
                        Survey Filter
                    </Typography>
                </Box>
                {/* <Box>
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
                </Box> */}
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
                                                                    : field.label === "Status"
                                                                        ? showStatus
                                                                        : field.label === "Sent Date"
                                                                            ? showSentDate
                                                                            : field.label === "Response Date"
                                                                                ? showResponseDate
                                                                                : field.label === "Sent By"
                                                                                    ? showSentBy
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
                                                                } else if (field.label === "Status") {
                                                                    if (e.target.checked) {
                                                                        setShowStatus(true);
                                                                    } else {
                                                                        setShowStatus(false);
                                                                        setStatus([]);
                                                                    }
                                                                } else if (field.label === "Sent Date") {
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
                                                                else if (field.label === "Sent By") {
                                                                    if (e.target.checked) {
                                                                        setShowSentBy(true);
                                                                    } else {
                                                                        setShowSentBy(false);
                                                                        setSentBy([]);
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
                                                        projectNames={surveyProjectNames}
                                                        projectNamesList={projectNameList}
                                                        setProjectNames={setProjectNames} />
                                                </Collapse>
                                            )}
                                            {/* {field.label === 'Project Name' && (
                                                <Collapse in={showProjectName}>
                                                    <ProjectNameFilters
                                                        projectName={projectName}
                                                        projectNameList={projectNameList}
                                                        setProjectName={setProjectName}
                                                    />
                                                </Collapse>
                                            )} */}
                                            {field.label === 'Status' && (
                                                <Collapse in={showStatus}>
                                                    <StatusFilter
                                                        status={status}
                                                        statusList={statusList}
                                                        setStatus={setStatus}
                                                    />
                                                </Collapse>
                                            )}
                                            {field.label === 'Sent By' && (
                                                <Collapse in={showSentBy}>
                                                    <SentByFilters
                                                        sentBy={sentBy}
                                                        sentByList={sentByList}
                                                        setSentBy={setSentBy}
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

export default CaseSurveyFilters;

