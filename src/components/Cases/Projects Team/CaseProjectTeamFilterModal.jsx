import { Accordion, AccordionDetails, Box, Checkbox, Collapse, Drawer, FormControlLabel, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import PrimaryContactsFilter from "../../FilterComponents/PrimaryContactsFilter";
import MinMaxFilter from "../../FilterComponents/MinMaxFilter";
import ActionButton from "../../FilterComponents/ActionButton";
import { BaseURL } from "../../../constants/Baseurl";
import { Authorization_header } from "../../../utils/helper/Constant";

const styles = {
    drawerPaper: {
        "& .MuiDrawer-paper": {
            height: "auto",
            maxHeight: "40%",
            display: "flex",
            flexDirection: "column",
            marginTop: "25rem",
            marginLeft: "10px",
            borderBottom: "1px solid #E4E4E4",
            borderTopLeftRadius: "20px",
            borderTopRightRadius: "20px",
            borderLeft: "1px solid #E4E4E4",
            transition: "all 0.2s ease-in-out",
            overflow: "hidden",
        },
    },
    drawerContainer: {
        display: "flex",
        flexDirection: "column",
        flex: 1,
        overflowY: "auto",
        marginTop: "-0%",
        overflowY: "auto",
        width: "17rem"
    },
    header: {
        display: "flex",
        alignItems: "center",
        borderBottom: "1px solid #E4E4E4",
        borderTop: "1px solid #E4E4E4",
        px: 2,
        height: "60px",
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
        overflowY: "auto",
        maxHeight: "calc(40% - 100px)"
    },
    footer: {
        display: "flex",
        justifyContent: "flex-end",
        padding: "16px",
        borderTop: "1px solid #E4E4E4",
        marginTop: "1px",
        gap: 1,
        marginTop: "auto",
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

const filterFields = [{ label: "Employee Ids" }, { label: "Role" }, { label: "Employee Name" }, { label: "Employeement Type" }, { label: "Project Ids" }, /*{ label: "Project Codes" }, */ { label: "Project Name" }, { label: "Hourly Rate" }, { label: "Total Hours" }, { label: "Total Expense" }, { label: "QRE Potential" }, /*{ label: "Rnd Hours" },*/ { label: "QRE Cost" }];

const CaseProjectTeamFilterModal = ({ open, handleClose, caseId, fetchFilters, triggerClear, setTriggerClear }) => {
    const [teamMemberIds, setTeamMemberIds] = useState([]);
    const [showTeamMemberIds, setShowTeamMemberIds] = useState(false);
    const [employeeIds, setEmployeeIds] = useState([]);
    const [showEmployeeIds, setShowEmployeeIds] = useState(false);
    const [designations, setDesignations] = useState([]);
    const [showDesignations, setShowDesignations] = useState(false);
    const [companyIds, setCompanyIds] = useState([]);
    const [names, setNames] = useState([]);
    const [showNames, setShowNames] = useState(false);
    const [employementTypes, setEmployementTypes] = useState([]);
    const [showEmployementTypes, setShowEmployementTypes] = useState(false);
    const [employeeTitles, setEmployeeTitles] = useState([]);
    const [showEmployeeTitles, setShowEmployeeTitle] = useState(false);
    const [companyNames, setCompanyNames] = useState([]);
    const [showCompanyNames, setShowCompanyNames] = useState(false);
    const [projectIds, setProjectIds] = useState([]);
    const [showProjectIds, setShowProjectIds] = useState(false);
    const [projectCodes, setProjectCodes] = useState([]);
    const [showProjectCodes, setShowProjectCodes] = useState(false);
    const [projectNames, setProjectNames] = useState([]);
    const [showProjectNames, setShowProjectNames] = useState(false);
    const [hourlyRate, setHourlyRate] = useState({ min: null, max: null });
    const [showHourlyRate, setShowHourlyRate] = useState(false);
    const [totalHours, setTotalHours] = useState({ min: null, max: null });
    const [showTotalHours, setShowTotalHours] = useState(false);
    const [totalCost, setTotalCost] = useState({ min: null, max: null });
    const [showTotalCost, setShowTotalCost] = useState(false);
    const [rndPotential, setRndPotential] = useState({ min: null, max: null });
    const [showRnd, setShowRnd] = useState(false);
    const [rndHours, setRndHours] = useState({ min: null, max: null });
    const [showRndHours, setShowRndHours] = useState(false);
    const [rndCost, setRndCost] = useState({ min: null, max: null });
    const [showRndCost, setShowRndCost] = useState(false);
    const [filterValues, setFilterValues] = useState({});
    const [filterCompanyNames, setFilterCompanyNames] = useState([]);
    const [hourlyRateError, setHourlyRateError] = useState("");
    const [totalHoursError, setTotalHoursError] = useState("");
    const [totalCostError, setTotalCostError] = useState("");
    const [rndPotentialError, setRndPotentialError] = useState("");
    const [rndHoursError, setRndHoursError] = useState("");
    const [rndCostError, setRndCostError] = useState("");
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [open]);

    useEffect(() => {
        if (triggerClear) {
            clearFilters();
        }
    }, [triggerClear])

    const clearFilters = () => {
        // Reset all filter-related states
        setShowTeamMemberIds(false);
        setTeamMemberIds([]);
        setShowEmployeeIds(false);
        setEmployeeIds([]);
        setShowDesignations(false);
        setDesignations([]);
        // setShowCompanyNames(false);
        // setCompanyNames([]);
        setShowNames(false);
        setNames([]);
        setShowEmployementTypes(false);
        setEmployementTypes([]);
        setShowEmployeeTitle(false);
        setEmployeeTitles([]);
        setShowProjectIds(false);
        setProjectIds([]);
        setShowProjectCodes(false);
        setProjectCodes([]);
        setShowProjectNames(false);
        setProjectNames([]);
        setShowHourlyRate(false);
        setHourlyRate({ min: null, max: null });
        setShowTotalHours(false);
        setTotalHours({ min: null, max: null });
        setShowTotalCost(false);
        setTotalCost({ min: null, max: null });
        setShowRnd(false);
        setRndPotential({ min: null, max: null });
        setShowRndHours(false);
        setRndHours({ min: null, max: null });
        setShowRndCost(false);
        setRndCost({ min: null, max: null });

        // Reset error messages (if any)
        setHourlyRateError("");
        setTotalHoursError("");
        setTotalCostError("");
        setRndPotentialError("");
        setRndHoursError("");
        setRndCostError("");

        setSearchTerm("");

        setTriggerClear(true);
    };

    const applyFilters = () => {
        const filters = {
            ...(teamMemberIds.length > 0 && { teamMemberIds: teamMemberIds }),
            ...(employeeIds.length > 0 && { employeeIds: employeeIds }),
            ...(designations.length > 0 && { employeeTitles: designations }),
            ...(names.length && { names: names }),
            ...(employementTypes.length && { employementTypes: employementTypes }),
            ...(projectIds.length && { projectIds: projectIds }),
            ...(projectCodes.length && { projectCodes: projectCodes }),
            ...(projectNames.length && { projectNames: projectNames }),
            ...((hourlyRate?.min || hourlyRate?.max) && { hourlyRate: [hourlyRate.min, hourlyRate.max] }),
            ...((totalHours?.min || totalHours?.max) && { totalHours: [totalHours.min, totalHours.max] }),
            ...((totalCost?.min || totalCost?.max) && { totalCosts: [totalCost.min, totalCost.max] }),
            ...((rndCost?.min || rndCost?.max) && { qreCosts: [rndCost.min, rndCost.max] }),
            ...((rndPotential?.min || rndPotential?.max) && { rndPotentials: [rndPotential.min, rndPotential.max] }),
        }
        fetchFilters(filters);
    };

    const fetchTeamMemberList = async () => {
        const queryParams = new URLSearchParams();
        try {
            queryParams.append("caseId", caseId);
            const queryString = queryParams.toString();
            const url = `${BaseURL}/api/v1/contacts/get-contact-filter-values?${queryString && queryString}`;
            const response = await axios.get(url, Authorization_header());
            setFilterValues(response?.data?.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchTeamMemberList();
    }, []);

    const handleFilterChange = ({ field, scale, value }) => {
        const numericValue = Number(value);
        let errorMessage = "";

        const updateField = (fieldState, setFieldState, minError, maxError) => {
            if (numericValue < 0) {
                errorMessage = "The input value should be positive";
            } else {
                if (scale === "max") {
                    if (fieldState?.min && numericValue <= fieldState.min) {
                        errorMessage = maxError;
                    } else {
                        errorMessage = "";
                    }
                    setFieldState({ ...fieldState, max: numericValue });
                } else if (scale === "min") {
                    if (fieldState?.max && numericValue >= fieldState.max) {
                        errorMessage = minError;
                    } else {
                        errorMessage = "";
                    }
                    setFieldState({ ...fieldState, min: numericValue });
                }
            }
        };

        switch (field) {
            case "hourlyRate":
                updateField(
                    hourlyRate,
                    setHourlyRate,
                    "The min value of Hourly Rate should be less than the max value of Hourly Rate",
                    "The max value of Hourly Rate should be greater than the min value of Hourly Rate"
                );
                setHourlyRateError(errorMessage);
                break;

            case "totalHours":
                updateField(
                    totalHours,
                    setTotalHours,
                    "The min value of Total Hours should be less than the max value of Total Hours",
                    "The max value of Total Hours should be greater than the min value of Total Hours"
                );
                setTotalHoursError(errorMessage);
                break;

            case "totalCost":
                updateField(
                    totalCost,
                    setTotalCost,
                    "The min value of Total Expense should be less than the max value of Total Expense",
                    "The max value of Total Expense should be greater than the min value of Total Expense"
                );
                setTotalCostError(errorMessage);
                break;

            case "rndPotential":
                updateField(
                    rndPotential,
                    setRndPotential,
                    "The min value of RnD Potential should be less than the max value of RnD Potential",
                    "The max value of RnD Potential should be greater than the min value of RnD Potential"
                );
                setRndPotentialError(errorMessage);
                break;

            case "rndHours":
                updateField(
                    rndHours,
                    setRndHours,
                    "The min value of RnD Hours should be less than the max value of RnD Hours",
                    "The max value of RnD Hours should be greater than the min value of RnD Hours"
                );
                setRndHoursError(errorMessage);
                break;

            case "rndCost":
                updateField(
                    rndCost,
                    setRndCost,
                    "The min value of RnD Cost should be less than the max value of RnD Cost",
                    "The max value of RnD Cost should be greater than the min value of RnD Cost"
                );
                setRndCostError(errorMessage);
                break;

            default:
                console.warn(`Unhandled field: ${field}`);
        }
    };

    return (
        <Drawer anchor="left" open={open} onClose={handleClose} variant="persistent" sx={styles.drawerPaper}>
            <Box sx={styles.drawerContainer}>
                <Box sx={styles.header}>
                    <Typography sx={styles.title}>
                        Projects Filter
                    </Typography>
                </Box>
                <Box sx={styles.accordion}>
                    <Accordion expanded={false} sx={{ height: "100%", overflow: 'auto', backgroundColor: 'transparent', '&:hover': { backgroundColor: "#FFFFFF" }, boxShadow: "none", borderRadius: "20px" }}>
                        <AccordionDetails sx={styles.accordionDetails}>
                            <Box>
                                {filterFields.filter(field => field.label.toLowerCase().includes(searchTerm))
                                    .map((field, index) => (
                                        <Box key={index}>
                                            <FormControlLabel
                                                control={
                                                    <>
                                                        <Checkbox
                                                            checked={
                                                                field.label === "Team Member Ids" ? showTeamMemberIds :
                                                                    field.label === "Employee Ids" ? showEmployeeIds :
                                                                        field.label === "Role" ? showDesignations :
                                                                            field.label === "Accounts" ? showCompanyNames :
                                                                                field.label === "Employee Name" ? showNames :
                                                                                    field.label === "Employeement Type" ? showEmployementTypes :
                                                                                        field.label === "Employee Titles" ? showEmployeeTitles :
                                                                                            field.label === "Project Ids" ? showProjectIds :
                                                                                                field.label === "Project Codes" ? showProjectCodes :
                                                                                                    field.label === "Project Name" ? showProjectNames :
                                                                                                        field.label === "Hourly Rate" ? showHourlyRate :
                                                                                                            field.label === "Total Hours" ? showTotalHours :
                                                                                                                field.label === "Total Expense" ? showTotalCost :
                                                                                                                    field.label === "QRE Potential" ? showRnd :
                                                                                                                        field.label === "Rnd Hours" ? showRndHours :
                                                                                                                            field.label === "QRE Cost" ? showRndCost :
                                                                                                                                false
                                                            }
                                                            onChange={e => {
                                                                if (field.label === "Team Member Ids") {
                                                                    if (e.target.checked) setShowTeamMemberIds(true);
                                                                    else {
                                                                        setShowTeamMemberIds(false);
                                                                        setTeamMemberIds([]);
                                                                    }
                                                                } else if (field.label === "Employee Ids") {
                                                                    if (e.target.checked) setShowEmployeeIds(true);
                                                                    else {
                                                                        setShowEmployeeIds(false);
                                                                        setEmployeeIds([]);
                                                                    }
                                                                } else if (field.label === "Role") {
                                                                    if (e.target.checked) setShowDesignations(true);
                                                                    else {
                                                                        setShowDesignations(false);
                                                                        setDesignations([]);
                                                                    }
                                                                } else if (field.label === "Accounts") {
                                                                    if (e.target.checked) setShowCompanyNames(true);
                                                                    else {
                                                                        setShowCompanyNames(false);
                                                                        setCompanyNames([]);
                                                                    }
                                                                } else if (field.label === "Employee Name") {
                                                                    if (e.target.checked) setShowNames(true);
                                                                    else {
                                                                        setShowNames(false);
                                                                        setNames([]);
                                                                    }
                                                                } else if (field.label === "Employeement Type") {
                                                                    if (e.target.checked) setShowEmployementTypes(true);
                                                                    else {
                                                                        setShowEmployementTypes(false);
                                                                        setEmployementTypes([]);
                                                                    }
                                                                } else if (field.label === "Employee Titles") {
                                                                    if (e.target.checked) setShowEmployeeTitle(true);
                                                                    else {
                                                                        setShowEmployeeTitle(false);
                                                                        setEmployeeTitles([]);
                                                                    }
                                                                } else if (field.label === "Project Ids") {
                                                                    if (e.target.checked) setShowProjectIds(true);
                                                                    else {
                                                                        setShowProjectIds(false);
                                                                        setProjectIds([]);
                                                                    }
                                                                } else if (field.label === "Project Codes") {
                                                                    if (e.target.checked) setShowProjectCodes(true);
                                                                    else {
                                                                        setShowProjectCodes(false);
                                                                        setProjectCodes([]);
                                                                    }
                                                                } else if (field.label === "Project Name") {
                                                                    if (e.target.checked) setShowProjectNames(true);
                                                                    else {
                                                                        setShowProjectNames(false);
                                                                        setProjectNames([]);
                                                                    }
                                                                } else if (field.label === "Hourly Rate") {
                                                                    if (e.target.checked) setShowHourlyRate(true);
                                                                    else {
                                                                        setShowHourlyRate(false);
                                                                        setHourlyRate({ min: null, max: null });
                                                                    }
                                                                } else if (field.label === "Total Hours") {
                                                                    if (e.target.checked) setShowTotalHours(true);
                                                                    else {
                                                                        setShowTotalHours(false);
                                                                        setHourlyRate({ min: null, max: null });
                                                                    }
                                                                } else if (field.label === "Total Expense") {
                                                                    if (e.target.checked) setShowTotalCost(true);
                                                                    else {
                                                                        setShowTotalCost(false);
                                                                        setTotalCost({ min: null, max: null });
                                                                    }
                                                                } else if (field.label === "QRE Potential") {
                                                                    if (e.target.checked) setShowRnd(true);
                                                                    else {
                                                                        setShowRnd(false);
                                                                        setRndPotential({ min: null, max: null });
                                                                    }
                                                                } else if (field.label === "Rnd Hours") {
                                                                    if (e.target.checked) setShowRndHours(true);
                                                                    else {
                                                                        setShowRndHours(false);
                                                                        setRndHours({ min: null, max: null });
                                                                    }
                                                                } else if (field.label === "QRE Cost") {
                                                                    if (e.target.checked) setShowRndCost(true);
                                                                    else {
                                                                        setShowRndCost(false);
                                                                        setRndCost({ min: null, max: null });
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
                                            {field.label === "Team Member Ids" && (
                                                <Collapse in={showTeamMemberIds}>
                                                    {<PrimaryContactsFilter primaryContactsList={filterValues?.employeeIds} primaryContacts={teamMemberIds} setPrimaryContacts={setTeamMemberIds} />}
                                                </Collapse>
                                            )}
                                            {field.label === "Employee Ids" && (
                                                <Collapse in={showEmployeeIds}>
                                                    {<PrimaryContactsFilter primaryContactsList={filterValues?.employeeIds} setPrimaryContacts={setEmployeeIds} primaryContacts={employeeIds} />}
                                                </Collapse>
                                            )}
                                            {field.label === "Role" && (
                                                <Collapse in={showDesignations}>
                                                    {<PrimaryContactsFilter setPrimaryContacts={setDesignations} primaryContacts={designations} primaryContactsList={filterValues?.employeeTitles} />}
                                                </Collapse>
                                            )}
                                            {field.label === "Accounts" && (
                                                <Collapse in={showCompanyNames}>
                                                    {<PrimaryContactsFilter setPrimaryContacts={setCompanyNames} primaryContacts={companyNames} primaryContactsList={filterCompanyNames} />}
                                                </Collapse>
                                            )}
                                            {field.label === "Employee Name" && (
                                                <Collapse in={showNames}>
                                                    {<PrimaryContactsFilter primaryContactsList={filterValues?.names} primaryContacts={names} setPrimaryContacts={setNames} />}
                                                </Collapse>
                                            )} {field.label === "Employeement Type" && (
                                                <Collapse in={showEmployementTypes}>
                                                    {<PrimaryContactsFilter primaryContactsList={filterValues?.employementTypes} primaryContacts={employementTypes} setPrimaryContacts={setEmployementTypes} />}
                                                </Collapse>
                                            )} {field.label === "Project Ids" && (
                                                <Collapse in={showProjectIds}>
                                                    {<PrimaryContactsFilter primaryContactsList={filterValues?.projectCodes} primaryContacts={projectCodes} setPrimaryContacts={setProjectCodes} />}
                                                </Collapse>
                                            )} {field.label === "Project Codes" && (
                                                <Collapse in={showProjectCodes} >
                                                    {<PrimaryContactsFilter primaryContactsList={filterValues?.projectCodes} primaryContacts={projectCodes} setPrimaryContacts={setProjectCodes} />}
                                                </Collapse>
                                            )} {field.label === "Project Name" && (
                                                <Collapse in={showProjectNames}>
                                                    {<PrimaryContactsFilter primaryContactsList={filterValues?.projectNames} primaryContacts={projectNames} setPrimaryContacts={setProjectNames} />}
                                                </Collapse>
                                            )} {field.label === "Hourly Rate" && (
                                                <Collapse in={showHourlyRate}>
                                                    <MinMaxFilter minName={"min"} maxName={"max"} type={"number"} minValue={hourlyRate?.min} maxValue={hourlyRate?.max} handleFilterChange={handleFilterChange} minPlaceholder={"Min Value"} maxPlaceholder={"Max Value"} positiveNumberError={hourlyRateError} field={"hourlyRate"} />
                                                </Collapse>
                                            )} {field.label === "Total Hours" && (
                                                <Collapse in={showTotalHours}>
                                                    <MinMaxFilter minName={"min"} maxName={"max"} type={"number"} minValue={totalHours?.min} maxValue={totalHours?.max} handleFilterChange={handleFilterChange} minPlaceholder={"Min Value"} maxPlaceholder={"Max Value"} positiveNumberError={totalHoursError} field={"totalHours"} />
                                                </Collapse>
                                            )} {field.label === "Total Expense" && (
                                                <Collapse in={showTotalCost}>
                                                    <MinMaxFilter minName={"min"} maxName={"max"} type={"number"} minValue={totalCost?.min} maxValue={totalCost?.max} handleFilterChange={handleFilterChange} minPlaceholder={"Min Value"} maxPlaceholder={"Max Value"} positiveNumberError={totalCostError} field={"totalCost"} />
                                                </Collapse>
                                            )} {field.label === "QRE Potential" && (
                                                <Collapse in={showRnd}>
                                                    <MinMaxFilter minName={"min"} maxName={"max"} type={"number"} minValue={rndPotential?.min} maxValue={rndPotential?.max} handleFilterChange={handleFilterChange} minPlaceholder={"Min Value"} maxPlaceholder={"Max Value"} positiveNumberError={rndPotentialError} field={"rndPotential"} />
                                                </Collapse>
                                            )} {field.label === "Rnd Hours" && (
                                                <Collapse in={showRndHours}>
                                                    <MinMaxFilter minName={"min"} maxName={"max"} type={"number"} minValue={rndHours?.min} maxValue={rndHours?.max} handleFilterChange={handleFilterChange} minPlaceholder={"Min Value"} maxPlaceholder={"Max Value"} positiveNumberError={rndHoursError} field={"rndHours"} />
                                                </Collapse>
                                            )} {field.label === "QRE Cost" && (
                                                <Collapse in={showRndCost}>
                                                    <MinMaxFilter minName={"min"} maxName={"max"} type={"number"} minValue={rndCost?.min} maxValue={rndCost?.max} handleFilterChange={handleFilterChange} minPlaceholder={"Min Value"} maxPlaceholder={"Max Value"} positiveNumberError={rndCostError} field={"rndCost"} />
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
    )
}

export default CaseProjectTeamFilterModal