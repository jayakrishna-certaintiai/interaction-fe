import AddIcon from "@mui/icons-material/Add";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Box, Button, Tooltip, Typography } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import axios from "axios";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { GoDownload } from "react-icons/go";
import { BaseURL } from "../../constants/Baseurl";
import { PortfolioContext } from "../../context/PortfolioContext";
import { useHasAccessToFeature } from "../../utils/helper/HasAccessToFeature";
import ContactModal from "../Contacts/ContactModal";
import AddNoteModal from "../Projects/AddNoteModal";
import { useNavigate, useSearchParams } from "react-router-dom";
import NewInteractionModal from "./NewInteractionModal";
import { Authorization_header } from "../../utils/helper/Constant";
import { CaseContext } from "../../context/CaseContext";
// import NewInteractionModal from "../Activity/NewInteractionModal";

const theme = createTheme({
    components: {
        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    backgroundColor: "white",
                    color: "black",
                    border: "1px solid black",
                },
            },
        },
    },
});

const styles = {
    flexBox: {
        display: "flex",
        justifyContent: "space-between",
        overflowX: "auto",
    },
    paddingLeftBox: {
        p: 1,
    },
    companyTypography: {
        display: "flex",
        alignItems: "center",
        fontSize: "13px",
        textTransform: "capitalize",
    },
    appleSpan: {
        fontSize: "17px",
        color: "#00A398",
    },
    appleSpan2: {
        fontSize: "20px",
        color: "#FD5707",
        padding: 10,
    },
    appleIncTypography: {
        display: "flex",
        alignItems: "center",
        fontSize: "22px",
        fontWeight: 600,
        whiteSpace: "nowrap",
    },
    lanIcon: {
        borderRadius: "50%",
        border: "1px solid black",
        padding: "5px",
        fontSize: "30px",
        cursor: "pointer",
        ml: 2,
        "&:hover": {
            color: "#FD5707",
            border: "1px solid #FD5707",
        },
    },
    buttonGroup: {
        display: "flex",
        alignItems: "center",
        mt: -3,
        p: 1,
    },
    buttonStyle: {
        textTransform: "capitalize",
        borderRadius: "20px",
        backgroundColor: "#00A398",
        mr: 2,
        "&:hover": {
            backgroundColor: "#00A398",
        },
        whiteSpace: "nowrap",
    },
    goDownloadIcon: {
        color: "white",
        borderRadius: "50%",
        backgroundColor: "#00A398",
        fontSize: "33px",
        padding: "5px",
        marginRight: "16px",
    },
    optionalIdentifierStyle: {
        color: "#FD5707",
        marginRight: "5px",
    },

    itemBox: (isSelected) => ({
        // display: "flex",
        // flexDirection: "column",
        // p: 1,
        // backgroundColor: isSelected ? "rgba(0, 163, 152, 0.1)" : "white",
        // borderBottom: "1px solid #E4E4E4",
        // cursor: "pointer",
    }),
    companyTypography: {
        fontWeight: 600,
    },
    detailBox: {
        justifyContent: "space-between",
        display: "flex",
    },
    detailText: {
        fontSize: "13px",
    },
};

