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
import { TimesheetContext } from "../../context/TimesheetContext";
import ProjectSelector from "./ProjectSelector";
import ProjectCodeSelect from "./ProjectCodeSelect";
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
            height: "42.5%",
            display: "flex",
            flexDirection: "column",
            marginTop: "17rem",
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

function TimesheetProjectFilter({ open, handleClose, onApplyFilters, timesheetId }) {
    const {
        projectFilterState,
        setProjectFilterState,
        clearProjectFilterTrigger,
        triggerProjectClearFilters,
        fetchTimesheetProjects,
    } = useContext(ProjectContext);
    const [company, setCompany] = useState(projectFilterState.company);
    const [showCompany, setShowCompany] = useState(false);
    const [projectNames, setProjectNames] = useState(projectFilterState.projectNames);
    const [projectNameList, setProjectNameList] = useState([]);
    const [showProjectName, setShowProjectName] = useState(false);
    const [projectCodes, setProjectCodes] = useState(projectFilterState.projectCodes);
    const [projectCodesList, setProjectCodesList] = useState([]);
    const [showProjectCodes, setShowProjectCodes] = useState(false);
    const [spocName, setSpocName] = useState(projectFilterState.spocName);
    const [spocNameList, setSpocNameList] = useState([]);
    const [showSpocName, setShowSpocName] = useState(false);
    const [spocEmail, setSpocEmail] = useState(projectFilterState.spocEmail);
    const [spocEmailList, setSpocEmailList] = useState([]);
    const [showSpocEmail, setShowSpocEmail] = useState(false);
    const [isAccordionOpen, setIsAccordionOpen] = useState(false);
    const [projectsCountError, setProjectsCountError] = useState('');
    const [projectsCountError2, setProjectsCountError2] = useState('');
    const [projectsCountError3, setProjectsCountError3] = useState('');
    const [positiveNumberError, setPositiveNumberError] = useState('');
    const [positiveNumberError2, setPositiveNumberError2] = useState('');
    const [positiveNumberError3, setPositiveNumberError3] = useState('');
    const { clientList } = useContext(FilterListContext);
    const [showTotalExpense, setShowTotalExpense] = useState(false);
    const [showRnDExpense, setShowRnDExpense] = useState(false);
    const [showRnDPotential, setShowRnDPotential] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const filterFields = [
        { label: 'Project Name' },
        { label: 'Project Code' },
        { label: 'SPOC Name' },
        { label: 'SPOC Email' },
        { label: 'Total Expense' },
        { label: 'QRE Expense' },
        { label: 'QRE Potential' },
    ];
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

                const minValue = parseFloat(updatedField[0]);
                const maxValue = parseFloat(updatedField[1]);

                // Reset error states initially
                if (field === "totalExpense") {
                    setProjectsCountError('');
                    setPositiveNumberError('');
                }
                if (field === "rndExpense") {
                    setProjectsCountError2('');
                    setPositiveNumberError2('');
                }
                if (field === "rndPotential") {
                    setProjectsCountError3('');
                    setPositiveNumberError3('');
                }

                // Check for negative values first
                if (value < 0) {
                    if (field === "totalExpense") {
                        setPositiveNumberError("Only positive num");
                    }
                    if (field === "rndExpense") {
                        setPositiveNumberError2("Only positive num");
                    }
                    if (field === "rndPotential") {
                        setPositiveNumberError3("Only positive num");
                    }
                } else {
                    // Only check min/max validation if both values are non-negative
                    if (minValue && maxValue && minValue > maxValue) {
                        if (field === "totalExpense") {
                            setProjectsCountError("Max should be greater than Min");
                        }
                        if (field === "rndExpense") {
                            setProjectsCountError2("Max should be greater than Min");
                        }
                        if (field === "rndPotential") {
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
    useEffect(() => {
        const updatedCompanyId = Array.isArray(company) ? company.map(c => c.companyId) : undefined;
        const updatedCaseProjectNameId = projectNameList?.find((proj) => proj?.caseprojectName === projectNames)?.caseProjectNamesId;
        const updatedProjectCodeId = projectCodesList?.find((proj) => proj?.projectCodes === projectCodes)?.ProjectCodesId;
        const updatedSpocNameId = spocNameList?.find((proj) => proj?.name === spocName)?.spocNameId;
        const updatedSpocEmailId = spocEmailList?.find((proj) => proj?.name === spocEmail)?.spocEmailId;
        setProjectFilterState(prev => ({
            ...prev,
            companyId: updatedCompanyId,
            company,
            caseprojectNameId: [updatedCaseProjectNameId],
            projectNames,
            ProjectCodesId: [updatedProjectCodeId],
            projectCodes,
            spocNameId: [updatedSpocNameId],
            spocName,
            spocEmailId: [updatedSpocEmailId],
            spocEmail,
        }));
    }, [company, clientList, spocName, spocEmail, projectCodes, projectCodesList, projectNames, projectNameList, spocNameList, spocEmailList]);
    const fetchProjectsList = async () => {
        try {
            const url = `${BaseURL}/api/v1/projects/get-projects-filter-values?timesheetId=${timesheetId}`;
            const response = await axios.get(url, Authorization_header());
            const data = response?.data?.data || {};
            setProjectCodesList(data?.projectCodes || []);
            setProjectNameList(data?.projectNames || []);
            setSpocNameList(data?.spocNames || []);
            setSpocEmailList(data?.spocEmails || []);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchProjectsList();
    }, [projectFilterState.companyIds]);

    useEffect(() => {
        if (clearProjectFilterTrigger) {
            setCompany([]);
            setProjectNames([]);
            setProjectCodes([]);
            setSpocName([]);
            setSpocEmail([]);
            setProjectFilterState({
                companyId: [],
                accountingYear: [],
                projectNames: [],
                company: [],
                projectCodes: [],
                spocName: [],
                spocEmail: [],
                totalExpense: [0, null],
                rndExpense: [0, null],
                rndPotential: [0, null],
            });
            setShowCompany(false);
            setShowSpocName(false);
            setShowSpocEmail(false);
            setShowTotalExpense(false);
            setShowRnDExpense(false);
            setShowRnDPotential(false);
            setShowProjectName(false);
            setShowProjectCodes(false);
        }
    }, [clearProjectFilterTrigger]);

    let projectsOptions;
    useEffect(() => {
        const shouldFetchWithFiltersProjects =
            projectFilterState.company?.length > 0 ||
            projectFilterState.projectNames?.length > 0 ||
            projectFilterState.spocName?.length > 0 ||
            projectFilterState.spocEmail?.length > 0 ||
            projectFilterState.projectCodes?.length > 0 ||
            projectFilterState.totalExpense?.length > 0 ||
            projectFilterState.rndExpense?.length > 0 ||
            projectFilterState.rndPotential?.length > 0;
        if (shouldFetchWithFiltersProjects) {
            projectsOptions = {
                ...(projectFilterState.companyId?.length > 0 && {
                    companyIds: projectFilterState.companyId,
                }),
                ...(projectFilterState.spocName?.length > 0 && {
                    spocName: projectFilterState.spocName,
                }),
                ...(projectFilterState.projectNames?.length > 0 && {
                    projectNames: projectFilterState.projectNames,
                }),
                ...(projectFilterState.spocEmail?.length > 0 && {
                    spocEmail: projectFilterState.spocEmail,
                }),
                ...(projectFilterState.projectCodes?.length > 0 && {
                    projectCodes: projectFilterState.projectCodes,
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
                ...(projectFilterState.rndPotential && {
                    minRnDPotential: projectFilterState.rndPotential[0],
                }),
                ...(projectFilterState.rndPotential && {
                    maxRnDPotential: projectFilterState.rndPotential[1],
                }),
            };
        }
    }, [projectFilterState]);

    const clearFilters = () => {
        setProjectNames([]);
        setProjectCodes([]);
        setSpocName([]);
        setSpocEmail([]);
        setSearchTerm('');
        setProjectFilterState({
            companyId: [],
            projectNames: [],
            projectCodes: [],
            company: [],
            project: [],
            spocName: [],
            spocEmail: [],
            totalExpense: [0, null],
            rndExpense: [0, null],
            rndPotential: [0, null],
        });
        setPositiveNumberError('');
        setProjectsCountError('');
        onApplyFilters({});
        triggerProjectClearFilters();
        fetchTimesheetProjects({ timesheetId });
    };

    const applyFilters = () => {
        const filters = {
            ...(company?.length > 0 && { companyId: company.map(c => c.companyId) }),
            ...(timesheetId?.length > 0 && { timesheetId }),
            ...(projectNames?.length > 0 && { projectNames }),
            ...(projectCodes?.length > 0 && { projectCodes }),
            ...(spocName?.length > 0 && { spocName }),
            ...(spocEmail?.length > 0 && { spocEmail }),
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
            ...(projectFilterState.rndPotential && {
                minRnDPotential: projectFilterState.rndPotential[0],
            }),
            ...(projectFilterState.rndPotential && {
                maxRnDPotential: projectFilterState.rndPotential[1],
            }),
        };

        fetchTimesheetProjects(filters);
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
                        Project Filter
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
                                                                    ? showProjectName
                                                                    : field.label === "Project Code"
                                                                        ? showProjectCodes
                                                                        : field.label === "SPOC Name"
                                                                            ? showSpocName
                                                                            : field.label === "SPOC Email"
                                                                                ? showSpocEmail
                                                                                : field.label === "Total Expense"
                                                                                    ? showTotalExpense
                                                                                    : field.label === "QRE Expense"
                                                                                        ? showRnDExpense
                                                                                        : field.label === "QRE Potential"
                                                                                            ? showRnDPotential
                                                                                            : false
                                                            }
                                                            onChange={(e) => {
                                                                if (field.label === "Project Name") {
                                                                    if (e.target.checked) {
                                                                        setShowProjectName(true);
                                                                    } else {
                                                                        setShowProjectName(false);
                                                                        setProjectNames([]);
                                                                    }
                                                                } else if (field.label === "Project Code") {
                                                                    if (e.target.checked) {
                                                                        setShowProjectCodes(true);
                                                                    } else {
                                                                        setShowProjectCodes(false);
                                                                        setProjectCodes([]);
                                                                    }
                                                                } else if (field.label === "SPOC Name") {
                                                                    if (e.target.checked) {
                                                                        setShowSpocName(true);
                                                                    } else {
                                                                        setShowSpocName(false);
                                                                        setSpocName([]);
                                                                    }
                                                                } else if (field.label === "SPOC Email") {
                                                                    if (e.target.checked) {
                                                                        setShowSpocEmail(true);
                                                                    } else {
                                                                        setShowSpocEmail(false);
                                                                        setSpocEmail([]);
                                                                    }
                                                                } else if (field.label === "Total Expense") {
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
                                                                } else if (field.label === "QRE Potential") {
                                                                    if (e.target.checked) {
                                                                        setShowRnDPotential(true);
                                                                    } else {
                                                                        setShowRnDPotential(false);
                                                                        setProjectFilterState(prev => ({
                                                                            ...prev,
                                                                            rndPotential: [0, null],
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
                                            {field.label === 'Project Name' && (
                                                <Collapse in={showProjectName}>
                                                    <ProjectSelector
                                                        projectNames={projectNames}
                                                        projectNamesList={projectNameList}
                                                        setProjectNames={setProjectNames} />
                                                </Collapse>
                                            )}
                                            {field.label === 'Project Code' && (
                                                <Collapse in={showProjectCodes}>
                                                    <ProjectCodeSelect
                                                        projectCodes={projectCodes}
                                                        projectCodesList={projectCodesList}
                                                        setProjectCodes={setProjectCodes} />
                                                </Collapse>
                                            )}
                                            {field.label === 'SPOC Name' && (
                                                <Collapse in={showSpocName}>
                                                    <SpocNameFilters
                                                        spocName={spocName}
                                                        spocNameList={spocNameList}
                                                        setSpocName={setSpocName}
                                                    />
                                                </Collapse>
                                            )}
                                            {field.label === 'SPOC Email' && (
                                                <Collapse in={showSpocEmail}>
                                                    <SpocEmailFilters
                                                        spocEmail={spocEmail}
                                                        spocEmailList={spocEmailList}
                                                        setSpocEmail={setSpocEmail}
                                                    />
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

                                                    {projectsCountError && (
                                                        <Typography color="error" variant="body2">
                                                            {projectsCountError}
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
                                                            error={!!positiveNumberError2}
                                                            helperText={positiveNumberError2 || ""}
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
                                                    {projectsCountError2 && (
                                                        <Typography color="error" variant="body2">
                                                            {projectsCountError2}
                                                        </Typography>
                                                    )}
                                                </Collapse>
                                            )}
                                            {field.label === 'QRE Potential' && (
                                                <Collapse in={showRnDPotential}>
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

export default TimesheetProjectFilter;

