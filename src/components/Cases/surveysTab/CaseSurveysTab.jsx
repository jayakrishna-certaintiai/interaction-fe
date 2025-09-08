import React, { useContext, useEffect, useRef, useState } from "react";
import { Box, Button, CircularProgress, InputBase, InputAdornment, InputLabel, Table, TableContainer, TablePagination, Drawer, Badge, Tooltip } from "@mui/material";
import NewSurveysInteractionModal from "../../Common/NewSurveysInteractionModal";
import CaseSurveyListing from "./CaseSurveyListing";
import { BaseURL } from "../../../constants/Baseurl";
import axios from "axios";
import MiniTableHeader from "../../Common/MiniTableHeader";
import { CaseContext } from "../../../context/CaseContext";
import toast, { Toaster } from "react-hot-toast";
import SurveyInfoboxTable from "./SurveyInfoboxTable";
import SearchIcon from "@mui/icons-material/Search";
import { Authorization_header } from "../../../utils/helper/Constant";
import SpocIncludeProjectsModal from "../SpocIncludeProjectsModal";
import FormatDatetime from "../../../utils/helper/FormatDatetime";
import { HiFilter } from "react-icons/hi";
import { areFiltersApplied } from "../../../utils/helper/AreFiltersApplied";
import CaseSurveyFilters from "../../FilterComponents/CaseSurveyFilters";
import { TimesheetContext } from "../../../context/TimesheetContext";
import UploadModalForm from "./UploadModalForm";
import { Download, Edit, Send, UploadFile } from "@mui/icons-material";
import NavigationWithId from "../../Common/NavigationWithId";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import CaseSurveyDownload from "../../Common/CaseSurveyDownload";

const styles = {
    inputBase: {
        borderRadius: "20px",
        height: "40px",
        border: "1px solid #E4E4E4",
        pl: 1,
        width: "200px",
    },
    searchIconStyle: {
        color: "#9F9F9F",
        ml: "3px",
        mr: "-3px",
        width: "20px",
        height: "20px",
    },
    label: {
        color: "#404040",
        fontSize: "14px",
        fontWeight: 600,
        flexGrow: 1,
        mr: "-250px"
    },
    buttonStyle: {
        mr: 1,
        borderRadius: "20px",
        textTransform: "capitalize",
        backgroundColor: "#9F9F9F",
        "&:hover": { backgroundColor: "#9F9F9F" },
    },
    uploadBoxStyle: {
        border: "1px dashed #E4E4E4",
        borderWidth: "2px",
        ml: 2,
        mr: 2,
        borderRadius: "20px",
        height: "300px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
    },
    uploadButtonStyle: {
        borderRadius: "20px",
        textTransform: "capitalize",
        backgroundColor: "#00A398",
        "&:hover": { backgroundColor: "#00A398" },
        width: "7.1em",
        height: "2.3em"
    },
    uploadButtonStyle1: {
        backgroundColor: "#00A398",
        "&:hover": { backgroundColor: "#00A398" },
        minWidth: 'auto',
        padding: '0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: "2.2em",
        width: "2.2em",
        marginTop: "1px"
    },
    surveysMailModal: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    },
    iconStyle: { fontSize: "17px", marginRight: "3px" },
};

const styleConstants = {
    filterDownloadStyle: {
        color: "white",
        borderRadius: "50%",
        backgroundColor: "#00A398",
        fontSize: "28px",
        padding: "5px",
        marginRight: "16px",
        cursor: "pointer",
    },
    tableContainerStyle: {
        borderLeft: "1px solid #E4E4E4",
    },
    overlay: {
    },
    containerDimmed: {
    },
};

