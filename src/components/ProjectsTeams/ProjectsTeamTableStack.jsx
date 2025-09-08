import { Badge, Box, CircularProgress, Drawer, Table, TableContainer } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import TableIntro from "../Common/TableIntro";
import TableHeader from "../Common/TableHeader";
import ProjectsTeamTableBody from "./ProjectsTeamTableBody";
import toast, { Toaster } from "react-hot-toast";
import { useHasAccessToFeature } from "../../utils/helper/HasAccessToFeature";
import CustomPagination from "../Common/CustomPagination";
import usePinnedData from "../CustomHooks/usePinnedData";
import { ProjectTeammemberContext } from "../../context/ProjectTeammemberContext";
import { BaseURL } from "../../constants/Baseurl";
import axios from "axios";
import { HiFilter } from "react-icons/hi";
import { AddTeamModal } from "./AddTeamModal";
import TeamFilter from "./TeamFilterModal";
import { Authorization_header2 } from "../../utils/helper/Constant";

const styleConstants = {
    filterDownloadStyle: {
        color: "white",
        borderRadius: "50%",
        backgroundColor: "#00A398",
        fontSize: "28px",
        padding: "5px",
        marginRight: "16px",
        cursor: "pointer",
        marginTop: "-20px"
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
        "Employee ID",
        "Employee Name",
        "Employement Type",
        "Role",
        "Company Name",
        "Project Ids",
        "Project Name",
        "Total Hours",
        "Hourly Rate",
        "Total Expense",
        "QRE Potential (%)",
        "R&D Credits",
        "QRE Cost",
    ],
};

