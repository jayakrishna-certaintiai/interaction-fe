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
            marginTop: "22rem",
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

function ProjectinteractionFilter({ open, handleClose, projectId, page, onApplyFilters }) {
    const {
        projectFilterState,
        setProjectFilterState,
        clearProjectFilterTrigger,
        setIsProjectFilterApplied,
        triggerProjectClearFilters,
        getInteractionListing,
    } = useContext(ProjectContext);
    const [sentTo, setSentTo] = useState(projectFilterState.sentTo || []);
    const [sentToList, setSentToList] = useState([]);
    const [showSentTo, setShowSentTo] = useState(false);
    const [caseId, setCaseId] = useState(projectFilterState.caseId);
    const [caseIdList, setCaseIdList] = useState([]);
    const [currentPageProjects, setCurrentPageProjects] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [filteredRows, setFilteredRows] = useState([]);
    const [isAccordionOpen, setIsAccordionOpen] = useState(false);
    const [projectsCountError, setProjectsCountError] = useState('');
    const [positiveNumberError, setPositiveNumberError] = useState('');
    const [dateError, setDateError] = useState("");
    const [responseDateError, setResponseDateError] = useState("");
    const [showdateError, setShowDateError] = useState(false);
    const [interactionStatus, setStatus] = useState(projectFilterState.interactionStatus || []);
    const [statusList, setStatusList] = useState([]);
    const [showStatus, setShowStatus] = useState(false);
    const [showSentDate, setShowSentDate] = useState(false);
    const [showResponseDate, setShowResponseDate] = useState(false);
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
        // { label: 'Project Name' },
        // { label: 'Project Code' },
        { label: 'Status' },
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
    const handleFilterChange = ({ field, scale }) => (event, newValue) => {
        const value = newValue ?? event.target.value;

        if (value < 0) {
            setPositiveNumberError("Only positive num.");
        } else {
            setPositiveNumberError("");
        }
        setProjectFilterState((prev) => {
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
    const currentData = filteredRows?.slice(
        (currentPageProjects - 1) * itemsPerPage,
        currentPageProjects * itemsPerPage
    );

    while (currentData?.length < itemsPerPage) {
        currentData?.push({});
    }

    useEffect(() => {
        const updateCaseId = caseIdList?.find((c) => c?.name === caseId)?.caseIds;
        const updatedStatusId = statusList?.find((proj) => proj?.name === interactionStatus)?.statusId;
        const updatedSentToId = sentToList?.find((proj) => proj?.name === sentTo)?.sentToId;
        setProjectFilterState(prev => ({
            ...prev,
            caseIds: [updateCaseId],
            caseId,
            statusId: [updatedStatusId],
            interactionStatus,
            sentToId: [updatedSentToId],
            sentTo,
            sentStartDate,
            sentEndDate,
            responseReceivedStartDate,
            responseReceivedEndDate,
        }));
    }, [caseId, interactionStatus, statusList, sentTo, sentToList, sentStartDate,
        sentEndDate,
        responseReceivedStartDate,
        responseReceivedEndDate]);

    const fetchFilterInteractionList = async () => {
        try {
            const queryParams = new URLSearchParams();
            const url = `${BaseURL}/api/v1/projects/get-interaction-filter-values?projectIdentifier=${projectId}`;
            const response = await axios.get(url, Authorization_header());
            const data = response?.data?.data || {};
            setStatusList(data?.interactionStatus || []);
            setSentToList(data?.sentToEmails || []);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchFilterInteractionList();
    }, [projectFilterState.companyIds]);

    useEffect(() => {
        if (clearProjectFilterTrigger) {
            setSentStartDate([]);
            setSentEndDate([]);
            setResponseReceivedStartDate([]);
            setResponseReceivedEndDate([]);
            setSentTo([]);
            setDateError([]);
            setStatus([]);
            setResponseDateError([]);
            setProjectFilterState({
                projectId: [],
                caseId: [],
                sentBy: [],
                sentTo: [],
                interactionStatus: [],
                sentStartDate: [],
                sentEndDate: [],
                responseReceivedStartDate: [],
                responseReceivedEndDate: [],
            });
            setShowDateError(false);
            setShowSentStartDate(false);
            setShowResponseReceivedEndDate(false);
            setShowSentEndDate(false);
            setShowResponseReceivedStartDate(false);
            setShowStatus(false);
            setShowSentTo(false);
            setShowResponseDate(false);

        }
    }, [clearProjectFilterTrigger]);

    let projectsOptions;
    useEffect(() => {
        const shouldFetchWithFiltersProjects =
            projectFilterState.projectId?.length > 0 ||
            projectFilterState.caseId?.length > 0 ||
            projectFilterState.sentTo?.length > 0 ||
            projectFilterState.interactionStatus?.length > 0;
        if (shouldFetchWithFiltersProjects) {
            projectsOptions = {
                ...(projectFilterState.caseId?.length > 0 && {
                    caseId: projectFilterState.caseId,
                }),
                ...(projectFilterState.projectId?.length > 0 && {
                    projectId: projectFilterState.projectId,
                }),
                ...(projectFilterState.interactionStatus?.length > 0 && {
                    interactionStatus: projectFilterState.interactionStatus,
                }),
                ...(projectFilterState.sentTo?.length > 0 && {
                    sentTo: projectFilterState.sentTo,
                }),
            };
        }
    }, [projectFilterState]);

    const clearFilters = () => {
        setSearchTerm('');
        setStatus([]);
        setDateError([]);
        setSentTo([]);
        setResponseDateError([]);
        setProjectFilterState({
            projectId: [],
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
        triggerProjectClearFilters();
        setIsProjectFilterApplied(false);
        setShowDateError(false);
    };

    const applyFilters = () => {
        const filters = {
            ...(projectId && { projectId }),
            ...(interactionStatus?.length > 0 && { interactionStatus }),
            ...(sentTo?.length > 0 && { sentTo }),
            ...(sentStartDate && { sentStartDate }),
            ...(sentEndDate && { sentEndDate }),
            ...(responseReceivedStartDate && { responseReceivedStartDate }),
            ...(responseReceivedEndDate && { responseReceivedEndDate }),
        };
        getInteractionListing(filters);
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
                                                                field.label === "Status"
                                                                    ? showStatus
                                                                    : field.label === "Sent To"
                                                                        ? showSentTo
                                                                        : field.label === "Sent Date"
                                                                            ? showSentDate
                                                                            : field.label === "Response Date"
                                                                                ? showResponseDate
                                                                                : false
                                                            }
                                                            onChange={(e) => {
                                                                if (field.label === "Status") {
                                                                    setStatus([]);
                                                                    if (e.target.checked) {
                                                                        setShowStatus(true);
                                                                    } else {
                                                                        setShowStatus(false);
                                                                    }
                                                                }
                                                                else if (field.label === "Sent To") {
                                                                    setSentTo([]);
                                                                    if (e.target.checked) {
                                                                        setShowSentTo(true);
                                                                    } else {
                                                                        setShowSentTo(false);
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

export default ProjectinteractionFilter;

