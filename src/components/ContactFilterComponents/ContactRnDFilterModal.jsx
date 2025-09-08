import { Accordion, AccordionDetails, Box, Checkbox, Collapse, Drawer, FormControlLabel, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { BaseURL } from "../../constants/Baseurl";
import { Authorization_header } from "../../utils/helper/Constant";
import axios from "axios";
import ActionButton from "../FilterComponents/ActionButton";
import PrimaryContactsFilter from "../FilterComponents/PrimaryContactsFilter";
import MinMaxFilter from "../FilterComponents/MinMaxFilter";

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

const projectFilterFields = ["Project Name", "Project ID", "Total Hours", "Hourly Rate", "QRE Expense"];

const ContactRnDFilterModal = ({ open, handleClose, contactId, getFilterParams, setSelectedProjectNames, setSetelectedProjectId, setSelectedRnDExpense, setSelectedHourlyRate, setSelectedTotalHours, selectedProjectNames, selectedProjectId, selectedRnDExpense, selectedHourlyRate, selectedTotalHours, applyFilters, clearFilters }) => {
    const [filterFields, setFilterFields] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showProjectNames, setShowProjectNames] = useState(false);
    const [showProjectId, setShowProjectId] = useState(false);
    const [showTotalHours, setShowTotalHour] = useState(false);
    const [showHourlyRate, setShowHourlyRate] = useState(false);
    const [showRndExpense, setShowRndExpense] = useState(false);
    const [positiveNumberError, setPositiveNumberError] = useState("");
    const [rndPositiveNumberError, setRndPositiveNumberError] = useState("");
    const [totalHoursPositiveNumberError, setTotalHoursPositiveNumberError] = useState("");

    const getProjectsFilterFields = async () => {
        const url = `${BaseURL}/api/v1/projects/get-projects-filter-values`;
        const payload = { headers: Authorization_header().headers, params: { contactId: contactId } };
        const response = await axios.get(url, payload);
        setFilterFields(response?.data?.data);
    };

    useEffect(() => {
        getProjectsFilterFields();
    }, []);

    useEffect(() => {
    }, [filterFields])

    useEffect(() => {
        const params = {};
        if (selectedProjectNames.length) {
            params.projectNames = selectedProjectNames;
        } if (selectedProjectId.length) {
            params.projectIds = selectedProjectId;
        } if (selectedTotalHours.min) {
            params.minTotalHours = selectedTotalHours.min;
        } if (selectedTotalHours.max) {
            params.maxTotalHours = selectedTotalHours.max;
        } if (selectedHourlyRate.min) {
            params.minHourlyRate = selectedHourlyRate.min;
        } if (selectedHourlyRate.max) {
            params.maxHourlyRate = selectedHourlyRate.max;
        } if (selectedRnDExpense.min) {
            params.minRnDExpense = selectedRnDExpense.min;
        } if (selectedRnDExpense.max) {
            params.maxRnDExpense = selectedRnDExpense.max;
        }
        getFilterParams({ params });
    }, [selectedProjectNames, selectedProjectId, selectedRnDExpense, selectedHourlyRate]);

    const handleFilterChange = ({ field, scale, value }) => {
        if (field === "hourlyRate") {
            const numericValue = Number(value);
            let errorMessage = "";

            if (numericValue < 0) {
                errorMessage = "The input value should be positive";
            } else {
                if (scale === "max") {
                    if (selectedHourlyRate?.min && numericValue <= selectedHourlyRate.min) {
                        errorMessage = "The max value of Total Expense should be greater than the min value of Total Expense";
                    } else {
                        errorMessage = "";
                    }
                    setSelectedHourlyRate({ ...selectedHourlyRate, max: numericValue });
                } else if (scale === "min") {
                    if (selectedHourlyRate?.max && numericValue >= selectedHourlyRate.max) {
                        errorMessage = "The min value of Total Expense should be less than the max value of Total Expense";
                    } else {
                        errorMessage = "";
                    }
                    setSelectedHourlyRate({ ...selectedHourlyRate, min: numericValue });
                }
            }

            setPositiveNumberError(errorMessage);
        } else if (field === "rndExpense") {
            const numericValue = Number(value);
            let errorMessage = "";

            if (numericValue < 0) {
                errorMessage = "The input value should be positive";
            } else {
                if (scale === "max") {
                    if (selectedRnDExpense?.min && numericValue <= selectedRnDExpense.min) {
                        errorMessage = "The max value of RnD Expense should be greater than the min value of RnD Expense";
                    } else {
                        errorMessage = "";
                    }
                    setSelectedRnDExpense({ ...selectedRnDExpense, max: numericValue });
                } else if (scale === "min") {
                    if (selectedRnDExpense?.max && numericValue >= selectedRnDExpense.max) {
                        errorMessage = "The min value of RnD Expense should be less than the max value of RnD Expense"
                    } else {
                        errorMessage = "";
                    }
                    setSelectedRnDExpense({ ...selectedRnDExpense, min: numericValue });
                }
            }
            setRndPositiveNumberError(errorMessage);
        } else if (field === "totalHours") {
            const numericValue = Number(value);
            let errorMessage = "";

            if (numericValue < 0) {
                errorMessage = "The input value should be positive";
            } else {
                if (scale === "max") {
                    if (selectedTotalHours?.min && numericValue <= selectedTotalHours.min) {
                        errorMessage = "Max must be greater than Min";
                    } else {
                        errorMessage = "";
                    }
                    setSelectedTotalHours({ ...selectedTotalHours, max: numericValue });
                } else if (scale === "min") {
                    if (selectedTotalHours?.max && numericValue >= selectedTotalHours.max) {
                        errorMessage = "Min must be less than Max"
                    } else {
                        errorMessage = "";
                    }
                    setSelectedTotalHours({ ...selectedTotalHours, min: numericValue });
                }
            }
            setTotalHoursPositiveNumberError(errorMessage);
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
                                {projectFilterFields.filter(field => field.toLowerCase().includes(searchTerm))
                                    .map((field, index) => (
                                        <Box key={index}>
                                            <FormControlLabel control={
                                                <Checkbox checked={
                                                    field === "Project Name" ? showProjectNames :
                                                        field === "Project ID" ? showProjectId :
                                                            field === "Total Hours" ? showTotalHours :
                                                                field === "Hourly Rate" ? showHourlyRate :
                                                                    field === "QRE Expense" ? showRndExpense : false
                                                }
                                                    onChange={(e) => {
                                                        if (field === "Project Name") {
                                                            setShowProjectNames(e.target.checked);
                                                        } else if (field === "Project ID") {
                                                            setShowProjectId(e.target.checked);
                                                        } else if (field === "Total Hours") {
                                                            setShowTotalHour(e.target.checked);
                                                        } else if (field === "Hourly Rate") {
                                                            setShowHourlyRate(e.target.checked);
                                                        } else if (field === "QRE Expense") {
                                                            setShowRndExpense(e.target.checked);
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
                                            }
                                                label={field}
                                            />

                                            {field === "Project Name" && (
                                                <Collapse in={showProjectNames}>
                                                    {filterFields && filterFields?.projectNames && Array.isArray(filterFields?.projectNames) && <PrimaryContactsFilter primaryContactsList={filterFields?.projectNames} primaryContacts={selectedProjectNames} setPrimaryContacts={setSelectedProjectNames} />}
                                                </Collapse>
                                            )}
                                            {field === "Project ID" && (
                                                <Collapse in={showProjectId}>
                                                    {filterFields && filterFields?.projectCodes && Array.isArray(filterFields?.projectCodes) && <PrimaryContactsFilter primaryContactsList={filterFields?.projectCodes} primaryContacts={selectedProjectId} setPrimaryContacts={setSetelectedProjectId} />}
                                                </Collapse>
                                            )}
                                            {field === "Total Hours" && (
                                                <Collapse in={showTotalHours}>
                                                    <MinMaxFilter minName={"min"} maxName={"max"} minValue={selectedTotalHours?.min} maxValue={selectedTotalHours?.max} handleFilterChange={handleFilterChange} minPlaceholder={"Min Value"} maxPlaceholder={"Max Value"} positiveNumberError={totalHoursPositiveNumberError} field={"totalHours"} />
                                                </Collapse>
                                            )}
                                            {field === "Hourly Rate" && (
                                                <Collapse in={showHourlyRate}>
                                                    <MinMaxFilter minName={"min"} maxName={"max"} minValue={selectedHourlyRate?.min} maxValue={selectedHourlyRate?.max} handleFilterChange={handleFilterChange} minPlaceholder={"Min Value"} maxPlaceholder={"Max Value"} positiveNumberError={positiveNumberError} field={"hourlyRate"} />
                                                </Collapse>
                                            )}
                                            {field === "QRE Expense" && (
                                                <Collapse in={showRndExpense}>
                                                    <MinMaxFilter minName={"min"} maxName={"max"} minValue={selectedRnDExpense?.min} maxValue={selectedRnDExpense?.max} handleFilterChange={handleFilterChange} minPlaceholder={"Min Value"} maxPlaceholder={"Max Value"} positiveNumberError={rndPositiveNumberError} field={"rndExpense"} />
                                                </Collapse>
                                            )}
                                        </Box>
                                    ))}
                            </Box>
                        </AccordionDetails>
                    </Accordion>
                </Box>
                <Box sx={styles.footer}>
                    <ActionButton label="Clear" color={styles.clearButton.color} onClick={clearFilters} />
                    <ActionButton label="Apply" color={styles.applyButton.color} onClick={applyFilters} />
                </Box>
            </Box>

        </Drawer >
    )
};

export default ContactRnDFilterModal;