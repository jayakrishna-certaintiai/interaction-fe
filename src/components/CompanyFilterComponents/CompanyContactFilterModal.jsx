import { Accordion, AccordionDetails, Box, Checkbox, Collapse, Drawer, FormControlLabel, Typography } from "@mui/material";
import ActionButton from "../FilterComponents/ActionButton";
import { useEffect, useState } from "react";
import { BaseURL } from "../../constants/Baseurl";
import { Authorization_header } from "../../utils/helper/Constant";
import axios from "axios";
import PrimaryContactsFilter from "../FilterComponents/PrimaryContactsFilter";


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

const employeeFilterFields = ["Employee Names", "Employee ID", "Employee Types", "Employee Titles", "Emails"];

const CompanyContactFilterModal = ({ open, handleClose, companyId, getFilterParams, setSelectedContactNames, setSelectedEmployeeId, setSelectedEmployeeEmail, setSelectedEmployeeTitle, setSelectedEmployementType, selectedContactNames, selectedEmployeeId, selectedEmployeeEmail, selectedEmployeeTitle, selectedEmployementType, applyFilters, clearFilters }) => {
    const [filterFields, setFilterFields] = useState([]);
    const [filterFieldNames, setFilterFieldName] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showEmployeeName, setShowEmployeeName] = useState(false);
    const [showEmployeeId, setShowEmployeeId] = useState(false);
    const [showEmployeeType, setShowEmployeeType] = useState(false);
    const [showEmployeeTitle, setShowEmployeeTitle] = useState(false);
    const [showEmployeeEmails, setShowEmployeeEmails] = useState(false);

    const getContactsFilterFields = async () => {
        
        const url = `${BaseURL}/api/v1/contacts/get-contacts-filter-values`;
        const payload = { headers: Authorization_header().headers, params: { companyId: companyId } };
        const response = await axios.get(url, payload);
        setFilterFields(response?.data?.data);
    };

    useEffect(() => {
        const params = {};
        if (selectedContactNames.length) {
            params.employeeNames = selectedContactNames;
        } if (selectedEmployeeEmail.length) {
            params.emails = selectedEmployeeEmail;
        } if (selectedEmployeeId.length) {
            params.companyIds = selectedEmployeeId;
        } if (selectedEmployeeTitle.length) {
            params.employeeTitles = selectedEmployeeTitle;
        } if (selectedEmployementType.length) {
            params.employementTypes = selectedEmployementType;
        }
        getFilterParams({params});
    }, [selectedContactNames, selectedEmployeeId, selectedEmployeeEmail, selectedEmployeeTitle, selectedEmployementType])

    useEffect(() => {
        getContactsFilterFields();
    }, [])
    useEffect(() => {
        setFilterFieldName(Object.values(filterFields));
    }, [filterFields])
   
    return (
        <Drawer anchor="left" open={open} onClose={handleClose} variant="persistent" sx={styles.drawerPaper}>
            <Box sx={styles.drawerContainer}>
                <Box sx={styles.header}>
                    <Typography sx={styles.title}>
                        Employee Filter
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
                                                    field === "Employee Names" ? showEmployeeName :
                                                        field === "Employee ID" ? showEmployeeId :
                                                            field === "Employee Types" ? showEmployeeType :
                                                                field === "Employee Titles" ? showEmployeeTitle :
                                                                    field === "Emails" ? showEmployeeEmails : false
                                                }
                                                    onChange={(e) => {
                                                        
                                                        if (field === "Employee Names") {
                                                            setShowEmployeeName(e.target.checked);
                                                        } else if (field === "Employee ID") {
                                                            setShowEmployeeId(e.target.checked);
                                                        } else if (field === "Employee Types") {
                                                            setShowEmployeeType(e.target.checked);
                                                        } else if (field === "Employee Titles") {
                                                            setShowEmployeeTitle(e.target.checked);
                                                        } else if (field === "Emails") {
                                                            setShowEmployeeEmails(e.target.checked);
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
                                           
                                            {field === "Employee Names" && (
                                                <Collapse in={showEmployeeName}>
                                                    <PrimaryContactsFilter primaryContactsList={filterFields?.employeeNames} primaryContacts={selectedContactNames} setPrimaryContacts={setSelectedContactNames} />
                                                </Collapse>
                                            )}
                                            {field === "Employee ID" && (
                                                <Collapse in={showEmployeeId}>
                                                    <PrimaryContactsFilter primaryContactsList={filterFields?.employeeIds} primaryContacts={selectedEmployeeId} setPrimaryContacts={setSelectedEmployeeId} />
                                                </Collapse>
                                            )}

                                            {field === "Employee Types" && (
                                                <Collapse in={showEmployeeType}>
                                                    <PrimaryContactsFilter primaryContactsList={filterFields?.employementTypes} primaryContacts={selectedEmployementType} setPrimaryContacts={setSelectedEmployementType} />
                                                </Collapse>
                                            )}
                                            {field === "Employee Titles" && (
                                                <Collapse in={showEmployeeTitle}>
                                                    <PrimaryContactsFilter primaryContactsList={filterFields?.employeeTitles} primaryContacts={selectedEmployeeTitle} setPrimaryContacts={setSelectedEmployeeTitle} />
                                                </Collapse>
                                            )}
                                            {field === "Emails" && (
                                                <Collapse in={showEmployeeEmails}>
                                                    <PrimaryContactsFilter primaryContactsList={filterFields?.emails} primaryContacts={selectedEmployeeEmail} setPrimaryContacts={setSelectedEmployeeEmail} />
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
}

export default CompanyContactFilterModal;