function ProjectsTeamTableStack({ page, latestUpdateTime, }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [search, setSearch] = useState("");
    const [filteredRows, setFilteredRows] = useState([]);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [filterClicked, setFilterClicked] = useState(false);
    const [filterPanelOpen, setFilterPanelOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const { pinnedObject } = usePinnedData();
    const [showAddTeamModal, setShowAddTeamModal] = useState(false);
    const [pinStates, setPinStates] = useState({
        "All Project Team Members": false,
        "Recently Viewed": false,
    });

    const { teamMembers, getProjectsTeamMembers, currentState, setCurrentState, loading } = useContext(ProjectTeammemberContext)

    useEffect(() => {
        getProjectsTeamMembers();
    }, []);

    const onApplyFilters = (filters) => {

    };

    // const handleDownloadSheet = async () => {
    //     const result = await axios.get(`${BaseURL}/api/v1/contacts/download-team-member-report`, Authorization_header());
    //     console.log(result);

    // }

    const handleDownloadSheet = async () => {
        try {
            const response = await axios.get(
                `${BaseURL}/api/v1/contacts/download-team-member-report`,
                {
                    headers: Authorization_header2(),
                    responseType: "blob",
                }
            );

            // Create a link element to download the file
            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(new Blob([response.data]));
            link.download = "TeamMembersSheet.xlsx";
            link.click();
            const successMessage = response.headers['x-success-message'] || "";
            successMessage && toast.success(successMessage);
        } catch (error) {
            console.error("Error downloading the file:", error);
            toast.error("Failed to download the file. Please try again.");
        }
    };

    const updatePinState = async (newState) => {
        const newPinnedObject = {
            ...pinnedObject,
            PROJ: newState,
        };

        const pinString = Object.entries(newPinnedObject)
            .map(([key, value]) => `${key}:${value}`)
            .join("|");

        const config = {
            method: "put",
            url: `${BaseURL}/api/v1/users/${localStorage.getItem(
                "userid"
            )}/edit-user`,
            headers: { "Content-Type": "application/json" },
            data: JSON.stringify({ pin: pinString }),
        };

        try {
            const response = await axios.request(config);
        } catch (error) {
            console.error(error);
        }
    };
    
    const totalPages = Math.ceil(filteredRows?.length / itemsPerPage);

    const handleChangePage = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleUploadClick = () => {
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
    };

    const togglePinState = (selectedHeading) => {
        setPinStates((prevStates) => {
            const resetStates = Object.keys(prevStates).reduce((acc, key) => {
                acc[key] = false;
                return acc;
            }, {});

            const newState = {
                ...resetStates,
                [selectedHeading]: !prevStates[selectedHeading],
            };

            const allFalse =
                !newState["All Project Team Members"] && !newState["Recently Viewed"];
            if (allFalse) {
                newState["All Project Team Members"] = true;
            }

            return newState;
        });
    };

    useEffect(() => {
        const newState = Object.keys(pinStates).find(
            (key) => pinStates[key] === true
        );

        if (newState) {
            const newStateValue = newState === "All Projects" ? "ALL" : "RV";

            updatePinState(newStateValue)
                .then(() => {
                })
                .catch((error) => {
                    console.error("Failed to update pin state:", error);
                });
        }
    }, [pinStates]);

    const appliedFilters = {
        company: "random company",
    };

    const handleChangeItemsPerPage = (items) => {
        setItemsPerPage(items);
        setCurrentPage(1);
    };

    const handleSelectedHeaderItem = (item) => {
        setCurrentState(item);
    };

    useEffect(() => {
        setCurrentState(
            pinnedObject?.PROJ === "RV" ? "Recently Viewed" : "All Projects"
        );
    }, [localStorage?.getItem("keys")]);

    const currentData = filteredRows?.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    while (currentData?.length < itemsPerPage) {
        currentData?.push({});
    }

    const handleSearch = (input) => {
        setSearch(input);
    };

    useEffect(() => {
        if (teamMembers) {
            const filteredData = teamMembers?.filter(
                (task) => {
                    return task?.projectName?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
                        task?.projectId?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
                        task?.projectCode?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
                        task.firstName?.toString()?.toLowerCase().includes(search.toLowerCase()) ||
                        task.lastName?.toString()?.toLowerCase().includes(search.toLowerCase()) ||
                        task.middleName?.toString()?.toLowerCase().includes(search.toLowerCase()) ||
                        task.companyName?.toString()?.toLowerCase().includes(search.toLowerCase()) ||
                        task.employeeId?.toString()?.toLowerCase().includes(search.toLowerCase()) ||
                        task.employementType?.toString()?.toLowerCase().includes(search.toLowerCase()) ||
                        task?.teamMemberId?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
                        task?.companyId?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
                        task?.totalCost?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
                        task?.totalHours?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
                        task?.rndCredits?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
                        task?.rndPotential?.toString()?.toLowerCase()?.includes(search?.toLocaleLowerCase()) ||
                        task?.hourlyRate?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
                        task?.currency?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
                        task?.qreCost?.toString()?.toLowerCase()?.includes(search?.toLowerCase());
                })

            setFilteredRows(filteredData);
            setCurrentPage(1);

        } else {
            setFilteredRows([]);
        }
    }, [teamMembers, search]);

    const handleFilterClick = () => {
        setFilterClicked(!filterClicked);
        setDrawerOpen(!drawerOpen);
        setFilterPanelOpen(!filterPanelOpen);
    };

    const handleFilterPanelClose = () => {
        setFilterPanelOpen(false);
        setTimeout(() => {
            setDrawerOpen(false);
            setFilterClicked(false);
        }, 0);
    };

    const countActiveFilters = () => { };

    return (
        <>
            {drawerOpen && <div style={styleConstants.overlay} />}
            <Box
                sx={{
                    opacity: drawerOpen ? 15 : 1,
                    transition: 'opacity 0.3s ease-in-out',
                }}
            >
                <TableIntro
                    heading="Members"
                    page={"projectTeam"}
                    data={teamMembers}
                    totalItems={filteredRows?.length || 0}
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    onSearch={handleSearch}
                    items={["All Project Team", "Recently Viewed"]}
                    onApplyFilters={handleFilterClick}
                    appliedFilters={appliedFilters}
                    onUploadClick={handleUploadClick}
                    createPermission={useHasAccessToFeature("F013", "P000000007")}
                    searchPermission={useHasAccessToFeature("F013", "P000000009")}
                    onSelectedItem={handleSelectedHeaderItem}
                    isPinnedState={pinStates[currentState]}
                    onPinClicked={() => togglePinState(currentState)}
                    onDownloadClick2={handleDownloadSheet}
                />

                <AddTeamModal open={modalOpen} handleClose={handleModalClose} type="upload" />
                <CustomPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    changePage={handleChangePage}
                    changeItemsPerPage={handleChangeItemsPerPage}
                    minRows={20}
                    sx={{ mt: "-20px" }}
                />

                <Box sx={{ display: "flex", pt: 0, pb: page === "activity" ? -1 : 0 }}>
                    <Box sx={{ marginLeft: "9px", marginTop: "-130px", display: "flex", alignItems: "center" }}>
                        {!(page === "alerts") && (
                            <Badge
                                badgeContent={countActiveFilters()}
                                color="error"
                                overlap="circular"
                                sx={{
                                    zIndex: 2,
                                    marginRight: "0px",
                                    //   marginTop: "5px",
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

                    <Drawer
                        anchor="left"
                        open={drawerOpen}
                        onClose={handleFilterPanelClose}
                        sx={{
                            width: '300px',
                            flexShrink: 0,
                            marginTop: "-10px"
                        }}
                        variant="persistent"
                    >
                        {filterPanelOpen && (
                            <TeamFilter
                                open={filterPanelOpen}
                                handleClose={handleFilterPanelClose}
                                onApplyFilters={onApplyFilters}
                            />
                        )}
                    </Drawer>
                </Box>


            </Box>
            <Box
                sx={{
                    flexGrow: 1,
                    marginLeft: drawerOpen ? '300px' : '0',
                }}>
                <TableContainer
                    sx={{
                        maxHeight: "82vh",
                        overflowY: "auto",
                        borderTopLeftRadius: "20px",
                    }}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHeader tableData={tableData} page={"projectTeam"} />
                        {!loading && <ProjectsTeamTableBody data={currentData} getProjectsTeamMembers={getProjectsTeamMembers} />}
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
                    {currentData?.length === 0 && (
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                marginTop: "50px",
                                minHeight: "380px",
                            }}
                        >
                            No teamMembers found.
                        </div>
                    )}
                </TableContainer>
            </Box>
            <Toaster />
        </>
    );

}

export default ProjectsTeamTableStack;