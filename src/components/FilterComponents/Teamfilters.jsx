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
    InputAdornment,
    InputBase,
} from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { BaseURL } from "../../constants/Baseurl";
import ActionButton from "../FilterComponents/ActionButton";
import { Authorization_header } from "../../utils/helper/Constant";
import { ProjectContext } from "../../context/ProjectContext";
import SentToFilters from "./SentToFilters";
import TeamMemberSelector from "./TeamMemberSelector";
import ProjectRolesSelector from "./ProjectRolesSelector";
import zIndex from "@mui/material/styles/zIndex";
import SearchIcon from "@mui/icons-material/Search";

const styles = {
    drawerPaper: {
        "& .MuiDrawer-paper": {
            height: "37.5%",
            display: "flex",
            flexDirection: "column",
            marginTop: "25rem",
            marginLeft: "20px",
            // borderBottom: "1px solid #E4E4E4",
            borderTopLeftRadius: "20px",
            borderTopRightRadius: "20px",
            borderLeft: "1px solid #E4E4E4",
            overflow: "hidden",
        },
    },
    drawerContainer: {
        display: "flex",
        flexDirection: "column",
        marginTop: "-0%",
        flex: 1,
        overflow: "hidden",
    },
    header: {
        display: "flex",
        alignItems: "center",
        borderBottom: "1px solid #E4E4E4",
        borderTop: "1px solid #E4E4E4",
        px: 2,
        height: "40px",
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
        top: 0,
        zIndex: 1,
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
        overflowY: 'auto',
    },
    footer: {
        display: "flex",
        justifyContent: "flex-end",
        padding: "8px",
        borderTop: "1px solid #E4E4E4",
        marginTop: "5px",
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
        mt: -1
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
        height: "25px",
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
        height: "30px",
        border: "1px solid #9F9F9F",
        mt: 2,
        ml: 1.5,
    },
};