function ContactInfoboxHeader({
    head1,
    head,
    page,
    projectId,
    comId,
    fetchCompanyContacts,
    relatedTo,
    relationName,
    relationId,
    data, fieldMapping, onItemSelected
}) {
    const [modalOpen, setModalOpen] = useState(false);
    const [noteModal, setNoteModal] = useState(false);
    const [interactionModal, setInteractionModal] = useState(false);
    const [clientsData, setClientsData] = useState(null);
    const [loading, setLoading] = useState(false);

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { handleSelectedCase } = React.useContext(CaseContext);
    const specificId = useMemo(() => searchParams.get(page + "Id"), [searchParams, page]);

    const itemRefs = useRef([]); // Use ref to track list items

    const handleSelect = (index) => {
        const idKey =
            page === "workbench"
                ? "reconcileId"
                : page === "activity"
                    ? "interactionID"
                    : page === "cases"
                        ? "caseId"
                        : `${page}Id`;
        const selectedId = data?.[index]?.[idKey];
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set(page + "Id", selectedId);
        navigate(`?${newSearchParams.toString()}`, { replace: true });
        setSelectedIndex(index);
        const sCase = data.filter((item, i) => i === index);
        handleSelectedCase(sCase[0]);
    };

    const initialIndex = useMemo(() => {
        if (!data || data.length === 0) return -1;
        const idKey =
            page === "workbench"
                ? "reconcileId"
                : page === "activity"
                    ? "interactionID"
                    : page === "cases"
                        ? "caseId"
                        : `${page}Id`;
        if (specificId) {
            return data.findIndex((item) => item?.[idKey] === specificId);
        }
        return 0;
    }, [data, specificId, page]);

    const [selectedIndex, setSelectedIndex] = useState(initialIndex);

    useEffect(() => {
        setSelectedIndex(initialIndex);
    }, [initialIndex]);

    useEffect(() => {
        if (data && data.length > 0) {
            if (specificId) {
                const idKey =
                    page === "workbench"
                        ? "reconcileId"
                        : page === "activity"
                            ? "interactionID"
                            : page === "cases"
                                ? "caseId"
                                : `${page}Id`;
                const newIndex = data.findIndex((item) => item[idKey] === specificId);
                setSelectedIndex(newIndex >= 0 ? newIndex : 0);
            } else {
                setSelectedIndex(0);
            }
        }
    }, [data, specificId, page]);

    useEffect(() => {
        if (data && data.length > 0 && selectedIndex >= 0 && onItemSelected) {
            onItemSelected(data[selectedIndex]);
        }
    }, [selectedIndex, data, onItemSelected]);

    useEffect(() => {
        if (selectedIndex >= 0 && itemRefs.current[selectedIndex]) {
            itemRefs.current[selectedIndex].scrollIntoView({
                behavior: "smooth",
                block: "start", // Positions the selected item at the top of the container
            });
        }
    }, [selectedIndex]);

    // Prevent scroll event from bubbling up
    const handleContainerScroll = (event) => {
        event.stopPropagation();
    };
    const { portfolioFilters, setPortfolioFilters, setIsPortfolioFilterApplied } =
        useContext(PortfolioContext);


    const handleModalClose = () => {
        setModalOpen(false);
    };

    const handleNoteModalClose = () => {
        setNoteModal(false);
    };

    const handleInteractionModalClose = () => {
        setInteractionModal(false);
    };

    const handleTriggerAi = async () => {
        try {
            setLoading(true);
            loading && toast.loading("Triggering Ai")
            let api;
            if (page === "projects") {
                api = `${BaseURL}/api/v1/projects/${projectId}/trigger-ai`;

            } else if (page === "companies") {

                api = `${BaseURL}/api/v1/company/${comId}/trigger-ai`;

            }
            const response = await axios.post(api, {}, Authorization_header());
            response && setLoading(false);
            if (!loading) {
                toast.dismiss();
                toast.success(response?.data?.message || "Ai triggered Successfully");
            }

        } catch (err) {
            console.error(JSON.stringify(err));
            err && setLoading(false);
            if (!loading) {
                toast.dismiss();
                toast.error("Error in Triggering AI");
            }
        }
    }

    const fetchCompanyData = async () => {
        try {
            const response1 = await axios.get(
                `${BaseURL}/api/v1/company/${localStorage.getItem(
                    "userid"
                )}/get-company-list`, Authorization_header()
            );
            setClientsData(response1?.data?.data?.list);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchCompanyData();
    }, [localStorage?.getItem("keys")]);

    const addContact = async (contactInfo) => {
        const apiUrl = `${BaseURL}/api/v1/contacts/${localStorage.getItem(
            "userid"
        )}/${comId}/create-contact`;

        try {
            const response = await axios.post(apiUrl, contactInfo, Authorization_header());
            return response.data;
        } catch (error) {
            throw error;
        }
    };

    const handleAddContact = async (contactInfo) => {
        toast
            .promise(addContact(contactInfo), {
                loading: "Adding New Employee...",
                success: (data) => data?.message || "Employee added successfully",
                error: (error) =>
                    error.response?.data?.error?.message || "Failed to add Employee.",
            })
            .then(() => {
                fetchCompanyContacts();
            })
            .catch((error) => {
                console.error("Employee addition failed:", error);
            });
    };

    const RedirectToPortfolio = async (val) => {
        setPortfolioFilters({
            ...portfolioFilters,
            companyId: [val?.companyId],
            company: val?.companyName,
        });
        setIsPortfolioFilterApplied(true);
        navigate(`/portfolios`);
    };
    const companyId = searchParams.get("companyId");

    // Calculate the initial index with useMemo

    useEffect(() => {
        setSelectedIndex(initialIndex);
    }, [initialIndex]);

    useEffect(() => {
        if (data && data?.length > 0 && selectedIndex >= 0 && onItemSelected) {
            onItemSelected(data[selectedIndex]);
        }
    }, [selectedIndex, onItemSelected, data]);

    return (
        <>
            <Box sx={styles.containerBox} onScroll={handleContainerScroll}>
                {data?.map((item, index) => (
                    <Box
                        ref={(el) => (itemRefs.current[index] = el)}
                        sx={styles.itemBox(selectedIndex === index)}
                        key={index}
                        onClick={() => handleSelect(index)}
                    >
                    </Box>
                ))}
            </Box>
            <Box sx={styles.flexBox}>
                <Box sx={styles.paddingLeftBox}>
                    <Typography sx={styles.companyTypography}>
                        {/* {page === "companies" ? "Accounts" : page}{" "} */}
                        {/* <ChevronRightIcon sx={{ fontSize: "20px", mb: -0.5 }} /> */}

                        <span style={styles.appleSpan}>{head1} {" "} <ChevronRightIcon sx={{ fontSize: "20px", mb: -0.5 }} /></span>
                        <span style={styles.appleSpan2}>
                            {projectId && (
                                <span style={{ ...styles.optionalIdentifierStyle, }}>{projectId} - </span>
                            )}
                            {head}
                        </span>
                    </Typography>
                </Box>
                <Box sx={styles.buttonGroup}>
                    {useHasAccessToFeature("F033", "P000000007") &&
                        page === "companies" && (
                            <Button
                                variant="contained"
                                sx={styles.buttonStyle}
                                onClick={() => setModalOpen(!modalOpen)}
                            >
                                <AddIcon /> New Employee
                            </Button>
                        )}
                    {useHasAccessToFeature("F033", "P000000007") &&
                        (page === "companies" || page === "projects") && (
                            <Button
                                variant="contained"
                                sx={styles.buttonStyle}
                                onClick={() => {
                                    handleTriggerAi();
                                }}
                            >
                                Trigger AI
                            </Button>
                        )}
                    <ContactModal
                        open={modalOpen}
                        handleClose={handleModalClose}
                        onAddContact={handleAddContact}
                        clients={clientsData}
                    />
                    {useHasAccessToFeature("F023", "P000000007") &&
                        page === "reconciliations" && (
                            <Button
                                variant="contained"
                                sx={styles.buttonStyle}
                                onClick={() => setInteractionModal(!interactionModal)}
                            >
                                <AddIcon /> New Interaction
                            </Button>
                        )}
                    <NewInteractionModal
                        open={interactionModal}
                        handleClose={handleInteractionModalClose}
                        relatedTo={relatedTo}
                        relationId={relationId}
                        relationName={relationName}
                    />
                    {/* {downloadPermission && <GoDownload style={styles.goDownloadIcon} />} */}
                </Box>
                <Toaster />
            </Box>
        </>
    );
}

export default ContactInfoboxHeader;
