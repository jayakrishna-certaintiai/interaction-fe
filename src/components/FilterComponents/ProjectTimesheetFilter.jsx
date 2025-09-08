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
            marginTop: "20rem",
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

function ProjectTimesheetFilter({ open, handleClose, projectId, onApplyFilters, fetchTimesheetData }) {
    const {
        projectFilterState,
        setProjectFilterState,
        clearProjectFilterTrigger,
        setIsProjectFilterApplied,
        triggerProjectClearFilters,
    } = useContext(ProjectContext);
    const [currentPageProjects, setCurrentPageProjects] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [filteredRows, setFilteredRows] = useState([]);
    const [isAccordionOpen, setIsAccordionOpen] = useState(false);
    const [projectsCountError, setProjectsCountError] = useState('');
    const [positiveNumberError, setPositiveNumberError] = useState('');
    const [dateError, setDateError] = useState("");
    const [showdateError, setShowDateError] = useState(false);
    const [status, setStatus] = useState(projectFilterState.status || []);
    const [statusList, setStatusList] = useState([]);
    const [showStatus, setShowStatus] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showTotalHours, setShowTotalHours] = useState(false);
    const [showUploadedOn, setShowUploadedOn] = useState(false);
    const [startUploadedOn, setStartDate] = useState('');
    const [endUploadedOn, setEndDate] = useState('');

    const minTotalHours = projectFilterState?.totalhours?.[0] ?? 0;
    const maxTotalHours = projectFilterState?.totalhours?.[1] ?? null;

    const filterFields = [
        { label: 'Status' },
        { label: 'Total Hours' },
        { label: 'Uploaded On' },
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
        const updatedStatusId = statusList?.find((proj) => proj?.status === status)?.statusId;
        setProjectFilterState(prev => ({
            ...prev,
            statusId: [updatedStatusId],
            status,
        }));
    }, [status, statusList]);

    const fetchFilterTeamList = async () => {
        try {
            const url = `${BaseURL}/api/v1/timesheets/get-timesheet-filter-values?projectId=${projectId}`;
            const response = await axios.get(url, Authorization_header());
            const data = response?.data?.data || {};
            setStatusList(data?.status || []);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchFilterTeamList();
    }, [projectFilterState.companyIds]);

    useEffect(() => {
        if (clearProjectFilterTrigger) {
            setDateError([]);
            setStatus([]);
            setProjectFilterState({
                projectId: [],
                sentBy: [],
                status: [],
                totalhours: [0, null],
                startUploadedOn: '',
                endUploadedOn: '',
            });
            setShowDateError(false);
            setShowStatus(false);
            setShowTotalHours(false);

        }
    }, [clearProjectFilterTrigger]);

    let projectsOptions;
    useEffect(() => {
        const shouldFetchWithFiltersProjects =
            projectFilterState.projectId?.length > 0 ||
            projectFilterState.showUploadedOn?.length > 0 ||
            projectFilterState.status?.length > 0;
        if (shouldFetchWithFiltersProjects) {
            projectsOptions = {
                ...(projectFilterState.projectId?.length > 0 && {
                    projectId: projectFilterState.projectId,
                }),
                ...(projectFilterState.status?.length > 0 && {
                    status: projectFilterState.status,
                }),
                ...(projectFilterState.totalhours && {
                    minTotalhours: projectFilterState.totalhours[0],
                }),
                ...(projectFilterState.totalhours && {
                    maxTotalhours: projectFilterState.totalhours[1],
                }),
            };
        }
    }, [projectFilterState]);

    const clearFilters = () => {
        setSearchTerm('');
        setStatus([]);
        setDateError([]);
        setStartDate([]);
        setEndDate([]);
        setProjectFilterState({
            projectId: [],
            status: [],
            totalhours: [0, null],
            startUploadedOn: '',
            endUploadedOn: '',
        });
        setPositiveNumberError('');
        setProjectsCountError('');
        fetchTimesheetData();
        onApplyFilters({});
        triggerProjectClearFilters();
        setIsProjectFilterApplied(false);
        setShowDateError(false);
        setShowUploadedOn(false);
        setShowTotalHours(false);
    };

    const applyFilters = () => {
        const filters = {
            ...(status?.length > 0 && { status }),
            ...(startUploadedOn && { startUploadedOn }),
            ...(endUploadedOn && { endUploadedOn }),
            ...(Array.isArray(projectFilterState.totalhours) && {
                minTotalhours: projectFilterState.totalhours[0],
                maxTotalhours: projectFilterState.totalhours[1],
            }),
        };
        fetchTimesheetData(filters);
    };

    const handleFilterChange = ({ field, scale }) => (event, newValue) => {
        const value = newValue ?? event.target.value;

        setProjectFilterState((prev) => {
            // Ensure 'totalhours' is an array before modifying it
            const updatedField = Array.isArray(prev[field]) ? [...prev[field]] : [0, null];  // Initialize as array
            updatedField[scale === "min" ? 0 : 1] = value;

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
        });
    };

    const handleDateChange = (dateType) => (event) => {
        if (dateType === 'startUploadedOn') {
            setStartDate(event.target.value);
        } else if (dateType === 'endUploadedOn') {
            setEndDate(event.target.value);
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
                        Project Timesheet Filter
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
                                                                    : field.label === "Total Hours"
                                                                        ? showTotalHours
                                                                        : field.label === "Uploaded On"
                                                                            ? showUploadedOn
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
                                                                else if (field.label === "Total Hours") {
                                                                    if (e.target.checked) {
                                                                        setShowTotalHours(true);
                                                                    } else {
                                                                        setShowTotalHours(false);
                                                                        setProjectFilterState(prev => ({
                                                                            ...prev,
                                                                            totalhours: [0, null],
                                                                        }));
                                                                    }
                                                                }
                                                                else if (field.label === "Uploaded On") {
                                                                    setShowUploadedOn([]);
                                                                    setShowUploadedOn(e.target.checked);
                                                                    if (!e.target.checked) {
                                                                        setStartDate("");
                                                                        setEndDate("");
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
                                                        status={status}
                                                        statusList={statusList}
                                                        setStatus={setStatus}
                                                    />
                                                </Collapse>
                                            )}
                                            {field.label === 'Total Hours' && (
                                                <Collapse in={showTotalHours}>
                                                    <Box display="flex" gap={3}>
                                                        <TextField
                                                            name="min"
                                                            type="number"
                                                            // value={projectFilterState?.totalhours[0] ?? ''}
                                                            onChange={handleFilterChange({ field: "totalhours", scale: "min" })}
                                                            placeholder="Min Value"
                                                            fullWidth
                                                            InputProps={{
                                                                sx: styles.textField,
                                                            }}
                                                            InputLabelProps={{
                                                                style: { width: '100%', marginTop: "-10px" },
                                                            }}
                                                            error={!!positiveNumberError}
                                                            helperText={positiveNumberError || ""}
                                                            FormHelperTextProps={{
                                                                sx: { textAlign: 'left', padding: 0, margin: 0, fontSize: '0.8rem', color: 'red' },
                                                            }}
                                                            sx={{ padding: '0px' }}
                                                        />
                                                        <TextField
                                                            name="max"
                                                            type="number"
                                                            // value={projectFilterState?.totalhours[1] || ''}
                                                            onChange={handleFilterChange({ field: "totalhours", scale: "max" })}
                                                            fullWidth
                                                            placeholder="Max Value"
                                                            sx={{ marginRight: "10px" }}
                                                            InputProps={{
                                                                sx: styles.textField,
                                                            }}
                                                        />
                                                    </Box>

                                                    {projectsCountError && (
                                                        <Typography color="error" variant="body2">
                                                            {projectsCountError}
                                                        </Typography>
                                                    )}
                                                </Collapse>
                                            )}
                                            {field.label === 'Uploaded On' && (
                                                <Collapse in={showUploadedOn}>
                                                    <Box display="flex" gap={3}>
                                                        <TextField
                                                            type="date"
                                                            label="Start Date"
                                                            value={startUploadedOn || ""}
                                                            onChange={handleDateChange('startUploadedOn')}
                                                            fullWidth
                                                            InputLabelProps={{ shrink: true }}
                                                            InputProps={{
                                                                sx: styles.textField,
                                                            }}
                                                        />
                                                        <TextField
                                                            type="date"
                                                            label="End Date"
                                                            value={endUploadedOn || ""}
                                                            onChange={handleDateChange('endUploadedOn')}
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

export default ProjectTimesheetFilter;