function Teamfilters({ open, handleClose, projectId, page, onApplyFilters, fetchTeamData }) {
    const {
        projectFilterState,
        setProjectFilterState,
        clearProjectFilterTrigger,
        setIsProjectFilterApplied,
        triggerProjectClearFilters,
    } = useContext(ProjectContext);
    const [hourlyRate, setTotalHourlyRate] = useState(projectFilterState.hourlyRate);
    const [totalCost, setTotalExpense] = useState(projectFilterState.totalCost);
    const [qreCost, setQRECost] = useState(projectFilterState.qreCost);
    const [totalHours, setTotalHours] = useState(projectFilterState.totalHours);
    const [rndPotential, setRndPotential] = useState(projectFilterState.rndPotential);
    const [showTotalExpense, setShowTotalExpense] = useState(false);
    const [showQRECost, setShowQRECost] = useState(false);
    const [showTotalHourlyrate, setShowTotalHourlyRate] = useState(false);
    const [showTotalHours, setShowTotalHours] = useState(false);
    const [showRndPotential, setShowRndPotential] = useState(false);
    const [currentPageProjects, setCurrentPageProjects] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [filteredRows, setFilteredRows] = useState([]);
    const [isAccordionOpen, setIsAccordionOpen] = useState(false);
    const [projectsCountError, setProjectsCountError] = useState('');
    const [projectsCountError2, setProjectsCountError2] = useState('');
    const [projectsCountError3, setProjectsCountError3] = useState('');
    const [positiveNumberError, setPositiveNumberError] = useState('');
    const [positiveNumberError2, setPositiveNumberError2] = useState('');
    const [positiveNumberError3, setPositiveNumberError3] = useState('');
    const [dateError, setDateError] = useState("");
    const [responseDateError, setResponseDateError] = useState("");
    const [showdateError, setShowDateError] = useState(false);
    const [employeeIds, setEmployeeIds] = useState(projectFilterState.employeeIds || []);
    const [employeeIdsList, setEmployeeIdsList] = useState([]);
    const [showEmployeeIds, setShowEmployeeIds] = useState(false);
    const [names, setNames] = useState(projectFilterState.names || []);
    const [namesList, setNamesList] = useState([]);
    const [showNames, setShowNames] = useState(false);
    const [employementTypes, setEmployementTypes] = useState(projectFilterState.employementTypes || []);
    const [employementTypesList, setEmployementTypesList] = useState([]);
    const [showEmployementTypes, setShowEmployementTypes] = useState(false);
    const [employeeTitles, setEmployeeTitles] = useState(projectFilterState.employeeTitles || []);
    const [employeeTitlesList, setEmployeeTitlesList] = useState([]);
    const [showEmployeeTitles, setShowEmployeeTitles] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const filterFields = [
        { label: "Employee Ids" },
        { label: "Employee Name" },
        { label: "Employeement Type" },
        { label: "Employee Title" },
        { label: "Hourly Rate" },
        { label: "Total Hours" },
        { label: "Total Expense" },
        { label: "QRE Potential" },
        { label: "QRE Expense" }
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

        setProjectFilterState((prev) => {
            if (scale === "min" || scale === "max") {
                const updatedField = Array.isArray(prev[field]) ? [...prev[field]] : [];
                updatedField[scale === "min" ? 0 : 1] = value;

                // Validation for min and max
                const minValue = parseFloat(updatedField[0]);
                const maxValue = parseFloat(updatedField[1]);

                // Reset error states initially
                if (field === "totalCost") {
                    setProjectsCountError('');
                    setPositiveNumberError('');
                }
                if (field === "qreCost") {
                    setProjectsCountError2('');
                    setPositiveNumberError2('');
                }
                if (field === "hourlyRate") {
                    setProjectsCountError3('');
                    setPositiveNumberError3('');
                }

                // Check for negative values first
                if (value < 0) {
                    if (field === "totalCost") {
                        setPositiveNumberError("Only positive num");
                    }
                    if (field === "qreCost") {
                        setPositiveNumberError2("Only positive num");
                    }
                    if (field === "hourlyRate") {
                        setPositiveNumberError3("Only positive num");
                    }
                } else {
                    // Only check min/max validation if both values are non-negative
                    if (minValue && maxValue && minValue > maxValue) {
                        if (field === "totalCost") {
                            setProjectsCountError("Max should be greater than Min");
                        }
                        if (field === "qreCost") {
                            setProjectsCountError2("Max should be greater than Min");
                        }
                        if (field === "hourlyRate") {
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

    const currentData = filteredRows?.slice(
        (currentPageProjects - 1) * itemsPerPage,
        currentPageProjects * itemsPerPage
    );

    while (currentData?.length < itemsPerPage) {
        currentData?.push({});
    }

    useEffect(() => {
        const updatedemployeeId = employeeIdsList?.find((proj) => proj?.employeeId === employeeIds)?.employeeId
        const updatedNameId = namesList?.find((proj) => proj?.name === names)?.namesId;
        const updatedProjectRolesId = employementTypesList?.find((proj) => proj?.name === employementTypes)?.employementTypesId;
        const updatedEmployeeTitles = employeeTitlesList?.find((proj) => proj?.employeeTitle === employeeTitles)?.employeeTitlesId;
        setProjectFilterState(prev => ({
            ...prev,
            employeeId: [updatedemployeeId],
            employeeIds,
            namesId: [updatedNameId],
            names,
            employementTypesId: [updatedProjectRolesId],
            employementTypes,
            employeeTitlesId: [updatedEmployeeTitles],
            employeeTitles,
        }));
    }, [employeeIds, employeeIdsList, names, namesList, employementTypes, employementTypesList, employeeTitles, employeeTitlesList]);

    const fetchFilterTeamList = async () => {
        try {
            const newProjectId = [projectId];
            const url = `${BaseURL}/api/v1/contacts/get-contact-filter-values?projectId=${newProjectId}`;
            const response = await axios.get(url, Authorization_header());
            const data = response?.data?.data || {};
            setEmployeeIdsList(data?.employeeIds || []);
            setNamesList(data?.names || []);
            setEmployementTypesList(data?.employementTypes || []);
            setEmployeeTitlesList(data?.employeeTitles || []);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchFilterTeamList();
    }, [projectFilterState.companyIds]);

    useEffect(() => {
        if (clearProjectFilterTrigger) {
            setEmployementTypes([]);
            setDateError([]);
            setEmployeeIds([]);
            setNames([]);
            setEmployeeTitles([]);
            setResponseDateError([]);
            setProjectFilterState({
                projectId: [],
                sentBy: [],
                employeeIds: [],
                names: [],
                employementTypes: [],
                employeeTitles: [],
                totalCost: [0, null],
                qreCost: [0, null],
                hourlyRate: [0, null],
                rndPotential: [null, null],
                totalHours: [null, null],
            });
            setShowDateError(false);
            setShowEmployeeIds(false);
            setShowNames(false);
            setShowEmployementTypes(false);
            setShowTotalExpense(false);
            setShowQRECost(false);
            setShowTotalHourlyRate(false);
            setTotalHourlyRate(false);
            setShowTotalExpense(false);
            setShowQRECost(false);
            setShowTotalHours(false);
            setShowRndPotential(false);

        }
    }, [clearProjectFilterTrigger]);

    let projectsOptions;
    useEffect(() => {
        const shouldFetchWithFiltersProjects =
            projectFilterState.projectId?.length > 0 ||
            projectFilterState.employeeIds?.length > 0 ||
            projectFilterState.names?.length > 0 ||
            projectFilterState.employementTypes?.length > 0 ||
            projectFilterState.employeeTitles?.length > 0 ||
            projectFilterState.hourlyRate?.length > 0 ||
            projectFilterState.totalCost?.length > 0 ||
            projectFilterState.qreCost?.length > 0;
        if (shouldFetchWithFiltersProjects) {
            projectsOptions = {
                ...(projectFilterState.projectId?.length > 0 && {
                    projectId: projectFilterState.projectId,
                }),
                ...(projectFilterState.employeeIds?.length > 0 && {
                    employeeIds: projectFilterState.employeeIds,
                }),
                ...(projectFilterState.names?.length > 0 && {
                    names: projectFilterState.names,
                }),
                ...(projectFilterState.employementTypes?.length > 0 && {
                    employementTypes: projectFilterState.employementTypes,
                }),
                ...(projectFilterState.employeeTitles?.length > 0 && {
                    employeeTitles: projectFilterState.employeeTitles,
                }),
                ...(projectFilterState.totalCost && {
                    minTotalExpense: projectFilterState.totalCost[0],
                }),
                ...(projectFilterState.totalCost && {
                    maxTotalExpense: projectFilterState.totalCost[1],
                }),
                ...(projectFilterState.qreCost && {
                    minRnDExpense: projectFilterState.qreCost[0],
                }),
                ...(projectFilterState.qreCost && {
                    maxRnDExpense: projectFilterState.qreCost[1],
                }),
                ...(projectFilterState.hourlyRate && {
                    minTotalHourlyrate: projectFilterState.hourlyRate[0],
                }),
                ...(projectFilterState.hourlyRate && {
                    maxTotalHourlyrate: projectFilterState.hourlyRate[1],
                }),
                ...(projectFilterState.totalHours && {
                    minTotalHours: projectFilterState.totalHours[0],
                }),
                ...(projectFilterState.totalHours && {
                    maxTotalHours: projectFilterState.totalHours[1],
                }),
                ...(projectFilterState.rndPotential && {
                    minRndPotential: projectFilterState.rndPotential[0],
                }),
                ...(projectFilterState.rndPotential && {
                    maxRndPotential: projectFilterState.rndPotential[1],
                }),
            };
        }
    }, [projectFilterState]);

    const clearFilters = () => {
        setSearchTerm('');
        setEmployeeIds([]);
        setNames([]);
        setDateError([]);
        setEmployementTypes([]);
        setEmployeeTitles([]);
        setResponseDateError([]);
        setProjectFilterState({
            projectId: [],
            employeeIds: [],
            names: [],
            employementTypes: [],
            employeeTitles: [],
            totalCost: [0, null],
            qreCost: [0, null],
            hourlyRate: [0, null],
            rndPotential: [null, null],
            totalHours: [null, null],
        });
        setPositiveNumberError('');
        setPositiveNumberError2('');
        setPositiveNumberError3('');
        setProjectsCountError('');
        setProjectsCountError2('');
        setProjectsCountError3('');
        fetchTeamData();
        onApplyFilters({});
        triggerProjectClearFilters();
        setIsProjectFilterApplied(false);
        setShowDateError(false);
    };

    const applyFilters = () => {
        const filters = {
            ...(employeeIds?.length > 0 && { employeeIds }),
            ...(names?.length > 0 && { names }),
            ...(employementTypes?.length > 0 && { employementTypes }),
            ...(employeeTitles?.length > 0 && { employeeTitles }),
            ...(projectFilterState.totalCost && {
                minTotalCost: projectFilterState.totalCost[0],
                maxTotalCost: projectFilterState.totalCost[1],
            }),
            ...(projectFilterState.qreCost && {
                minQRECost: projectFilterState.qreCost[0],
                maxQRECost: projectFilterState.qreCost[1],
            }),
            ...(projectFilterState.hourlyRate && {
                minHourlyrate: projectFilterState.hourlyRate[0],
                maxHourlyrate: projectFilterState.hourlyRate[1],
            }),
            ...(projectFilterState.totalHours && {
                minTotalHours: projectFilterState.totalHours[0],
                maxTotalHours: projectFilterState.totalHours[1],
            }),
            ...(projectFilterState.rndPotential && {
                minRndPotential: projectFilterState.rndPotential[0],
                maxRndPotential: projectFilterState.rndPotential[1],
            }),
        };
        fetchTeamData(filters);
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
                <Box sx={{
                    ...styles.header,
                    position: 'sticky',
                    top: 0,
                    zIndex: 10,
                }}>
                    <Typography sx={styles.title}>
                        Team Member Filter
                    </Typography>
                </Box>
                <Box sx={{
                    position: 'sticky',
                    top: "10px",
                    zIndex: 9,
                }}>
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
                                                                field.label === "Employee Ids"
                                                                    ? showEmployeeIds
                                                                    : field.label === "Employee Name"
                                                                        ? showNames
                                                                        : field.label === "Employeement Type"
                                                                            ? showEmployementTypes
                                                                            : field.label === "Employee Title"
                                                                                ? showEmployeeTitles
                                                                                : field.label === "Hourly Rate"
                                                                                    ? showTotalHourlyrate
                                                                                    : field.label === "Total Hours"
                                                                                        ? showTotalHours
                                                                                        : field.label === "Total Expense"
                                                                                            ? showTotalExpense
                                                                                            : field.label === "QRE Potential"
                                                                                                ? showRndPotential
                                                                                                : field.label === "QRE Expense"
                                                                                                    ? showQRECost
                                                                                                    : false
                                                            }
                                                            onChange={(e) => {
                                                                if (field.label === "Employee Ids") {
                                                                    setEmployeeIds([]);
                                                                    if (e.target.checked) {
                                                                        setShowEmployeeIds(true);
                                                                    } else {
                                                                        setShowEmployeeIds(false);
                                                                    }
                                                                }
                                                                if (field.label === "Employee Name") {
                                                                    setNames([]);
                                                                    if (e.target.checked) {
                                                                        setShowNames(true);
                                                                    } else {
                                                                        setShowNames(false);
                                                                    }
                                                                }
                                                                else if (field.label === "Employeement Type") {
                                                                    setEmployementTypes([]);
                                                                    if (e.target.checked) {
                                                                        setShowEmployementTypes(true);
                                                                    } else {
                                                                        setShowEmployementTypes(false);
                                                                    }
                                                                }
                                                                else if (field.label === "Employee Title") {
                                                                    setEmployeeTitles([]);
                                                                    if (e.target.checked) {
                                                                        setShowEmployeeTitles(true);
                                                                    } else {
                                                                        setShowEmployeeTitles(false);
                                                                    }
                                                                }
                                                                else if (field.label === "Hourly Rate") {
                                                                    if (e.target.checked) {
                                                                        setShowTotalHourlyRate(true);
                                                                    } else {
                                                                        setShowTotalHourlyRate(false);
                                                                        setProjectFilterState(prev => ({
                                                                            ...prev,
                                                                            hourlyRate: [0, null],
                                                                        }));
                                                                    }
                                                                }
                                                                else if (field.label === "Total Hours") {
                                                                    if (e.target.checked) {
                                                                        setShowTotalHours(true);
                                                                    } else {
                                                                        setShowTotalHours(false);
                                                                        setProjectFilterState(prev => ({
                                                                            ...prev,
                                                                            totalHours: [null, null],
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
                                                                            totalCost: [0, null],
                                                                        }));
                                                                    }
                                                                }
                                                                else if (field.label === "QRE Potential") {
                                                                    if (e.target.checked) {
                                                                        setShowRndPotential(true);
                                                                    } else {
                                                                        setShowRndPotential(false);
                                                                        setProjectFilterState(prev => ({
                                                                            ...prev,
                                                                            rndPotential: [null, null],
                                                                        }));
                                                                    }
                                                                } else if (field.label === "QRE Expense") {
                                                                    if (e.target.checked) {
                                                                        setShowQRECost(true);
                                                                    } else {
                                                                        setShowQRECost(false);
                                                                        setProjectFilterState(prev => ({
                                                                            ...prev,
                                                                            qreCost: [0, null],
                                                                        }));
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
                                            {field.label === 'Employee Ids' && (
                                                <Collapse in={showEmployeeIds}>
                                                    <TeamMemberSelector
                                                        teamName={employeeIds}
                                                        teamNameList={employeeIdsList}
                                                        setTeamName={setEmployeeIds}
                                                    />
                                                </Collapse>
                                            )}
                                            {field.label === 'Employee Name' && (
                                                <Collapse in={showNames}>
                                                    <TeamMemberSelector
                                                        teamName={names}
                                                        teamNameList={namesList}
                                                        setTeamName={setNames}
                                                    />
                                                </Collapse>
                                            )}
                                            {field.label === 'Employeement Type' && (
                                                <Collapse in={showEmployementTypes}>
                                                    <ProjectRolesSelector
                                                        projectRoles={employementTypes}
                                                        projectRolesList={employementTypesList}
                                                        setProjectRoles={setEmployementTypes}
                                                    />
                                                </Collapse>
                                            )}
                                            {field.label === 'Employee Title' && (
                                                <Collapse in={showEmployeeTitles}>
                                                    <ProjectRolesSelector
                                                        employementTypes={employeeTitles}
                                                        employementTypesList={employeeTitlesList}
                                                        setProjectRoles={setEmployeeTitles}
                                                    />
                                                </Collapse>
                                            )}
                                            {field.label === 'Hourly Rate' && (
                                                <Collapse in={showTotalHourlyrate}>
                                                    <Box display="flex" gap={3}>
                                                        <TextField
                                                            name="min"
                                                            type="number"
                                                            value={Array.isArray(projectFilterState?.hourlyRate) ? projectFilterState.hourlyRate[0] : ''}
                                                            onChange={handleFilterChange({ field: "hourlyRate", scale: "min" })}
                                                            placeholder="Min Value"
                                                            fullWidth
                                                            InputProps={{
                                                                sx: styles.textField,
                                                            }}
                                                            error={!!positiveNumberError3}
                                                            helperText={positiveNumberError3 || ""}
                                                            FormHelperTextProps={{
                                                                sx: {
                                                                    textAlign: 'left', padding: 0, margin: 0, fontSize: '0.8rem', color: 'red'
                                                                }
                                                            }}
                                                            sx={{ padding: '0px' }}
                                                        />
                                                        <TextField
                                                            name="max"
                                                            type="number"
                                                            value={Array.isArray(projectFilterState?.hourlyRate) ? projectFilterState.hourlyRate[1] : ''}
                                                            onChange={handleFilterChange({ field: "hourlyRate", scale: "max" })}
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
                                            {field.label === 'Total Hours' && (
                                                <Collapse in={showTotalHours}>
                                                    <Box display="flex" gap={3}>
                                                        <TextField
                                                            name="min"
                                                            type="number"
                                                            value={Array.isArray(projectFilterState?.totalHours) ? projectFilterState.totalHours[0] : ''}
                                                            onChange={handleFilterChange({ field: "totalHours", scale: "min" })}
                                                            placeholder="Min Value"
                                                            fullWidth
                                                            InputProps={{
                                                                sx: styles.textField,
                                                            }}
                                                            InputLabelProps={{
                                                                style: { width: '100%', marginTop: "-10px" },
                                                            }}
                                                            // error={!!positiveNumberError}
                                                            // helperText={positiveNumberError || ""}
                                                            // FormHelperTextProps={{
                                                            //     sx: { textAlign: 'left', padding: 0, margin: 0, fontSize: '0.8rem', color: 'red' },
                                                            // }} error={!!positiveNumberError || !!totalCostError}
                                                            error={!!positiveNumberError}
                                                            helperText={positiveNumberError || ""}
                                                            FormHelperTextProps={{
                                                                sx: {
                                                                    textAlign: 'left', padding: 0, margin: 0, fontSize: '0.8rem', color: 'red'
                                                                }
                                                            }}
                                                            sx={{ padding: '0px' }}
                                                        />
                                                        <TextField
                                                            name="max"
                                                            type="number"
                                                            value={Array.isArray(projectFilterState?.totalHours) ? projectFilterState.totalHours[1] : ''}
                                                            onChange={handleFilterChange({ field: "totalHours", scale: "max" })}
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
                                                    {/* </Box> */}
                                                </Collapse>
                                            )}
                                            {field.label === 'Total Expense' && (
                                                <Collapse in={showTotalExpense}>
                                                    <Box display="flex" gap={3}>
                                                        <TextField
                                                            name="min"
                                                            type="number"
                                                            value={Array.isArray(projectFilterState?.totalCost) ? projectFilterState.totalCost[0] : ''}
                                                            onChange={handleFilterChange({ field: "totalCost", scale: "min" })}
                                                            placeholder="Min Value"
                                                            fullWidth
                                                            InputProps={{
                                                                sx: styles.textField,
                                                            }}
                                                            InputLabelProps={{
                                                                style: { width: '100%', marginTop: "-10px" },
                                                            }}
                                                            // error={!!positiveNumberError}
                                                            // helperText={positiveNumberError || ""}
                                                            // FormHelperTextProps={{
                                                            //     sx: { textAlign: 'left', padding: 0, margin: 0, fontSize: '0.8rem', color: 'red' },
                                                            // }} error={!!positiveNumberError || !!totalCostError}
                                                            error={!!positiveNumberError}
                                                            helperText={positiveNumberError || ""}
                                                            FormHelperTextProps={{
                                                                sx: {
                                                                    textAlign: 'left', padding: 0, margin: 0, fontSize: '0.8rem', color: 'red'
                                                                }
                                                            }}
                                                            sx={{ padding: '0px' }}
                                                        />
                                                        <TextField
                                                            name="max"
                                                            type="number"
                                                            value={Array.isArray(projectFilterState?.totalCost) ? projectFilterState.totalCost[1] : ''}
                                                            onChange={handleFilterChange({ field: "totalCost", scale: "max" })}
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
                                                    {/* </Box> */}
                                                </Collapse>
                                            )}
                                            {field.label === 'QRE Potential' && (
                                                <Collapse in={showRndPotential}>
                                                    <Box display="flex" gap={3}>
                                                        <TextField
                                                            name="min"
                                                            type="number"
                                                            value={Array.isArray(projectFilterState?.rndPotential) ? projectFilterState.rndPotential[0] : ''}
                                                            onChange={handleFilterChange({ field: "rndPotential", scale: "min" })}
                                                            placeholder="Min Value"
                                                            fullWidth
                                                            InputProps={{
                                                                sx: styles.textField,
                                                            }}
                                                            InputLabelProps={{
                                                                style: { width: '100%', marginTop: "-10px" },
                                                            }}
                                                            // error={!!positiveNumberError}
                                                            // helperText={positiveNumberError || ""}
                                                            // FormHelperTextProps={{
                                                            //     sx: { textAlign: 'left', padding: 0, margin: 0, fontSize: '0.8rem', color: 'red' },
                                                            // }} error={!!positiveNumberError || !!totalCostError}
                                                            error={!!positiveNumberError}
                                                            helperText={positiveNumberError || ""}
                                                            FormHelperTextProps={{
                                                                sx: {
                                                                    textAlign: 'left', padding: 0, margin: 0, fontSize: '0.8rem', color: 'red'
                                                                }
                                                            }}
                                                            sx={{ padding: '0px' }}
                                                        />
                                                        <TextField
                                                            name="max"
                                                            type="number"
                                                            value={Array.isArray(projectFilterState?.rndPotential) ? projectFilterState.rndPotential[1] : ''}
                                                            onChange={handleFilterChange({ field: "rndPotential", scale: "max" })}
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
                                                    {/* </Box> */}
                                                </Collapse>
                                            )}
                                            {field.label === 'QRE Expense' && (
                                                <Collapse in={showQRECost}>
                                                    <Box display="flex" gap={3}>
                                                        <TextField
                                                            name="min"
                                                            type="number"
                                                            value={Array.isArray(projectFilterState?.qreCost) ? projectFilterState.qreCost[0] : ''}
                                                            onChange={handleFilterChange({ field: "qreCost", scale: "min" })}
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
                                                                sx: {
                                                                    textAlign: 'left', padding: 0, margin: 0, fontSize: '0.8rem', color: 'red'
                                                                }
                                                            }}
                                                            sx={{ padding: '0px' }}
                                                        />
                                                        <TextField
                                                            name="max"
                                                            type="number"
                                                            value={Array.isArray(projectFilterState?.qreCost) ? projectFilterState.qreCost[1] : ''}
                                                            onChange={handleFilterChange({ field: "qreCost", scale: "max" })}
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

export default Teamfilters;

