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
import axios from "axios";
import SearchIcon from "@mui/icons-material/Search";
import React, { useContext, useEffect, useState } from "react";
import { BaseURL } from "../../constants/Baseurl";
import ActionButton from "../FilterComponents/ActionButton";
import CompanySelector from "../FilterComponents/CompanySelector";
import { CaseContext } from "../../context/CaseContext";
import { Authorization_header } from "../../utils/helper/Constant";
import CountrySelect from "../Contacts/ContactModalDropdowns/CountrySelect";
import { FilterListContext } from "../../context/FiltersListContext";
import CancelIcon from "@mui/icons-material/Cancel";
import CaseOwnersSelect from "../FilterComponents/CaseOwnersSelect";
// import CaseOwnerSelecter from "./CaseOwnerSelector";


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

const locations = ["Canada", "USA", "United Kingdom"];
const CaseFilter = ({ clientData, getCaseSortParams, CaseSort, open, handleClose, onApplyFilters }) => {
    const {
        caseFilterState,
        setCaseFilterState,
        clearCaseFilterTrigger,
        setIsCaseFilterApplied,
        triggerCaseClearFilters,
        getAllCases,
    } = useContext(CaseContext);
    const { clientList } = useContext(FilterListContext);
    const [company, setCompany] = useState(caseFilterState.company);
    const [showCompany, setShowCompany] = useState(false);
    const [countryName, setCountryName] = useState(caseFilterState.countryName);
    const [countryNameList, setCountryNameList] = useState([]);
    const [showCountryName, setShowCountryName] = useState(false);
    const [caseOwners, setCaseOwners] = useState(caseFilterState.caseOwners);
    const [caseOwnersList, setCaseOwnersList] = useState([]);
    const [showCaseOwners, setShowCaseOwners] = useState(false);
    const [sortField, setSortField] = useState("");
    const [sortOrder, setSortOrder] = useState("");
    const [isExpanded, setIsExpanded] = useState(false);
    const [hasFetchedData, setHasFetchedData] = useState(false);
    const [isAccordionOpen, setIsAccordionOpen] = useState(false);
    const [projectsCountError, setProjectsCountError] = useState('');
    const [positiveNumberError, setPositiveNumberError] = useState('');

    const [searchTerm, setSearchTerm] = useState('');
    const filterFields = [
        { label: 'Account' },
        { label: 'Country Name' },
        { label: 'Case Owners' },
    ];

    const handleSearchInputChange = (event) => {
        const value = event.target.value.toLowerCase();
        setSearchTerm(value);
    };


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

    // const handleFilterChange = ({ field, scale }) => (event, newValue) => {
    //     const value = newValue ?? event.target.value;

    //     if (value < 0) {
    //         setPositiveNumberError("Only positive num.");
    //     } else {
    //         setPositiveNumberError("");
    //     }
    //     setCaseFilterState((prev) => {
    //         if (scale === "min" || scale === "max") {
    //             const updatedField = Array.isArray(prev[field]) ? [...prev[field]] : [];
    //             updatedField[scale === "min" ? 0 : 1] = value;

    //             // Validation for min and max
    //             const minValue = parseFloat(updatedField[0]);
    //             const maxValue = parseFloat(updatedField[1]);

    //             if (minValue && maxValue && minValue > maxValue) {
    //                 setProjectsCountError("Max should be greater than Min");
    //             } else {
    //                 setProjectsCountError('');
    //             }

    //             return {
    //                 ...prev,
    //                 [field]: updatedField
    //             };
    //         } else {
    //             return {
    //                 ...prev,
    //                 [field]: value
    //             };
    //         }
    //     });

    // };
    useEffect(() => {
        setCaseFilterState({
            ...caseFilterState,
            companyId: [
                clientData?.find((client) => client?.company === company)
                    ?.companyId,
            ],
            company: company,
        });
    }, [company]);

    useEffect(() => {
        setCaseFilterState({
            ...caseFilterState,
            sortField: sortField,
        })
    }, [sortField])

    useEffect(() => {
        setCaseFilterState({
            ...caseFilterState,
            sortOrder: sortOrder,
        })
    }, [sortOrder])

    useEffect(() => {
        setCaseFilterState({
            ...caseFilterState,
            countryName,
            countryId: [
                countryNameList?.find((proj) => proj?.countryName === countryName)?.countryId,
            ],
            company,
        });
    }, [countryName, countryName]);
    useEffect(() => {
        setCaseFilterState({
            ...caseFilterState,
            caseOwners,
            countryId: [
                caseOwnersList?.find((proj) => proj?.caseOwners === caseOwners)?.countryId,
            ],
            company,
        });
    }, [caseOwners]);

    const fetchData = async () => {
        try {
            const url = `${BaseURL}/api/v1/case/get-cases-filter-values`;
            const response = await axios.get(url, Authorization_header());
            const data = response?.data?.data || {};
            setCompany(data?.companyIds || []);
            setCountryNameList(data?.countryName || []);
            setCaseOwnersList(data?.caseOwners || []);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [caseFilterState?.companyIds]);

    useEffect(() => {
        if (clearCaseFilterTrigger) {
            setCompany("");
            setCountryName("");
            setCaseOwners([]);
            setCaseFilterState({
                ...caseFilterState,
                companyId: [],
                company: [],
                countryName: [],
                caseOwners: [],
            });
            setShowCompany(false);
            setShowCountryName(false);
            setShowCaseOwners(false);
            setIsCaseFilterApplied(false);
        }
    }, [clearCaseFilterTrigger]);

    const handleAccordionChange = (event, isExpanded) => {
        setIsExpanded(isExpanded);
        if (isExpanded && !hasFetchedData) {
            fetchData();
        }
    };

    const clearFilters = () => {
        setCompany([]);
        setCountryName([]);
        setCaseOwners([]);
        setSearchTerm('');
        setIsCaseFilterApplied({
            companyId: [],
            company: [],
            countryName: [],
            caseOwners: [],
        });
        setPositiveNumberError('');
        setProjectsCountError('');
        onApplyFilters({});
        triggerCaseClearFilters();
    };
    const applyFilters = () => {
        const companies = company.map(c => c.companyId);
        const filters = {
            ...(company.length > 0 && { companyId: company.map(c => c.companyId) }),
            ...(countryName?.length > 0 && { countryName }),
            ...(caseOwners?.length > 0 && { caseOwners }),
        };

        getAllCases(filters);
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
                        Case Filter
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
                                                                    : field.label === "Country Name"
                                                                        ? showCountryName
                                                                        : field.label === "Case Owners"
                                                                            ? showCaseOwners
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
                                                                } else if (field.label === "Country Name") {
                                                                    if (e.target.checked) {
                                                                        setShowCountryName(true);
                                                                    } else {
                                                                        setShowCountryName(false);
                                                                        setCountryName([]);
                                                                    }
                                                                } else if (field.label === "Case Owners") {
                                                                    if (e.target.checked) {
                                                                        setShowCaseOwners(true);
                                                                    } else {
                                                                        setShowCaseOwners(false);
                                                                        setCaseOwners([]);
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
                                            {field.label === 'Account' && (
                                                <Collapse in={showCompany}>
                                                    <CompanySelector
                                                        clientList={clientList}
                                                        company={company}
                                                        setCompany={setCompany}
                                                    />
                                                </Collapse>
                                            )}
                                            {field.label === 'Country Name' && (
                                                <Collapse in={showCountryName}>
                                                    <CountrySelect
                                                        countryName={countryName}
                                                        countryNameList={countryNameList}
                                                        setCountryName={setCountryName}
                                                    />
                                                </Collapse>
                                            )}
                                            {field.label === 'Case Owners' && (
                                                <Collapse in={showCaseOwners}>
                                                    <CaseOwnersSelect
                                                        caseOwners={caseOwners}
                                                        caseOwnersList={caseOwnersList}
                                                        setCaseOwners={setCaseOwners}
                                                    />
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

export default CaseFilter;