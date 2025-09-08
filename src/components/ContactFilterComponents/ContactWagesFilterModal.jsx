import { Accordion, AccordionDetails, Box, Checkbox, Collapse, Drawer, FormControlLabel, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import DateFilterComponent from "../FilterComponents/DateFilterComponent";
import { BaseURL } from "../../constants/Baseurl";
import { Authorization_header } from "../../utils/helper/Constant";
import axios from "axios";
import MinMaxFilter from "../FilterComponents/MinMaxFilter";
import ActionButton from "../FilterComponents/ActionButton";

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

const employeeFilterFields = ["Annual Salary", "Hourly Rate", "Start Date", "End Date"];

const ContactWagesFilterModal = ({ open, handleClose, contactId, getFilterParams, annualSalary, setAnnualSalary, hourlyRate, setHourlyRate, startDate, setStartDate, endDate, setEndDate, applyFilters, clearFilters }) => {
    const [filterFields, setFilterFields] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showAnnualSalary, setShowAnnualSalary] = useState(false);
    const [showHourlyRate, setShowHourlyRate] = useState(false);
    const [showStartDate, setShowStartDate] = useState(false);
    const [showEndDate, setShowEndDate] = useState(false);
    const [annualSalaryError, setAnnualSalaryError] = useState("");
    const [hourlyRateError, setHourlyRateError] = useState("")
    const [startDateError, setStartDateError] = useState("")
    const [endDateError, setEndDateError] = useState("")

    const getWagesFilterFields = async () => {
        const url = `${BaseURL}/api/v1/projects/get-projects-filter-values`;
        const payload = { headers: Authorization_header().headers, params: { contactId: contactId } };
        const response = await axios.get(url, payload);
        setFilterFields(response?.data?.data);
    };

    useEffect(() => {
        getWagesFilterFields();
    }, []);

    const handleFilterChange = ({ field, scale, value }) => {
        if (field === "AnnualSalary") {
            const numericValue = Number(value);
            let errorMessage = "";

            if (numericValue < 0) {
                errorMessage = "The input value should be positive";
            } else {
                if (scale === "max") {
                    if (annualSalary?.min && numericValue <= annualSalary?.min) {
                        errorMessage = "Max should be greater than Min";
                    } else {
                        errorMessage = "";
                    }
                    setAnnualSalary({ ...annualSalary, max: numericValue });
                } else if (scale === "min") {
                    if (annualSalary?.max && numericValue >= annualSalary?.max) {
                        errorMessage = "Min should be lesser than Max";
                    } else {
                        errorMessage = "";
                    }
                    setAnnualSalary({ ...annualSalary, min: numericValue });
                }
            }
            setAnnualSalaryError(errorMessage);
        } else if (field === "hourlyRate") {
            const numericValue = Number(value);
            let errorMessage = "";

            if (numericValue < 0) {
                errorMessage = "The input value should be positive";
            } else {
                if (scale === "max") {
                    if (hourlyRate?.min && numericValue <= hourlyRate?.min) {
                        errorMessage = "Max should be greater than Min";
                    } else {
                        errorMessage = "";
                    }
                    setHourlyRate({ ...hourlyRate, max: numericValue });
                } else if (scale === "min") {
                    if (hourlyRate?.max && numericValue >= hourlyRate?.max) {
                        errorMessage = "Min shoud be lesser than Max";
                    } else {
                        errorMessage = "";
                    }
                    setHourlyRate({ ...hourlyRate, min: numericValue });
                }
            }
            setHourlyRateError(errorMessage);
        } else if (field === "startDate") {
            const numericValue = Number(value);
            let errorMessage = "";

            if (numericValue < 0) {
                errorMessage = "The input value should be positive";
            } else {
                if (scale === "max") {
                    if (startDate?.min && numericValue >= startDate?.min) {
                        errorMessage = "Max should be greater than Min";
                    } else {
                        errorMessage = "";
                    }
                    setStartDate({ ...startDate, max: numericValue });
                } else if (scale === "max") {
                    if (startDate?.max && numericValue >= startDate?.max) {
                        errorMessage = "Min shoud be lesser than Max";
                    } else {
                        errorMessage = "";
                    }
                    setStartDate({ ...startDate, min: numericValue });
                }
            }
            setStartDateError(errorMessage);
        } else if (field === "endDate") {
            const numericValue = Number(value);
            let errorMessage = "";

            if (numericValue < 0) {
                errorMessage = "The input value should be positive";
            } else {
                if (scale === "max") {
                    if (endDate?.min && numericValue >= endDate?.min) {
                        errorMessage = "Max should be greater than Min";
                    } else {
                        errorMessage = "";
                    }
                    setEndDate({ ...endDate, max: numericValue });
                } else if (scale === "max") {
                    if (endDate?.max && numericValue >= endDate?.max) {
                        errorMessage = "Min shoud be lesser than Max";
                    } else {
                        errorMessage = "";
                    }
                    setEndDate({ ...endDate, min: numericValue });
                }
            }
            setEndDateError(errorMessage);
        }
    };

    const handleDateChange = (type, range) => (event) => {
        const value = event.target.value;

        // Local date validation to ensure valid format
        const isValidDate = (date) => !isNaN(Date.parse(date));

        if (type === "startDate") {
            // Check if the value is a valid date
            if (!isValidDate(value)) {
                setStartDateError("Invalid start date");
                return;
            }

            // Validate against startDate's min and max
            if (range === "max") {
                if (startDate.min && new Date(value) < new Date(startDate.min)) {
                    setStartDateError(`Start date cannot be earlier than ${startDate.min}`);
                    return;
                } else {
                    setStartDateError("");
                }
                setStartDate({ ...startDate, max: value });
            }

            if (range === "min") {
                if (startDate.max && new Date(value) > new Date(startDate.max)) {
                    setStartDateError(`Start date cannot be later than ${startDate.max}`);
                    return;
                } else {
                    setStartDateError("");
                }
                setStartDate({ ...startDate, min: value });
            }

            // Validate against endDate to ensure startDate is not later than endDate
            // if (endDate. && new Date(value) > new Date(endDate.value)) {
            //     setStartDateError("Start date cannot be later than End date");
            // } else {
            //     setStartDateError(""); // Clear error if valid
            //     // setStartDateError({ ...startDate, value }); // Set the valid start date
            //     setStartDate({ ...startDate, min: value })
            // }
        }

        if (type === "endDate") {
            // Check if the value is a valid date
            if (!isValidDate(value)) {
                setEndDateError("Invalid end date");
                return;
            }

            // Validate against endDate's min and max
            if (range === "max") {
                if (endDate.min && new Date(value) < new Date(endDate.min)) {
                    setEndDateError(`End date cannot be earlier than ${endDate.min}`);
                    return;
                } else {
                    setEndDateError("");
                }
                setEndDate({...endDate, max: value});
            }

            if (range === "min") {
                if (endDate.max && new Date(value) > new Date(endDate.max)) {
                    setEndDateError(`End date cannot be later than ${endDate.max}`);
                    return;
                } else {
                    setEndDateError("");
                }
                setEndDate({...endDate, min: value});
            }

            // Validate against startDate to ensure endDate is not earlier than startDate
            // if (startDate.value && new Date(value) < new Date(startDate.value)) {
            //     setEndDateError("End date cannot be earlier than Start date");
            // } else {
            //     setEndDateError(""); // Clear error if valid
            //     // setEndDateError({ ...endDate, value }); // Set the valid end date
            // }
        }
    };

    return (
        <Drawer anchor="left" open={open} onClose={handleClose} variant="persistent" sx={styles.drawerPaper}>
            <Box sx={styles.drawerContainer}>
                <Box sx={styles.header}>
                    <Typography sx={styles.title}>
                        Wages Filter
                    </Typography>
                </Box>
                <Box sx={styles.accordion}>
                    <Accordion expanded={false} sx={{ height: "100%", overflow: 'auto', backgroundColor: 'transparent', '&:hover': { backgroundColor: "#FFFFFF" }, boxShadow: "none", borderRadius: "20px" }}>
                        <AccordionDetails sx={styles.accordionDetails}>
                            <Box>
                                {employeeFilterFields.filter(field => field.toLowerCase().includes(searchTerm))
                                    .map((field, index) => (
                                        <Box key={index}>
                                            <FormControlLabel control={
                                                <Checkbox checked={
                                                    field === "Annual Salary" ? showAnnualSalary :
                                                        field === "Hourly Rate" ? showHourlyRate :
                                                            field === "Start Date" ? showStartDate :
                                                                field === "End Date" ? showEndDate : false
                                                }
                                                    onChange={(e) => {
                                                        if (field === "Annual Salary") {
                                                            setShowAnnualSalary(e.target.checked);
                                                        } else if (field === "Hourly Rate") {
                                                            setShowHourlyRate(e.target.checked);
                                                        } else if (field === "Start Date") {
                                                            setShowStartDate(e.target.checked);
                                                        } else if (field === "End Date") {
                                                            setShowEndDate(e.target.checked);
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

                                            {field === "Annual Salary" && (
                                                <Collapse in={showAnnualSalary}>
                                                    <MinMaxFilter minName={"min"} maxName={"max"} minValue={annualSalary?.min} maxValue={annualSalary?.max} handleFilterChange={handleFilterChange} minPlaceholder={"Min Value"} maxPlaceholder={"Max Value"} positiveNumberError={annualSalaryError} field={"AnnualSalary"} />
                                                </Collapse>
                                            )}
                                            {field === "Hourly Rate" && (
                                                <Collapse in={showHourlyRate}>
                                                    <MinMaxFilter minName={"min"} maxName={"max"} minValue={hourlyRate?.min} maxValue={hourlyRate?.max} handleFilterChange={handleFilterChange} minPlaceholder={"Min Value"} maxPlaceholder={"Max Value"} positiveNumberError={hourlyRateError} field={"hourlyRate"} />
                                                </Collapse>
                                            )}
                                            {field === "Start Date" && (
                                                <Collapse in={showStartDate}>
                                                    <DateFilterComponent sentStartDate={startDate?.min} sentEndDate={startDate?.max} handleDateChange={handleDateChange} startLabel="startDate" endLabel="startDate" dateError={startDateError} />
                                                </Collapse>
                                            )}
                                            {field === "End Date" && (
                                                <Collapse in={showEndDate}>
                                                    <DateFilterComponent sentStartDate={endDate?.min} sentEndDate={endDate?.max} handleDateChange={handleDateChange} startLabel="endDate" endLabel="endDate" dateError={endDateError} />
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
        </Drawer>
    )
};

export default ContactWagesFilterModal;