const tableData = {
    columns: [
        "Survey ID",
        "Project ID",
        "Project Name",
        "Project Code",
        "Response Type",
        "Status",
        "Sent Date",
        "Response Date",
        "Reminder Sent Date",
        "Age(Days)",
        "Sent By",
        "Sent To",
        "External Link",
        "Action"
    ],
    rows: [
        {
            id: 1,
            projectId: "",
            timesheet: "",
            month: "",
            rndHours: "",
            hourlyRate: "",
            rndExpense: "",
        },
    ],
};

const iconStyle = {
    fontSize: "30px",
    color: "#9F9F9F",
    mb: -2.5
};

const CaseSurvrysTab = ({ handleShowSurveyDetails, handleSelectedSurveyId, getReminderStatusId, company }) => {
    const {
        caseFilterState,
        filterCaseSurveysList,
        currentState,
    } = useContext(CaseContext);
    const [filteredSurvey, setFilteredSurvey] = React.useState([]);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [page, setPage] = React.useState(0);
    const [interactionOpen, setinteractionOpen] = React.useState(false);
    const [selectedEmail, setSelectedEmail] = React.useState("");
    const [openSurveyMailModal, setOpenSurveyMailModal] = React.useState(false);
    const [caseProjects, setCaseProjects] = useState([]);
    const { detailedCase } = useContext(CaseContext);
    const [caseSurveysList, setCaseSurveysList] = useState([]);
    const [code, setCode] = React.useState(null);
    const [loading, setLoading] = useState(false);
    const [caseSurveyDetails, setCaseSurveyDetails] = useState(null);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [search, setSearch] = useState("");
    const [showUpdateSpocModal, setShowUpdateSpocModal] = useState(false);
    const [unsentSurveyList, setUnsentSurveyList] = useState([]);
    const [spocUpdateList, setSpocUpdateList] = useState([]);
    const UpdatePurposeRef = useRef();
    const [purpose, setPurpose] = useState("");
    const [selectedSurveyType, setSelectedSurveyType] = useState("");
    const [surveySortParams, setSurveySortParams] = useState({ sortField: null, sortOrder: null });
    const [showUpdateSurveyModal, setShowUpdateSurveyModal] = useState(false);
    const [showUpdateDownloadModal, setShowUpdateDownloadModal] = useState(false);
    const [surveyData, setSurveyData] = useState([]);
    UpdatePurposeRef.current = "Surveys"

    const getSurveySortParams = ({ sortField, sortOrder }) => {
        switch (sortField) {
            case "Project Name":
                sortField = "projectName";
                break;
            case "Project ID":
                sortField = "projectId";
                break;
            case "Project Code":
                sortField = "projectCode";
                break;
            case "Survey ID":
                sortField = "surveyCode";
                break;
            case "Status":
                sortField = "status";
                break;
            case "Sent Date":
                sortField = "sentDate";
                break;
            case "Response Date":
                sortField = "responseDate";
                break;
            case "Age(Days)":
                sortField = "age";
                break;
            case "Sent By":
                sortField = "sentBy";
                break;
            case "Sent To":
                sortField = "sentTo";
                break;
            case "Reminder Sent Date":
                sortField = "lastUpdated";
                break;
            case "External Link":
                sortField = "privateUrl";
                break;
            case "Response Type":
                sortField = "responseType";
                break;
            default:
                sortField = null;
        }
        setSurveySortParams({ sortField: sortField, sortOrder: sortOrder });
    };
    const [filterClicked, setFilterClicked] = useState(false);
    // const [filterPanelOpen, setFilterPanelOpen] = useState(false);
    const [filterPanelOpen, setFilterPanelOpen] = useState(false);

    useEffect(() => {
        setCaseSurveysList(filterCaseSurveysList);
    }, [filterCaseSurveysList])

    useEffect(() => {
        document.body.style.overflow = filterPanelOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [filterPanelOpen]);

    const handleSelectedSurveyType = (value) => {
        setSelectedSurveyType(value);
    }

    UpdatePurposeRef.current = "Surveys"

    useEffect(() => {
        if (Array.isArray(caseSurveysList)) {

            const filteredData = caseSurveysList?.filter((_, index) => {
                return (index >= ((0) * rowsPerPage)) && (index <= (1 * (rowsPerPage - 1)));
            });

            setFilteredSurvey(filteredData)

        }
    }, [caseSurveysList, rowsPerPage])

    // useEffect(() => {
    //     if (Array.isArray(filterCaseSurveysList)) {

    //         const filteredData = filterCaseSurveysList?.filter((_, index) => {
    //             return (index >= ((0) * rowsPerPage)) && (index <= (1 * (rowsPerPage - 1)));
    //         });

    //         setFilteredSurvey(filteredData)
    //     }
    // }, [filterCaseSurveysList, rowsPerPage])

    const handleSurveysMailOpen = () => {
        setOpenSurveyMailModal(true);
    }



    useEffect(() => {

    }, [showUpdateSpocModal])


    useEffect(() => {

    }, [showUpdateSurveyModal])

    const handleChangePage = (event, newPage) => {
        const pageNum = Number(newPage);
        setPage(Number.isFinite(pageNum) ? pageNum : 0);
        if (Array.isArray(caseSurveysList)) {
            setFilteredSurvey(
                caseSurveysList.filter((_, index) =>
                    index >= pageNum * rowsPerPage && index < (pageNum + 1) * rowsPerPage
                )
            );
        }
        // if (Array.isArray(filterCaseSurveysList)) {
        //     setFilteredSurvey(filterCaseSurveysList?.filter((_, index) => {
        //         return (index >= ((newPage) * rowsPerPage)) && (index < ((newPage + 1) * rowsPerPage));
        //     }));
        // }
    };

    const handleChangeRowsPerPage = (event) => {
        const value = parseInt(event.target.value, 10);
        setRowsPerPage(Number.isFinite(value) ? value : 5);
        setPage(0);
    };

    const handleSpocShow = () => {
        setShowUpdateSpocModal(true);
    };

    const handleSurveyUploadClick = () => {
        setShowUpdateSurveyModal(true);
    };

    const handleSpocClose = () => {
        setShowUpdateSpocModal(false);
    }
    const handleModalClose = () => {
        setShowUpdateSurveyModal(false);
        setShowUpdateDownloadModal(false);
    };
    const handleDownlaodOpen = () => {
        setShowUpdateDownloadModal(true);
    };
    useEffect(() => {
        setSurveyData(filterCaseSurveysList);
    }, [filterCaseSurveysList]);

    const fetchAddedCaseProjects = async () => {
        setCaseProjects([]);
        try {
            const response = await axios.get(
                `${BaseURL}/api/v1/case/${localStorage.getItem("userid")}/${detailedCase?.caseId
                }/projects`, Authorization_header()
            );
            setCaseProjects(response?.data?.data);
        } catch (error) {
            console.error(error);
            setCaseProjects([]);
        }
    };

    const fetchSurveyList = async (filters = {}) => {
        setLoading(true);
        const payload = { headers: Authorization_header().headers };

        try {
            const queryParams = new URLSearchParams();
            if (filters.surveyProjectNames && filters.surveyProjectNames.length > 0) {
                queryParams.append("caseProjectNames", JSON.stringify(filters.surveyProjectNames));
            }

            if (filters.caseId && filters.caseId.length > 0) {
                queryParams.append("caseId", JSON.stringify(filters.caseId));
            }

            if (filters.status && filters.status.length > 0) {
                queryParams.append("status", JSON.stringify(filters.status));
            }

            if (filters.sentBy && filters.sentBy.length > 0) {
                queryParams.append("sentBy", JSON.stringify(filters.sentBy));
            }

            if (filters.sentTo && filters.sentTo.length > 0) {
                queryParams.append("sentTo", JSON.stringify(filters.sentTo));
            }

            if (filters.sentStartDate && filters.sentStartDate.length > 0) {
                queryParams.append("sentStartDate", filters.sentStartDate);
            }

            if (filters.sentEndDate && filters.sentEndDate.length > 0) {
                queryParams.append("sentEndDate", filters.sentEndDate);
            }

            if (filters.responseReceivedStartDate && filters.responseReceivedStartDate.length > 0) {
                queryParams.append("responseReceivedStartDate", JSON.stringify(filters.responseReceivedStartDate));
            }
            if (surveySortParams?.sortField) {
                queryParams.append("sortField", surveySortParams.sortField);
            }

            if (surveySortParams?.sortOrder) {
                queryParams.append("sortOrder", surveySortParams.sortOrder);
            }
            const queryString = queryParams.toString();
            const url = `${BaseURL}/api/v1/case/${localStorage.getItem("userid")}/${detailedCase.caseId}/surveylist${queryString ? `?${queryString}` : ""}`;

            const response = await axios.get(url, payload);
            setCaseSurveysList(response?.data?.data?.data);
            setUnsentSurveyList(response?.data?.data?.unSentSurveys || []);
            const count = response?.data?.data?.counts;
            setCaseSurveyDetails({
                totalSurveysSent: count?.totalSurveysSent,
                totalSurveysNotSent: count?.totalSurveysNotSent,
                totalResponsesReceived: count?.totalResponsesReceived,
                totalRemindersSent: count?.totalRemindersSent
            });
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
            setCaseSurveysList([]);
        }
    }

    useEffect(() => {
        fetchSurveyList();
        // fetchAddedCaseProjects();
    }, [detailedCase?.caseId]);

    useEffect(() => {
        setSpocUpdateList([...unsentSurveyList, ...caseSurveysList]);
    }, [unsentSurveyList, caseSurveysList])

    // useEffect(() => {
    //     setSpocUpdateList([...unsentSurveyList, ...filterCaseSurveysList]);
    // }, [unsentSurveyList, filterCaseSurveysList])

    const handleUploadClick = (val) => {
        // setSelectedEmail(val);
        setPurpose(val)
        setinteractionOpen(true);
    };

    const handleMailModalClose = (value) => {
        setinteractionOpen(false);
    };

    const handleConfirmationModalClose = () => {
        setShowConfirmationModal(false);
    }

    const handleConfirmationModalOpen = () => {
        setShowConfirmationModal(true);
    }



    const handleSendMail = async (recieversEmail, description, cc, selectedProjects, detailedSelectedSurveyIds = []) => {
        handleMailModalClose("abc");
        toast.loading("Survey sending...");
        try {
            let res;
            if (purpose === "Survey") {
                res = await axios.post(`${BaseURL}/api/v1/case/${localStorage.getItem(
                    "userid"
                )}/${detailedCase?.caseId}/sendsurvey`, { toMail: recieversEmail, mailBody: description, ccMails: cc, caseProjectIds: selectedProjects }, Authorization_header());
            } else if (purpose === "Reminder") {
                res = await axios.post(`${BaseURL}/api/v1/case/send-reminder`, { toMail: recieversEmail, mailBody: description, ccMails: cc, surveyIds: detailedSelectedSurveyIds }, Authorization_header());
            }
            toast.dismiss();
            if (purpose === "Survey") {
                toast.success("Survey sent successfully...");
            } else {
                toast.success("Reminder sent successfully...");
            }
            fetchSurveyList();
            setCode(true);
        } catch (error) {
            toast.dismiss();
            toast.error(error?.response?.data.message || "Failed to send Survey. Server error!");
            console.error(error);
            setCode(false);
        }
    }

    useEffect(() => {
        if (caseSurveysList && search) {
            const searchText = search?.trim();
            const filteredData = caseSurveysList?.filter((task) => {

                const values = Object.values(task);

                const bools = values?.filter((value) => {
                    return ((value?.toLocaleString()?.trim()?.toLowerCase()?.toString()?.includes(searchText?.trim()?.toLowerCase())) || FormatDatetime(task?.sendDate).toString().toLowerCase().trim().includes(search?.toLowerCase()));
                });
                return bools.length;
            })
            setFilteredSurvey(filteredData);
        }
    }, [search])
    // useEffect(() => {
    //     if (filterCaseSurveysList && search) {
    //         const searchText = search?.trim();
    //         const filteredData = filterCaseSurveysList?.filter((task) => {

    //             const values = Object.values(task);
    //             const bools = values?.filter((value) => {
    //                 return ((value?.toLocaleString()?.trim()?.toLowerCase()?.toString()?.includes(searchText?.trim().toLowerCase())) || FormatDatetime(task?.sendDate).toString().toLowerCase().trim().includes(search?.toLowerCase()));
    //             });
    //             return bools.length;
    //         })
    //         setFilteredSurvey(filteredData);
    //     }
    // }, [search])

    useEffect(() => {
        if (caseSurveysList && search) {
            if (selectedSurveyType === "") {
                const filteredData = caseSurveysList?.map(task => task)
                setFilteredSurvey(filteredData);
            } else {
                const filteredData = caseSurveysList?.filter((task) => {
                    let values = [];
                    values.push(task.status);
                    const bools = values?.filter((value) => {
                        return (value?.toLocaleString()?.trim()?.toString()?.toLowerCase() === (selectedSurveyType?.toLocaleLowerCase()));
                    });
                    return bools.length;
                })
                setFilteredSurvey(filteredData);
            }
        }
    }, [selectedSurveyType])
    useEffect(() => {
        if (caseSurveysList) {
            if (selectedSurveyType === "") {
                const filteredData = caseSurveysList?.map(task => task)
                setFilteredSurvey(filteredData);
            } else {
                const filteredData = caseSurveysList?.filter((task) => {
                    let values = [];
                    values.push(task.status);
                    const bools = values?.filter((value) => {
                        // return (value?.toLocaleString()?.trim()?.toLowerCase()?.toString()?.includes(selectedSurveyType?.toLocaleLowerCase()));
                        return (value?.toLocaleString()?.trim()?.toString()?.toLowerCase() === (selectedSurveyType?.toLocaleLowerCase()));
                    });
                    return bools.length;
                })
                setFilteredSurvey(filteredData);
            }
        }
    }, [selectedSurveyType])

    useEffect(() => {
        const shouldFetchWithFiltersProjects =
            caseFilterState.projectId?.length > 0 ||
            caseFilterState.caseId?.length > 0 ||
            caseFilterState.surveyProjectNames?.length > 0 ||
            caseFilterState.status?.length > 0 ||
            caseFilterState.sentBy?.length > 0 ||
            caseFilterState.sentTo?.length > 0 ||
            caseFilterState.accountingYear?.length > 0 ||
            caseFilterState.totalefforts?.length > 0 ||
            caseFilterState.rndExpense?.length > 0 ||
            caseFilterState.rndPotential?.length > 0 ||
            caseFilterState.sentStartDate?.length > 0 ||
            caseFilterState.sentEndDate?.length > 0 ||
            caseFilterState.responseReceivedStartDate?.length > 0 ||
            caseFilterState.responseReceivedEndDate?.length > 0;
        let options = {};

        if (shouldFetchWithFiltersProjects) {
            options = {
                ...(caseFilterState.caseId?.length > 0 && {
                    caseId: caseFilterState.caseId,
                }),
                ...(caseFilterState.projectId?.length > 0 && {
                    projectId: caseFilterState.projectId,
                }),
                ...(caseFilterState.surveyProjectNames?.length > 0 && {
                    surveyProjectNames: caseFilterState.surveyProjectNames,
                }),
                ...(caseFilterState.status?.length > 0 && {
                    status: caseFilterState.status,
                }),
                ...(caseFilterState.sentBy?.length > 0 && {
                    sentBy: caseFilterState.sentBy,
                }),
                ...(caseFilterState.sentTo?.length > 0 && {
                    sentTo: caseFilterState.sentTo,
                }),
                ...(caseFilterState.responseReceivedStartDate?.length > 0 && {
                    responseReceivedStartDate: caseFilterState.responseReceivedStartDate,
                }),
                ...(caseFilterState.responseReceivedEndDate?.length > 0 && {
                    responseReceivedEndDate: caseFilterState.responseReceivedEndDate,
                }),
            };
        }
        fetchSurveyList(options);

    }, [currentState, surveySortParams]);

    const applyFiltersAndFetch = (filters) => {
        if (areFiltersApplied(appliedFilters)) {
            fetchSurveyList(filters);
        } else {
            fetchSurveyList(filters);
        }
    };

    const appliedFilters = {
        company: caseFilterState.company,
    };


    const handleFilterClick = () => {
        setFilterClicked(!filterClicked);
        setFilterPanelOpen(!filterPanelOpen);
        setFilterPanelOpen(!filterPanelOpen);
    };

    const handleFilterPanelClose = () => {
        setFilterPanelOpen(false);
        setTimeout(() => {
            setFilterPanelOpen(false);
            setFilterClicked(false);
        }, 0);
    };

    const handleFilterClose = () => {
        setFilterPanelOpen(false);
    };

    const countActiveFilters = () => {
        let count = 0;
        if (Array.isArray(caseFilterState?.surveyProjectNames)) {
            if (caseFilterState.surveyProjectNames.some(surveyProjectNames => surveyProjectNames?.trim() !== "")) {
                count += 1;
            }
        }
        if (Array.isArray(caseFilterState?.status)) {
            if (caseFilterState.status.some(status => status?.trim() !== "")) {
                count += 1;
            }
        }
        if (Array.isArray(caseFilterState?.sentBy)) {
            if (caseFilterState.sentBy.some(sentBy => sentBy?.trim() !== "")) {
                count += 1;
            }
        }
        if (Array.isArray(caseFilterState?.sentTo)) {
            if (caseFilterState.sentTo.some(sentTo => sentTo?.trim() !== "")) {
                count += 1;
            }
        }
        if (Array.isArray(caseFilterState?.sentStartDate)) {
            if (caseFilterState.sentStartDate.some(sentStartDate => sentStartDate?.trim() !== "")) {
                count += 1;
            }
        }
        if (Array.isArray(caseFilterState?.responseReceivedStartDate)) {
            if (caseFilterState.responseReceivedStartDate.some(responseReceivedStartDate => responseReceivedStartDate?.trim() !== "")) {
                count += 1;
            }
        }
        return count;
    };

    const handleFormSubmit = async (formData) => {
        const data = new FormData();
        const apiUrl = `${BaseURL}/api/v1/case/${localStorage.getItem("userid")}/upload-surveys?caseId=${formData.caseId}`;
        formData?.files?.forEach((file) => {
            data.append("files", file);
        });
        toast.loading("Uploading survey...");
        try {
            const tokens = localStorage.getItem('tokens');
            const token_obj = JSON.parse(tokens);
            const response = await axios.post(apiUrl, data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    'Authorization': `Bearer ${token_obj?.accessToken}`
                },
            });
            toast.dismiss();
            toast.success(response?.data?.message || "The files have been uploaded successfully and are currently in the processing queue.");
            handleModalClose();
        } catch (error) {
            console.error("er", error);
            toast.dismiss();
            toast.error(error?.response?.data?.message || "Failed to upload survey.");
        }
    };
    return (
        <>

            <Box>
                <Box
                    sx={{
                        borderTop: "1px solid #E4E4E4",
                        p: 1,
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <Box sx={{ px: 2, display: "flex", alignItems: "center", justifyContent: "space-between", margin: "0.3rem 0.3rem" }}>
                        <Box sx={{ display: "flex", pt: 0, pb: page === "activity" ? -1 : 0 }}>
                            <Box sx={{ marginLeft: "1px", marginTop: "-7px", display: "flex", alignItems: "center" }}>
                                {!(page === "alerts") && (
                                    <Badge
                                        badgeContent={countActiveFilters()}
                                        color="error"
                                        overlap="circular"
                                        sx={{
                                            zIndex: 2,
                                            marginRight: "0px",
                                            '& .MuiBadge-badge': {
                                                minWidth: '10px',
                                                height: '16px',
                                                fontSize: '10px',
                                                paddingLeft: '5',
                                                transform: 'translate(25%, -25%)',
                                                backgroundColor: '#FD5707',
                                            },
                                        }}
                                    >
                                        <HiFilter
                                            style={styleConstants.filterDownloadStyle}
                                            onClick={handleFilterClick}
                                        />
                                    </Badge>
                                )}
                            </Box>
                            <InputLabel sx={styles.label}>
                                Case Surveys
                            </InputLabel>
                            <Drawer
                                anchor="left"
                                open={filterPanelOpen}
                                onClose={handleFilterPanelClose}
                                sx={{
                                    width: '300px',
                                    flexShrink: 0,
                                }}
                                variant="persistent"
                            >
                                {filterPanelOpen && (
                                    <CaseSurveyFilters
                                        handleClose={handleFilterPanelClose}
                                        open={filterPanelOpen}
                                        page={page}
                                        onApplyFilters={applyFiltersAndFetch}
                                        style={{ position: 'absolute', left: 0 }}
                                    />
                                )}
                            </Drawer>
                        </Box>
                        <InputBase
                            type="text"
                            value={search}
                            placeholder="Search..."
                            onChange={(e) => setSearch(e.target.value)}
                            startAdornment={
                                <InputAdornment position="start">
                                    <SearchIcon sx={styles.searchIconStyle} />
                                </InputAdornment>
                            }
                            sx={{
                                ...styles.inputBase,
                                width: "25%",
                                alignItems: "left",
                                mr: 20,
                                paddingRight: "60px"
                            }}
                        />
                        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: "1rem", width: "40%" }}>
                            <Tooltip title="Download Survey">
                                <Button
                                    variant="contained"
                                    sx={{
                                        borderRadius: "10px",
                                        backgroundColor: "#00A398",
                                        height: "2.2em",
                                        minWidth: "5px",
                                        padding: "0 0.5em",
                                        "&:hover": {
                                            backgroundColor: "#00A398",
                                        },
                                    }}
                                    onClick={handleDownlaodOpen}
                                >
                                    <Download sx={{ height: 20 }} />
                                </Button>
                            </Tooltip>
                            <NavigationWithId route={`/projects?tabName=Uploaded Sheets`}>
                                <Tooltip title="Upload Survey List">
                                    <OpenInNewIcon sx={iconStyle} />
                                </Tooltip>
                            </NavigationWithId>
                            <Tooltip title="Upload Survey">
                                <Button
                                    variant="contained"
                                    sx={styles.uploadButtonStyle1}
                                    onClick={handleSurveyUploadClick}
                                >
                                    <UploadFile />
                                </Button>
                            </Tooltip>
                            <Tooltip title="Update SPOC">
                                <Button
                                    variant="contained"
                                    sx={styles.uploadButtonStyle}
                                    onClick={handleSpocShow}
                                // setSelectedEmail={selectedEmail}
                                >
                                    <Edit sx={{ mr: 0.2, height: 16 }} />
                                    SPOC
                                </Button>
                            </Tooltip>
                            <Tooltip title="Send Survey">
                                <Button
                                    variant="contained"
                                    sx={styles.uploadButtonStyle}
                                    onClick={() => handleUploadClick("Survey")}
                                // setSelectedEmail={selectedEmail}
                                >
                                    <Send sx={{ mr: 0.2, height: 16 }} />
                                    Surveys
                                </Button>
                            </Tooltip>
                            <Tooltip title="Send Reminder">
                                <Button
                                    variant="contained"
                                    sx={styles.uploadButtonStyle}
                                    onClick={() => handleUploadClick("Reminder")}
                                // setSelectedEmail={selectedEmail}
                                >
                                    <Send sx={{ mr: 0.2, height: 16 }} />
                                    Reminder
                                </Button>
                            </Tooltip>
                        </Box>
                    </Box>

                    <Box
                        sx={{
                            flexGrow: 1,
                            marginLeft: filterPanelOpen ? '300px' : '0',
                            px: 2,
                        }}
                    >
                        <SurveyInfoboxTable caseSurveyDetails={caseSurveyDetails} handleSelectedSurveyType={handleSelectedSurveyType} />
                    </Box>
                </Box>
                <Box
                    sx={{
                        flexGrow: 1,
                        marginLeft: filterPanelOpen ? '300px' : '0',
                        px: 2,
                    }}
                >
                    <TableContainer sx={{
                        maxHeight: "82vh",
                        overflowY: "auto",
                        borderTopLeftRadius: "20px",
                        height: 300,
                        mt: -1.5,
                        borderLeft: "1px solid #E4E4E4",
                    }}>
                        <Table stickyHeader aria-label="simple table">
                            <MiniTableHeader tableData={tableData} fetchSortParams={getSurveySortParams} />

                            <CaseSurveyListing
                                filledRows={filteredSurvey}
                                handleShowSurveyDetails={handleShowSurveyDetails}
                                handleSelectedSurveyId={handleSelectedSurveyId}
                                fetchSurveyList={fetchSurveyList}
                                getReminderStatusId={getReminderStatusId}
                            />
                        </Table>
                        {loading && (
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    marginTop: "50px",
                                    minHeight: "380px",
                                }}
                            >
                                <CircularProgress sx={{ color: "#00A398" }} />
                            </div>
                        )}
                        {filteredSurvey?.length === 0 && (
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    marginTop: "50px",
                                    minHeight: "380px",
                                }}
                            >
                                No survey found.
                            </div>
                        )}
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={caseSurveysList?.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Box>
            </Box>
            <CaseSurveyDownload
                open={showUpdateDownloadModal}
                handleClose={handleModalClose}
                updatePurpose={UpdatePurposeRef.current}
                projects={caseSurveysList}
                postUpdate={fetchSurveyList}
                usedfor="case"
            />
            <UploadModalForm
                open={showUpdateSurveyModal}
                handleClose={handleModalClose}
                handleFormSubmit={handleFormSubmit}
                type={"upload"}
                caseId={detailedCase?.caseId}
            />
            <SpocIncludeProjectsModal open={showUpdateSpocModal} handleClose={handleSpocClose} updatePurpose={UpdatePurposeRef.current} projects={spocUpdateList} postUpdate={fetchSurveyList} />
            <NewSurveysInteractionModal open={interactionOpen} handleClose={handleMailModalClose} recieversEmail={selectedEmail} handleSendMail={handleSendMail} handleSurveysMailOpen={handleSurveysMailOpen} caseProjects={caseProjects} company={company} handleConfirmationModalOpen={handleConfirmationModalOpen} purpose={purpose} fetchSurveyList={fetchSurveyList} caseSurveysList={caseSurveysList} />
            {/* <SurveysMailSendModal mailModalOpen={openSurveyMailModal}  handleCaseExistModal={handleCloseSurveysMailModal} caseId={detailedCase?.caseId} client={"Techm India"} code={code} recieversEmail={selectedEmail} fetchSurveyList={fetchSurveyList} handleConfirmationModalClose={handleConfirmationModalClose} /> */}
            <Toaster />
        </>
    );
};

export default CaseSurvrysTab;