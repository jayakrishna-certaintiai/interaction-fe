import { Accordion, AccordionDetails, Box, Checkbox, Collapse, Drawer, FormControlLabel, Typography } from "@mui/material";
import ActionButton from "../FilterComponents/ActionButton";
import { useEffect, useState } from "react";
import { BaseURL } from "../../constants/Baseurl";
import { Authorization_header } from "../../utils/helper/Constant";
import axios from "axios";
import PrimaryContactsFilter from "../FilterComponents/PrimaryContactsFilter";
import MinMaxFilter from "../FilterComponents/MinMaxFilter";


const styles = {
    drawerPaper: {
        "& .MuiDrawer-paper": {
            height: "auto",
            maxHeight: "40%",
            display: "flex",
            flexDirection: "column",
            marginTop: "22.7rem",
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

const employeeFilterFields = ["Project Names", "Project ID", "SPOC Name", "Total Expense", "QRE Expense", "QRE Potential"];

const CompanyProjectFilterModal = ({ open, handleClose, companyId, getFilterParams, setSelectedProjectNames, setSetelectedProjectId, setSelectedSpocName, setSelectedTotalExpense, setSelectedRnDExpense, setSelectedRnDPotential, selectedProjectNames, selectedProjectId, selectedFiscalYear, selectedSpocName, selectedTotalExpense, selectedRnDExpense, selectedRnDPotential, applyFilters, clearFilters }) => {
    const [filterFields, setFilterFields] = useState([]);
    const [filterFieldNames, setFilterFieldName] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showProjectNames, setShowProjectNames] = useState(false);
    const [showProjectId, setShowProjectId] = useState(false);
    const [showSPOCName, setShowSPOCName] = useState(false);
    const [showTotalExpense, setShowTotalExpense] = useState(false);
    const [showRnDPotential, setShowRnDPotential] = useState(false);
    const [showRnDExpense, setShowRnDExpense] = useState(false);
    const [positiveNumberError, setPositiveNumberError] = useState('');
    const [rndPositiveNumberError, setRndPositiveNumberError] = useState('');
    const [rndPotentialPositiveNumberError, setRndPotentialPositiveNumberError] = useState('');

    const getProjectsFilterFields = async () => {
        const url = `${BaseURL}/api/v1/projects/get-projects-filter-values`;
        const payload = { headers: Authorization_header().headers, params: { companyId: companyId } };
        const response = await axios.get(url, payload);
        setFilterFields(response?.data?.data);
    };

    useEffect(() => {
        getProjectsFilterFields();
    }, [])

    const handleFilterChange = ({ field, scale, value }) => {
        if (field === "totalExpense") {
            const numericValue = Number(value);
            let errorMessage = "";

            if (numericValue < 0) {
                errorMessage = "The input value should be positive";
            } else {
                if (scale === "max") {
                    if (selectedTotalExpense?.min && numericValue <= selectedTotalExpense.min) {
                        errorMessage = "The max value of Total Expense should be greater than the min value of Total Expense";
                    } else {
                        errorMessage = "";
                    }
                    setSelectedTotalExpense({ ...selectedTotalExpense, max: numericValue });
                } else if (scale === "min") {
                    if (selectedTotalExpense?.max && numericValue >= selectedTotalExpense.max) {
                        errorMessage = "The min value of Total Expense should be less than the max value of Total Expense";
                    } else {
                        errorMessage = "";
                    }
                    setSelectedTotalExpense({ ...selectedTotalExpense, min: numericValue });
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
        } else if (field === "rndPotential") {
            const numericValue = Number(value);
            let errorMessage = "";

            if (numericValue < 0) {
                errorMessage = "The input value should be positive";
            } else {
                if (scale === "max") {
                    if (selectedRnDPotential?.min && numericValue <= selectedRnDPotential.min) {
                        errorMessage = "The max value of RnD Potential should be greater than the min value of RnD Potential";
                    } else {
                        errorMessage = "";
                    }
                    setSelectedRnDPotential({ ...selectedRnDPotential, max: numericValue });
                } else if (scale === "min") {
                    if (selectedRnDExpense?.max && numericValue >= selectedRnDExpense.max) {
                        errorMessage = "The min value of RnD Potential should be less than the max value of RnD Potential"
                    } else {
                        errorMessage = "";
                    }
                    setSelectedRnDPotential({ ...selectedRnDPotential, min: numericValue });
                }
            }
            setRndPotentialPositiveNumberError(errorMessage);
        }
    };



    useEffect(() => {
        const params = {};
        if (selectedProjectNames.length) {
            params.projectNames = selectedProjectNames;
        } if (selectedProjectId.length) {
            params.projectIds = selectedProjectId;
        } if (selectedSpocName.length) {
            params.spocNames = selectedSpocName;
        } if (selectedTotalExpense?.min) {
            params.minTotalExpense = selectedTotalExpense?.min;
        } if (selectedTotalExpense?.max) {
            params.maxTotalExpense = selectedTotalExpense?.max;
        } if (selectedRnDExpense?.min) {
            params.minRnDExpense = selectedRnDExpense?.min;
        } if (selectedRnDExpense?.max) {
            params.maxRnDExpense = selectedRnDExpense?.max;
        } if (selectedRnDPotential?.min) {
            params.minRnDPotential = selectedRnDPotential?.min;
        } if (selectedRnDPotential?.max) {
            params.maxRnDPotential = selectedRnDPotential?.max;
        }
        getFilterParams({ params });
    }, [selectedProjectNames, selectedProjectId, selectedFiscalYear, selectedSpocName, selectedTotalExpense, selectedRnDExpense, selectedRnDPotential])

    useEffect(() => {
        setFilterFieldName(Object.values(filterFields));
    }, [filterFields])

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
                                {employeeFilterFields.filter(field => field.toLowerCase().includes(searchTerm.toLowerCase()))
                                    .map((field, index) => (
                                        <Box key={index}>
                                            <FormControlLabel control={
                                                <Checkbox checked={
                                                    field === "Project Names" ? showProjectNames :
                                                        field === "Project ID" ? showProjectId :
                                                            field === "SPOC Name" ? showSPOCName :
                                                                field === "Total Expense" ? showTotalExpense :
                                                                    field === "QRE Expense" ? showRnDExpense :
                                                                        field === "QRE Potential" ? showRnDPotential : false
                                                }
                                                    onChange={(e) => {
                                                        if (field === "Project Names") {
                                                            setShowProjectNames(e.target.checked);
                                                        } else if (field === "Project ID") {
                                                            setShowProjectId(e.target.checked);
                                                        } else if (field === "SPOC Name") {
                                                            setShowSPOCName(e.target.checked);
                                                        } else if (field === "Total Expense") {
                                                            setShowTotalExpense(e.target.checked);
                                                        } else if (field === "QRE Expense") {
                                                            setShowRnDExpense(e.target.checked);
                                                        } else if (field === "QRE Potential") {
                                                            setShowRnDPotential(e.target.checked);
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

                                            {field === "Project Names" && (
                                                <Collapse in={showProjectNames}>
                                                    {filterFields && filterFields?.projectNames && Array.isArray(filterFields?.projectNames) && <PrimaryContactsFilter primaryContactsList={filterFields?.projectNames} primaryContacts={selectedProjectNames} setPrimaryContacts={setSelectedProjectNames} />}
                                                </Collapse>
                                            )}
                                            {field === "Project ID" && (
                                                <Collapse in={showProjectId}>
                                                    {filterFields && filterFields?.projectCodes && Array.isArray(filterFields?.projectCodes) && <PrimaryContactsFilter primaryContactsList={filterFields?.projectCodes} primaryContacts={selectedProjectId} setPrimaryContacts={setSetelectedProjectId} />}
                                                </Collapse>
                                            )}
                                            {field === "SPOC Name" && (
                                                <Collapse in={showSPOCName}>
                                                    {filterFields && filterFields?.spocNames && Array?.isArray(filterFields?.spocNames) && <PrimaryContactsFilter primaryContactsList={filterFields?.spocNames} primaryContacts={selectedSpocName} setPrimaryContacts={setSelectedSpocName} />}
                                                </Collapse>
                                            )}
                                            {field === "Total Expense" && (
                                                <Collapse in={showTotalExpense}>
                                                    {/* {minName, maxName, type, minValue, maxValue, handleFilterChange, minPlaceholder, maxPlaceholder, positiveNumberError, field} */}
                                                    <MinMaxFilter minName={"min"} maxName={"max"} type={"number"} minValue={selectedTotalExpense?.min} maxValue={selectedTotalExpense?.max} handleFilterChange={handleFilterChange} minPlaceholder={"Min Value"} maxPlaceholder={"Max Value"} positiveNumberError={positiveNumberError} field={"totalExpense"} />
                                                    {/* <PrimaryContactsFilter primaryContactsList={filterFields?.totalExpense} primaryContacts={selectedTotalExpense} setPrimaryContacts={setSelectedTotalExpense} /> */}
                                                </Collapse>
                                            )}
                                            {field === "QRE Expense" && (
                                                <Collapse in={showRnDExpense}>
                                                    {/* <PrimaryContactsFilter primaryContactsList={filterFields?.emails} primaryContacts={selectedEmployeeEmail} setPrimaryContacts={setSelectedEmployeeEmail} /> */}
                                                    <MinMaxFilter minName={"min"} maxName={"max"} type={"number"} minValue={selectedRnDExpense?.min} maxValue={selectedRnDExpense?.max} handleFilterChange={handleFilterChange} minPlaceholder={"Min Value"} maxPlaceholder={"Max Value"} positiveNumberError={rndPositiveNumberError} field={"rndExpense"} />
                                                </Collapse>
                                            )}
                                            {field === "QRE Potential" && (
                                                <Collapse in={showRnDPotential}>
                                                    {/* <PrimaryContactsFilter primaryContactsList={filterFields?.emails} primaryContacts={selectedEmployeeEmail} setPrimaryContacts={setSelectedEmployeeEmail} /> */}
                                                    <MinMaxFilter minName={"min"} maxName={"max"} type={"number"} minValue={selectedRnDPotential?.min} maxValue={selectedRnDPotential?.max} handleFilterChange={handleFilterChange} minPlaceholder={"Min Value"} maxPlaceholder={"Max Value"} positiveNumberError={rndPotentialPositiveNumberError} field={"rndPotential"} />
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
}

export default CompanyProjectFilterModal;