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
import { ProjectContext } from "../../context/ProjectContext";
import TeamMemberSelector from "./TeamMemberSelector";

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
            marginTop: "21rem",
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

function ProjectTaskFilters({ open, handleClose, projectId, onApplyFilters, projectTask }) {
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
    const [taskHourlyRate, setTaskHourlyRate] = useState(projectFilterState.taskHourlyRate);
    const [totalExpense, setTotalExpense] = useState(projectFilterState.totalExpense);
    const [rndExpense, setRndExpense] = useState(projectFilterState.rndExpense);
    const [projectsCountError, setProjectsCountError] = useState('');
    const [projectsCountError2, setProjectsCountError2] = useState('');
    const [projectsCountError3, setProjectsCountError3] = useState('');
    const [positiveNumberError, setPositiveNumberError] = useState('');
    const [positiveNumberError2, setPositiveNumberError2] = useState('');
    const [positiveNumberError3, setPositiveNumberError3] = useState('');
    const [dateError, setDateError] = useState("");
    const [showdateError, setShowDateError] = useState(false);
    const [names, setNames] = useState(projectFilterState.names || []);
    const [namesList, setNamesList] = useState([]);
    const [showNames, setShowNames] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showTotalHours, setShowTotalHours] = useState(false);
    const [showTotalExpense, setShowTotalExpense] = useState(false);
    const [showRnDExpense, setShowRnDExpense] = useState(false);
    const [showUploadedOn, setShowUploadedOn] = useState(false);
    const [startUploadedOn, setStartDate] = useState('');
    const [endUploadedOn, setEndDate] = useState('');

    const filterFields = [
        { label: 'Member Name' },
        { label: 'Task Date' },
        { label: 'Hourly Rate' },
        { label: 'Total Expense' },
        { label: 'QRE Expense' },
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
        const updatedNamesId = namesList?.find((proj) => proj?.names === names)?.namesId;
        setProjectFilterState(prev => ({
            ...prev,
            namesId: [updatedNamesId],
            names,
        }));
    }, [names, namesList]);

    const fetchFilterTeamList = async () => {
        try {
            const url = `${BaseURL}/api/v1/timesheets/get-timesheettasks-filter-values?projectId=${projectId}`;
            const response = await axios.get(url, Authorization_header());
            const data = response?.data?.data || {};
            setNamesList(data?.names || []);
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
            setNames([]);
            setProjectFilterState({
                projectId: [],
                sentBy: [],
                names: [],
                taskHourlyRate: [0, null],
                totalExpense: [0, null],
                rndExpense: [0, null],
                startUploadedOn: '',
                endUploadedOn: '',
            });
            setShowDateError(false);
            setShowNames(false);
            setShowTotalHours(false);
            setShowTotalExpense(false);
            setShowRnDExpense(false);
            setTaskHourlyRate(false);
            setTotalExpense(false);
            setRndExpense(false);

        }
    }, [clearProjectFilterTrigger]);

    let projectsOptions;
    useEffect(() => {
        const shouldFetchWithFiltersProjects =
            projectFilterState.projectId?.length > 0 ||
            projectFilterState.showUploadedOn?.length > 0 ||
            projectFilterState.totalExpense?.length > 0 ||
            projectFilterState.rndExpense?.length > 0 ||
            projectFilterState.names?.length > 0;
        if (shouldFetchWithFiltersProjects) {
            projectsOptions = {
                ...(projectFilterState.projectId?.length > 0 && {
                    projectId: projectFilterState.projectId,
                }),
                ...(projectFilterState.names?.length > 0 && {
                    names: projectFilterState.names,
                }),
                ...(projectFilterState.taskHourlyRate && {
                    minHourlyRate: projectFilterState.taskHourlyRate[0],
                }),
                ...(projectFilterState.taskHourlyRate && {
                    maxHourlyRate: projectFilterState.taskHourlyRate[1],
                }),
                ...(projectFilterState.totalExpense && {
                    minTotalExpense: projectFilterState.totalExpense[0],
                }),
                ...(projectFilterState.totalExpense && {
                    maxTotalExpense: projectFilterState.totalExpense[1],
                }),
                ...(projectFilterState.rndExpense && {
                    minRnDExpense: projectFilterState.rndExpense[0],
                }),
                ...(projectFilterState.rndExpense && {
                    maxRnDExpense: projectFilterState.rndExpense[1],
                }),
            };
        }
    }, [projectFilterState]);

    const clearFilters = () => {
        setSearchTerm('');
        setNames([]);
        setDateError([]);
        setStartDate([]);
        setEndDate([]);
        setProjectFilterState({
            projectId: [],
            names: [],
            taskHourlyRate: [0, null],
            totalExpense: [0, null],
            rndExpense: [0, null],
            startUploadedOn: '',
            endUploadedOn: '',
        });
        setPositiveNumberError('');
        setProjectsCountError('');
        setPositiveNumberError2('');
        setProjectsCountError2('');
        setPositiveNumberError3('');
        setProjectsCountError3('');
        projectTask();
        onApplyFilters({});
        triggerProjectClearFilters();
        setIsProjectFilterApplied(false);
        setShowDateError(false);
        setShowUploadedOn(false);
        setShowTotalHours(false);
    };

    const applyFilters = () => {
        const filters = {
            ...(names?.length > 0 && { names }),
            ...(startUploadedOn && { startUploadedOn }),
            ...(endUploadedOn && { endUploadedOn }),
            ...(Array.isArray(projectFilterState.taskHourlyRate) && {
                minHourlyRate: projectFilterState.taskHourlyRate[0],
                maxHourlyRate: projectFilterState.taskHourlyRate[1],
            }),
            ...(projectFilterState.totalExpense && {
                minTotalExpense: projectFilterState.totalExpense[0],
                maxTotalExpense: projectFilterState.totalExpense[1],
            }),
            ...(projectFilterState.rndExpense && {
                minRnDExpense: projectFilterState.rndExpense[0],
                maxRnDExpense: projectFilterState.rndExpense[1],
            }),
        };
        projectTask(filters);
    };

    const handleFilterChange = ({ field, scale }) => (event, newValue) => {
        const value = newValue ?? event.target.value;

        setProjectFilterState((prev) => {
            if (scale === "min" || scale === "max") {
                const updatedField = Array.isArray(prev[field]) ? [...prev[field]] : [];
                updatedField[scale === "min" ? 0 : 1] = value;

                // Validation for min and max
                const minValue = parseFloat(updatedField[0]);
                const maxValue = parseFloat(updatedField[1]);

                // Reset error states initially
                if (field === "taskHourlyRate") {
                    setProjectsCountError('');
                    setPositiveNumberError('');
                }
                if (field === "totalExpense") {
                    setProjectsCountError2('');
                    setPositiveNumberError2('');
                }
                if (field === "rndExpense") {
                    setProjectsCountError3('');
                    setPositiveNumberError3('');
                }

                // Check for negative values first
                if (value < 0) {
                    if (field === "taskHourlyRate") {
                        setPositiveNumberError("Only positive num");
                    }
                    if (field === "totalExpense") {
                        setPositiveNumberError2("Only positive num");
                    }
                    if (field === "rndExpense") {
                        setPositiveNumberError3("Only positive num");
                    }
                } else {
                    // Only check min/max validation if both values are non-negative
                    if (minValue && maxValue && minValue > maxValue) {
                        if (field === "taskHourlyRate") {
                            setProjectsCountError("Max should be greater than Min");
                        }
                        if (field === "totalExpense") {
                            setProjectsCountError2("Max should be greater than Min");
                        }
                        if (field === "rndExpense") {
                            setProjectsCountError3("Max should be greater than Min");
                        }
                    }
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
                        Project Task Filter
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
                                                                field.label === "Member Name"
                                                                    ? showNames
                                                                    : field.label === "Hourly Rate"
                                                                        ? showTotalHours
                                                                        : field.label === "Task Date"
                                                                            ? showUploadedOn
                                                                            : field.label === "Total Expense"
                                                                                ? showTotalExpense
                                                                                : field.label === "QRE Expense"
                                                                                    ? showRnDExpense
                                                                                    : false
                                                            }
                                                            onChange={(e) => {
                                                                if (field.label === "Member Name") {
                                                                    setNames([]);
                                                                    if (e.target.checked) {
                                                                        setShowNames(true);
                                                                    } else {
                                                                        setShowNames(false);
                                                                    }
                                                                }
                                                                else if (field.label === "Hourly Rate") {
                                                                    if (e.target.checked) {
                                                                        setShowTotalHours(true);
                                                                    } else {
                                                                        setShowTotalHours(false);
                                                                        setProjectFilterState(prev => ({
                                                                            ...prev,
                                                                            taskHourlyRate: [0, null],
                                                                        }));
                                                                    }
                                                                }
                                                                else if (field.label === "Total Expense") {
                                                                    if (e.target.checked) {
                                                                        setShowTotalExpense(true);
                                                                    } else {
                                                                        setShowTotalExpense(false);
                                                                        setProjectFilterState(prev => ({
                                                                            ...prev,
                                                                            totalExpense: [0, null],
                                                                        }));
                                                                    }
                                                                } else if (field.label === "QRE Expense") {
                                                                    if (e.target.checked) {
                                                                        setShowRnDExpense(true);
                                                                    } else {
                                                                        setShowRnDExpense(false);
                                                                        setProjectFilterState(prev => ({
                                                                            ...prev,
                                                                            rndExpense: [0, null],
                                                                        }));
                                                                    }
                                                                }
                                                                else if (field.label === "Task Date") {
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
                                            {field.label === 'Member Name' && (
                                                <Collapse in={showNames}>
                                                    <TeamMemberSelector
                                                        teamName={names}
                                                        teamNameList={namesList}
                                                        setTeamName={setNames}
                                                    />
                                                </Collapse>
                                            )}
                                            {field.label === 'Hourly Rate' && (
                                                <Collapse in={showTotalHours}>
                                                    <Box display="flex" gap={3}>
                                                        <TextField
                                                            name="min"
                                                            type="number"
                                                            // value={projectFilterState?.taskHourlyRate[0] ?? ''}
                                                            onChange={handleFilterChange({ field: "taskHourlyRate", scale: "min" })}
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
                                                            // value={projectFilterState?.taskHourlyRate[1] || ''}
                                                            onChange={handleFilterChange({ field: "taskHourlyRate", scale: "max" })}
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
                                            {field.label === 'Task Date' && (
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
                                            {field.label === 'Total Expense' && (
                                                <Collapse in={showTotalExpense}>
                                                    <Box display="flex" gap={3}>
                                                        <TextField
                                                            name="min"
                                                            type="number"
                                                            value={Array.isArray(projectFilterState?.totalExpense) ? projectFilterState.totalExpense[0] : ''}
                                                            onChange={handleFilterChange({ field: "totalExpense", scale: "min" })}
                                                            placeholder="Min Value"
                                                            fullWidth
                                                            InputProps={{
                                                                sx: styles.textField,
                                                            }}
                                                            InputLabelProps={{
                                                                style: { width: '100%', marginTop: "-10px" },
                                                            }}
                                                            error={!!positiveNumberError2}
                                                            helperText={positiveNumberError2 || ""}
                                                            FormHelperTextProps={{
                                                                sx: { textAlign: 'left', padding: 0, margin: 0, fontSize: '0.8rem', color: 'red' }, // Align to the leftmost, no padding or margin
                                                            }}
                                                            sx={{ padding: '0px' }}
                                                        />
                                                        <TextField
                                                            name="max"
                                                            type="number"
                                                            value={Array.isArray(projectFilterState?.totalExpense) ? projectFilterState.totalExpense[1] : ''}
                                                            onChange={handleFilterChange({ field: "totalExpense", scale: "max" })}
                                                            fullWidth
                                                            placeholder="Max Value"
                                                            sx={{ marginRight: "10px" }}
                                                            InputProps={{
                                                                sx: styles.textField,
                                                            }}
                                                        />
                                                    </Box>

                                                    {projectsCountError2 && (
                                                        <Typography color="error" variant="body2">
                                                            {projectsCountError2}
                                                        </Typography>
                                                    )}
                                                    {/* </Box> */}
                                                </Collapse>
                                            )}
                                            {field.label === 'QRE Expense' && (
                                                <Collapse in={showRnDExpense}>
                                                    <Box display="flex" gap={3}>
                                                        <TextField
                                                            name="min"
                                                            type="number"
                                                            value={Array.isArray(projectFilterState?.rndExpense) ? projectFilterState.rndExpense[0] : ''}
                                                            onChange={handleFilterChange({ field: "rndExpense", scale: "min" })}
                                                            placeholder="Min Value"
                                                            fullWidth
                                                            InputProps={{
                                                                sx: styles.textField,
                                                            }}
                                                            InputLabelProps={{
                                                                style: { width: '100%', marginTop: "-10px" },
                                                            }}
                                                            error={!!positiveNumberError3}
                                                            helperText={positiveNumberError3 || ""}
                                                            FormHelperTextProps={{
                                                                sx: { textAlign: 'left', padding: 0, margin: 0, fontSize: '0.8rem', color: 'red' },
                                                            }}
                                                            sx={{ padding: '0px' }}
                                                        />
                                                        <TextField
                                                            name="max"
                                                            type="number"
                                                            value={Array.isArray(projectFilterState?.rndExpense) ? projectFilterState.rndExpense[1] : ''}
                                                            onChange={handleFilterChange({ field: "rndExpense", scale: "max" })}
                                                            fullWidth
                                                            placeholder="Max Value"
                                                            sx={{ marginRight: "10px" }}
                                                            InputProps={{
                                                                sx: styles.textField,
                                                            }}
                                                        />
                                                    </Box>
                                                    {projectsCountError3 && (
                                                        <Typography color="error" variant="body2">
                                                            {projectsCountError3}
                                                        </Typography>
                                                    )}
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

export default ProjectTaskFilters;

