import {
    Box,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    FormControlLabel,
    Checkbox,
    Collapse,
    Typography,
    TextField,
    Drawer,
    IconButton,
    InputBase,
    InputAdornment,
    Snackbar,
    Alert,
    Switch
} from "@mui/material";
import { useState, useEffect, useContext } from "react";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import { BaseURL } from "../../constants/Baseurl";
import { ClientContext } from "../../context/ClientContext";
import LocationFilter from "../FilterComponents/LocationFilter";
import EmailsFilter from "../FilterComponents/EmailsFilter"
import { Authorization_header } from "../../utils/helper/Constant";
import CancelIcon from "@mui/icons-material/Cancel";
import ActionButton from "../FilterComponents/ActionButton";
import PhonesFilter from "../FilterComponents/PhonesFilters";
import PrimaryContactsFilter from "../FilterComponents/PrimaryContactsFilter";
import CompanySelector from "../FilterComponents/CompanySelector";
import { FilterListContext } from "../../context/FiltersListContext";


const styles = {
    drawerPaper: {
        "& .MuiDrawer-paper": {
            // borderRadius: "20px",
            height: "72.5%",
            display: "flex",
            flexDirection: "column",
            marginTop: "12.5rem",
            marginLeft: "20px",
            borderBottom: "1px solid #E4E4E4",
            borderTopLeftRadius: "20px",
            borderTopRightRadius: "20px",
            borderLeft: "1px solid #E4E4E4",
            overflow: "hidden", // Prevent the entire drawer from scrolling
        },
    },
    drawerContainer: {
        display: "flex",
        flexDirection: "column",
        // flex: 10,
        marginTop: "-0%",
        flex: 1, // Take up remaining space
        overflow: "hidden", // Hide overflow
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
        backgroundColor: "#ececec",
        top: 0, // Stick to the top
        zIndex: 1, // Ensure it stays above other content
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

function AccountFilters({ handleClose, open, onApplyFilters }) {
    const { clientFilters, setClientFilters, clearClientFilterTrigger, setIsClientFilterApplied, fetchClientData,
        triggerClientClearFilters, } = useContext(ClientContext);
    const { clientList } = useContext(FilterListContext);
    const [company, setCompany] = useState(clientFilters.company);
    const [showCompany, setShowCompany] = useState(false);
    const [billingCountry, setBillingCountry] = useState(clientFilters.billingCountry || []);
    const [emails, setEmails] = useState(clientFilters.emails || []);
    const [phones, setPhones] = useState(clientFilters.phones || []);
    const [primaryContacts, setPrimaryContacts] = useState(clientFilters.primaryContacts || []);
    const [billingCountryList, setBillingCountryList] = useState([]);
    const [showBillingCountry, setShowBillingCountry] = useState(false);
    const [emailsList, setEmailsList] = useState([]);
    const [showEmails, setShowEmails] = useState(false);
    const [primaryContactsList, setPrimaryContactsList] = useState([]);
    const [showPrimaryContacts, setShowPrimaryContacts] = useState(false);
    const [phonesList, setPhonesList] = useState([]);
    const [showPhones, setShowPhones] = useState(false);
    const [showProjectsCount, setShowProjectsCount] = useState(false);
    const [showTotalProjectCost, setShowTotalProjectCost] = useState(false);
    const [showRnDCost, setShowRnDCost] = useState(false);
    const [isAccordionOpen, setIsAccordionOpen] = useState(false);
    const [projectsCountError, setProjectsCountError] = useState('');
    const [positiveNumberError, setPositiveNumberError] = useState('');
    const [sendInteractions, setSendInteraction] = useState(0);
    const [showAutoSendInteraction, setShowAutoSendInteraction] = useState(false);
    const [isSendInteractionApplied, setIsSendInteractionApplied] = useState(false);
    const handleAutoSendToggle = () => {
        setSendInteraction(prev => (prev === 0 ? 1 : 0));
        setIsSendInteractionApplied(true);
    };
    const [searchTerm, setSearchTerm] = useState('');
    const filterFields = [
        { label: 'Account' },
        { label: 'Billing Country' },
        { label: 'Email Address' },
        { label: 'Phone' },
        { label: 'Auto Send Interaction' },
        { label: 'Primary Contacts' },
        { label: 'No. Of Projects' },
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
    const handleFilterChange = ({ field, scale }) => (event, newValue) => {
        const value = newValue ?? event.target.value;

        if (value < 0) {
            setPositiveNumberError("Only positive num.");
        } else {
            setPositiveNumberError("");
        }

        setClientFilters((prev) => {
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
    useEffect(() => {
        setClientFilters(prev => ({
            ...prev,
            companyId: [
                clientList?.find((client) => client?.companyName === company)?.companyId,
            ],
            company,
        }));
    }, [company, clientList]);

    useEffect(() => {
        setClientFilters(prev => ({
            ...prev,
            billingCountry,
            countryId: [
                billingCountryList?.find((proj) => proj?.countryName === billingCountry)?.countryId,
            ],
            company,
        }));
    }, [company, billingCountry]);
    useEffect(() => {
        setClientFilters(prev => ({
            ...prev,
            emails,
            countryId: [
                emailsList?.find((proj) => proj?.countryName === emails)?.countryId,
            ],
            company,
        }));
    }, [company, emails]);
    useEffect(() => {
        setClientFilters(prev => ({
            ...prev,
            phones,
            countryId: [
                phonesList?.find((proj) => proj?.countryName === phones)?.countryId,
            ],
            company,
        }));
    }, [company, phones]);
    useEffect(() => {
        setClientFilters(prev => ({
            ...prev,
            primaryContacts,
            countryId: [
                primaryContactsList?.find((proj) => proj?.countryName === primaryContacts)?.countryId,
            ],
            company,
        }));
    }, [company, primaryContacts]);

    useEffect(() => {
        setClientFilters(prev => ({
            ...prev,
            projectsCount: [0, null],
            billingCountry: [],
            emails: [],
            phones: [],
            primaryContacts: [],
            totalProjectCost: [0, null],
            totalRnDCost: [0, null],
        }));
    }, []);

    // const fetchBillingCountryList = async () => {
    //     let url;
    //     if (clientFilters.companyId) {
    //         url = `${BaseURL}/api/v1/company/${localStorage.getItem("userid")}/get-companys-filter-values?companyIds=${JSON.stringify(clientFilters.companyId)}`;
    //     } else {
    //         url = `${BaseURL}/api/v1/company/${localStorage.getItem("userid")}/get-companys-filter-values`;
    //     }

    //     try {
    //         const response = await axios.get(url, Authorization_header());
    //         setCompany(response?.data?.data?.companyIds || []);
    //         setBillingCountryList(response?.data?.data?.billingCountries);
    //         setEmailsList(response?.data?.data?.emails);
    //         setPhonesList(response?.data?.data?.phones);
    //         setPrimaryContactsList(response?.data?.data?.primaryContacts);
    //     } catch (error) {
    //         console.error(error);
    //     }
    // };

    const fetchBillingCountryList = async () => {
        try {
            const url = `${BaseURL}/api/v1/company/${localStorage.getItem("userid")}/get-companys-filter-values`;
            const response = await axios.get(url, Authorization_header());
            const data = response?.data?.data || {};
            setCompany(data?.companyIds || []);
            setBillingCountryList(data?.billingCountries || []);
            setEmailsList(data?.emails || []);
            setPhonesList(data?.phones || []);
            setPrimaryContactsList(data?.primaryContacts || []);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchBillingCountryList();
    }, [clientFilters.companyIds]);

    useEffect(() => {
        if (clearClientFilterTrigger) {
            setCompany([]);
            setBillingCountry([]);
            setEmails([]);
            setPhones([]);
            setPrimaryContacts([]);
            setCompany("");
            setClientFilters({
                ...clientFilters,
                companyId: [],
                company: [],
                projectsCount: [0, null],
                billingCountry: [],
                emails: [],
                phones: [],
                primaryContacts: [],
                totalProjectCost: [0, null],
                totalRnDCost: [0, null],
            });
            setShowCompany(false);
            setShowEmails(false);
            setShowPhones(false);
            setShowPrimaryContacts(false);
            setShowBillingCountry(false);
            setShowProjectsCount(false);
            setShowTotalProjectCost(false);
            setShowRnDCost(false);
            setShowAutoSendInteraction(false);
        }
    }, [clearClientFilterTrigger]);
    let clientOptions;
    useEffect(() => {
        const shouldFetchWithFiltersClient =
            clientFilters.companyIds?.length > 0 ||
            clientFilters.billingCountry?.length > 0 ||
            clientFilters.emails?.length > 0 ||
            clientFilters.phones?.length > 0 ||
            clientFilters.primaryContacts?.length > 0 ||
            clientFilters.projectsCount?.length > 0 ||
            clientFilters.totalProjectCost?.length > 0 ||
            clientFilters.totalRnDCost?.length > 0;
        if (shouldFetchWithFiltersClient) {
            clientOptions = {
                ...(clientFilters.companyId?.length > 0 && {
                    company: clientFilters.companyId,
                }),
                ...(clientFilters.billingCountry && {
                    billingCountry: clientFilters.billingCountry,
                }),
                ...(clientFilters.emails && {
                    emails: clientFilters.emails,
                }),
                ...(clientFilters.phones && {
                    phones: clientFilters.phones,
                }),
                ...(clientFilters.primaryContacts && {
                    primaryContacts: clientFilters.primaryContacts,
                }),
                ...(clientFilters.projectsCount && {
                    minProjectsCount: clientFilters.projectsCount[0],
                }),
                ...(clientFilters.projectsCount && {
                    maxProjectsCount: clientFilters.projectsCount[1],
                }),
                ...(clientFilters.totalProjectCost && {
                    minTotalExpense: clientFilters.totalProjectCost[0],
                }),
                ...(clientFilters.totalProjectCost && {
                    maxTotalExpense: clientFilters.totalProjectCost[1],
                }),
                ...(clientFilters.totalRnDCost && {
                    minTotalRnDExpense: clientFilters.totalRnDCost[0],
                }),
                ...(clientFilters.totalRnDCost && {
                    maxTotalRnDExpense: clientFilters.totalRnDCost[1],
                }),
            };
        }
    }, [clientFilters]);
    const clearFilters = () => {
        setCompany([]);
        setBillingCountry([]);
        setEmails([]);
        setPhones([]);
        setPrimaryContacts([]);
        setSearchTerm('');
        setSendInteraction(0);
        setIsSendInteractionApplied();
        setClientFilters({
            ...clientFilters,
            companyId: [],
            company: [],
            billingCountry: [],
            phones: [],
            primaryContacts: [],
            projectsCount: [0, null],
            totalProjectCost: [0, null],
            totalRnDCost: [0, null],
        });
        setPositiveNumberError('');
        setProjectsCountError('');
        onApplyFilters({});
        triggerClientClearFilters();
        setIsClientFilterApplied(false);
    };
    const applyFilters = () => {
        const filters = {
            ...(company.length > 0 && { companyId: company.map(c => c.companyId) }),
            ...(isSendInteractionApplied && { sendInteractions }),
            ...(billingCountry.length > 0 && { billingCountry }),
            ...(emails.length > 0 && { emails }),
            ...(phones.length > 0 && { phones }),
            ...(primaryContacts.length > 0 && { primaryContacts }),
            ...(clientFilters.projectsCount && {
                minProjectsCount: clientFilters.projectsCount[0],
            }),
            ...(clientFilters.projectsCount && {
                maxProjectsCount: clientFilters.projectsCount[1],
            }),
            ...(clientFilters.totalProjectCost && {
                minTotalExpense: clientFilters.totalProjectCost[0],
            }),
            ...(clientFilters.totalProjectCost && {
                maxTotalExpense: clientFilters.totalProjectCost[1],
            }),
            ...(clientFilters.totalRnDCost && {
                minTotalRnDExpense: clientFilters.totalRnDCost[0],
            }),
            ...(clientFilters.totalRnDCost && {
                maxTotalRnDExpense: clientFilters.totalRnDCost[1],
            }),
        };

        fetchClientData(filters);
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
                        {/* {page === "company" ? "Account" : page} */}
                        Account Filter
                    </Typography>
                    {/* <IconButton onClick={handleClose} sx={styles.closeButton}>
                        <CancelIcon />
                    </IconButton> */}
                </Box>
                <Box>
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
                                                                field.label === "Account"
                                                                    ? showCompany
                                                                    : field.label === "Auto Send Interaction"
                                                                        ? showAutoSendInteraction
                                                                        : field.label === "Billing Country"
                                                                            ? showBillingCountry
                                                                            : field.label === "Email Address"
                                                                                ? showEmails
                                                                                : field.label === "Phone"
                                                                                    ? showPhones
                                                                                    : field.label === "Primary Contacts"
                                                                                        ? showPrimaryContacts
                                                                                        : field.label === "No. Of Projects"
                                                                                            ? showProjectsCount
                                                                                            : field.label === "Total Expense"
                                                                                                ? showTotalProjectCost
                                                                                                : field.label === "QRE Expense"
                                                                                                    ? showRnDCost
                                                                                                    : false
                                                            }
                                                            onChange={(e) => {
                                                                if (field.label === "Account") {
                                                                    if (e.target.checked) {
                                                                        setShowCompany(true);
                                                                    } else {
                                                                        setShowCompany(false);
                                                                        setCompany([]);
                                                                    }
                                                                } else if (field.label === "Auto Send Interaction") {
                                                                    if (e.target.checked) {
                                                                        setShowAutoSendInteraction(true);
                                                                    } else {
                                                                        setShowAutoSendInteraction(false);
                                                                        setSendInteraction([]);
                                                                    }
                                                                } else if (field.label === "Billing Country") {
                                                                    if (e.target.checked) {
                                                                        setShowBillingCountry(true);
                                                                    } else {
                                                                        setShowBillingCountry(false);
                                                                        setBillingCountry([]);
                                                                    }
                                                                } else if (field.label === "Email Address") {
                                                                    if (e.target.checked) {
                                                                        setShowEmails(true);
                                                                    } else {
                                                                        setShowEmails(false);
                                                                        setEmails([]);
                                                                    }
                                                                } else if (field.label === "Phone") {
                                                                    if (e.target.checked) {
                                                                        setShowPhones(true);
                                                                    } else {
                                                                        setShowPhones(false);
                                                                        setPhones([]);
                                                                    }
                                                                } else if (field.label === "Primary Contacts") {
                                                                    if (e.target.checked) {
                                                                        setShowPrimaryContacts(true);
                                                                    } else {
                                                                        setShowPrimaryContacts(false);
                                                                        setPrimaryContacts([]);
                                                                    }
                                                                } else if (field.label === "No. Of Projects") {
                                                                    if (e.target.checked) {
                                                                        setShowProjectsCount(true);
                                                                    } else {
                                                                        setShowProjectsCount(false);
                                                                        setClientFilters(prev => ({
                                                                            ...prev,
                                                                            projectsCount: [0, null],
                                                                        }));
                                                                    }
                                                                } else if (field.label === "Total Expense") {
                                                                    if (e.target.checked) {
                                                                        setShowTotalProjectCost(true);
                                                                    } else {
                                                                        setShowTotalProjectCost(false);
                                                                        setClientFilters(prev => ({
                                                                            ...prev,
                                                                            totalProjectCost: [0, null],
                                                                        }));
                                                                    }
                                                                } else if (field.label === "QRE Expense") {
                                                                    if (e.target.checked) {
                                                                        setShowRnDCost(true);
                                                                    } else {
                                                                        setShowRnDCost(false);
                                                                        setClientFilters(prev => ({
                                                                            ...prev,
                                                                            totalRnDCost: [0, null],
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

                                                        {field.label === "Auto Send Interaction" && (
                                                            <Collapse in={showAutoSendInteraction}>
                                                                <div style={{ marginTop: '2.5rem', marginRight: '-9rem', marginLeft: "35px", marginBottom: "-15px" }}>
                                                                    <span style={{ fontSize: '0.9rem' }}>Off</span>
                                                                    <Switch
                                                                        checked={sendInteractions === 1}
                                                                        onChange={handleAutoSendToggle}
                                                                        sx={{
                                                                            "& .MuiSwitch-track": {
                                                                                backgroundColor: sendInteractions === 1 ? "#FD5707" : "#cccccc",
                                                                            },
                                                                            "& .MuiSwitch-thumb": {
                                                                                backgroundColor: sendInteractions === 1 ? "#FD5707" : "#ffffff",
                                                                            },
                                                                            "& .MuiSwitch-switchBase.Mui-checked": {
                                                                                color: "#FD5707",
                                                                            },
                                                                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                                                                backgroundColor: "#FD5707",
                                                                            },
                                                                        }}
                                                                    />
                                                                    <span style={{ fontSize: "0.9rem" }}>On</span>
                                                                </div>
                                                            </Collapse>
                                                        )}
                                                    </>
                                                }
                                                label={field.label}
                                            />
                                            {field.label === 'Account' && (
                                                <Collapse in={showCompany}>
                                                    <CompanySelector company={company} clientList={clientList} setCompany={setCompany} />
                                                </Collapse>
                                            )}
                                            {field.label === 'Billing Country' && (
                                                <Collapse in={showBillingCountry}>
                                                    <LocationFilter
                                                        billingCountry={billingCountry}
                                                        billingCountryList={billingCountryList}
                                                        setBillingCountry={setBillingCountry}
                                                    />

                                                </Collapse>
                                            )}
                                            {field.label === 'Email Address' && (
                                                <Collapse in={showEmails}>
                                                    <EmailsFilter
                                                        emails={emails}
                                                        emailsList={emailsList}
                                                        setEmails={setEmails}
                                                    />
                                                </Collapse>
                                            )}
                                            {field.label === 'Phone' && (
                                                <Collapse in={showPhones}>
                                                    <PhonesFilter
                                                        phones={phones}
                                                        phonesList={phonesList}
                                                        setPhones={setPhones}
                                                    />
                                                </Collapse>
                                            )}
                                            {field.label === 'Primary Contacts' && (
                                                <Collapse in={showPrimaryContacts}>
                                                    <PrimaryContactsFilter
                                                        primaryContacts={primaryContacts}
                                                        primaryContactsList={primaryContactsList}
                                                        setPrimaryContacts={setPrimaryContacts}
                                                    />

                                                </Collapse>
                                            )}
                                            {field.label === 'No. Of Projects' && (
                                                <Collapse in={showProjectsCount}>
                                                    {/* <Box display="flex" flexDirection="column" gap={3}> */}
                                                    <Box display="flex" gap={3}>
                                                        <TextField
                                                            name="min"
                                                            type="number"
                                                            value={clientFilters.projectsCount[0] || ''}
                                                            onChange={handleFilterChange({ field: "projectsCount", scale: "min" })}
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
                                                                sx: { textAlign: 'left', padding: 0, margin: 0, fontSize: '0.8rem', color: 'red' }, // Align to the leftmost, no padding or margin
                                                            }}
                                                            sx={{ padding: '0px' }}
                                                        />
                                                        <TextField
                                                            name="max"
                                                            type="number"
                                                            value={clientFilters.projectsCount[1] || ''}
                                                            onChange={handleFilterChange({ field: "projectsCount", scale: "max" })}
                                                            fullWidth
                                                            placeholder="Max Value"
                                                            sx={{ marginRight: "10px" }}
                                                            InputProps={{
                                                                sx: styles.textField,
                                                            }}
                                                        // error={!!positiveNumberError}
                                                        // helperText={positiveNumberError || ""}
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
                                                <Collapse in={showTotalProjectCost}>
                                                    <Box display="flex" gap={3}>
                                                        <TextField
                                                            name="min"
                                                            type="number"
                                                            value={clientFilters.totalProjectCost[0] || ''}
                                                            onChange={handleFilterChange({ field: "totalProjectCost", scale: "min" })}
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
                                                                sx: { textAlign: 'left', padding: 0, margin: 0, fontSize: '0.8rem', color: 'red' }, // Align to the leftmost, no padding or margin
                                                            }}
                                                            sx={{ padding: '0px' }}
                                                        />
                                                        <TextField
                                                            name="max"
                                                            type="number"
                                                            value={clientFilters.totalProjectCost[1] || ''}
                                                            onChange={handleFilterChange({ field: "totalProjectCost", scale: "max" })}
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
                                            {field.label === 'QRE Expense' && (
                                                <Collapse in={showRnDCost}>
                                                    <Box display="flex" gap={3}>
                                                        <TextField
                                                            name="min"
                                                            type="number"
                                                            value={clientFilters.totalRnDCost[0] || ''}
                                                            onChange={handleFilterChange({ field: "totalRnDCost", scale: "min" })}
                                                            placeholder="Min Value"
                                                            fullWidth
                                                            InputProps={{
                                                                sx: styles.textField,
                                                            }}
                                                            error={!!positiveNumberError}
                                                            helperText={positiveNumberError || ""}
                                                            FormHelperTextProps={{
                                                                sx: { textAlign: 'left', padding: 0, margin: 0, fontSize: '0.8rem', color: 'red' }, // Align to the leftmost, no padding or margin
                                                            }}
                                                            sx={{ padding: '0px' }}
                                                        />
                                                        <TextField
                                                            name="max"
                                                            type="number"
                                                            value={clientFilters.totalRnDCost[1] || ''}
                                                            onChange={handleFilterChange({ field: "totalRnDCost", scale: "max" })}
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
                    {/* <ActionButton
              label="Cancel"
              color="#9F9F9F"
              onClick={handleClose}
            /> */}
                    <ActionButton
                        label="Apply"
                        color={styles.applyButton.color}
                        onClick={applyFilters} // Updated to use applyFilters
                    />
                </Box>
            </Box>
        </Drawer>
    );
}

export default AccountFilters;



