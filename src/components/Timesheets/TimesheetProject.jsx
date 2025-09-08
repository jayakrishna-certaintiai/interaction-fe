import { CircularProgress, Table, TableContainer, Drawer, Box, Badge } from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import TableHeader from "../Common/TableHeader";
import TimesheetProjectTableBody from "../Timesheets/MainPanel/TimesheetProjectTableBody";
import CustomPagination from "../Common/CustomPagination";
import { ProjectContext } from "../../context/ProjectContext";
import { formatFyscalYear } from "../../utils/helper/FormatFiscalYear";
import MiniTableHeader from "../Common/MiniTableHeader";
import { HiFilter } from "react-icons/hi";
import TimesheetProjectFilter from "../FilterComponents/TimesheetProjectFilter";

const tableData = {
    columns: [
        "Project ID",
        "Project Name",
        // "Account",
        // "Fiscal Year",
        "SPOC Name",
        "SPOC Email",
        "Total Expense",
        "QRE Expense",
        "QRE Potential (%)",
    ],
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

function TimesheetProject({ timesheetId, search, page, onApplyFilters, documentType = "" }) {
    const {
        projects,
        timesheetProject,
        projectFilterState,
        fetchTimesheetProjects,
        currentState,
        loading,
    } = useContext(ProjectContext);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [filteredRows, setFilteredRows] = useState([]);
    const [projectSortParams, setProjectSortParams] = useState({ sortField: null, sortOrder: null });
    const [filterClicked, setFilterClicked] = useState(false);
    // const [filterPanelOpen, setFilterPanelOpen] = useState(false);
    const [filterPanelOpen, setFilterPanelOpen] = useState(false);

    useEffect(() => {
        document.body.style.overflow = filterPanelOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [filterPanelOpen]);

    useEffect(() => {
        if (timesheetId) {
            const shouldFetchWithFiltersProjects =
                projectFilterState.projectNames?.length > 0 ||
                projectFilterState.timesheetId?.length > 0 ||
                projectFilterState.projectCodes?.length > 0 ||
                projectFilterState.spocName?.length > 0 ||
                projectFilterState.spocEmail?.length > 0 ||
                projectFilterState.rndPotential?.length > 0 ||
                projectFilterState.totalExpense?.length > 0 ||
                projectFilterState.rndExpense?.length > 0;

            let options = {
                timesheetId: timesheetId,
            };
            if (shouldFetchWithFiltersProjects) {
                options = {
                    ...options,
                    // timesheetId: timesheetId,
                    ...(projectFilterState.projectNames?.length > 0 && {
                        projectNames: projectFilterState.projectNames,
                    }),
                    ...(projectFilterState.timesheetId?.length > 0 && {
                        timesheetId: projectFilterState.timesheetId,
                    }),
                    ...(projectFilterState.projectCodes?.length > 0 && {
                        projectCodes: projectFilterState.projectCodes,
                    }),
                    ...(projectFilterState.spocName?.length > 0 && {
                        spocName: projectFilterState.spocName,
                    }),
                    ...(projectFilterState.spocEmail?.length > 0 && {
                        spocEmail: projectFilterState.spocEmail,
                    }),
                    ...(projectFilterState.rndPotential?.length > 0 && {
                        rndPotential: projectFilterState.rndPotential,
                    }),
                    ...(projectFilterState.totalExpense?.length > 0 && {
                        totalExpense: projectFilterState.totalExpense,
                    }),
                    ...(projectFilterState.rndExpense?.length > 0 && {
                        rndExpense: projectFilterState.rndExpense,
                    }),
                };
            }
            if (projectSortParams && projectSortParams?.sortField && projectSortParams?.sortOrder) {
                options.sortField = projectSortParams?.sortField;
                options.sortOrder = projectSortParams?.sortOrder;
            }
            fetchTimesheetProjects(options);
        }
    }, [timesheetId, page, itemsPerPage, projectSortParams]);
    // useEffect(() => {
    //     const shouldFetchWithFiltersProjects =
    //         projectFilterState.projectNames?.length > 0 ||
    //         projectFilterState.timesheetId?.length > 0 ||
    //         projectFilterState.projectCodes?.length > 0 ||
    //         projectFilterState.spocName?.length > 0 ||
    //         projectFilterState.spocEmail?.length > 0 ||
    //         projectFilterState.rndPotential?.length > 0 ||
    //         projectFilterState.totalExpense?.length > 0 ||
    //         projectFilterState.rndExpense?.length > 0;

    //     let options = {
    //         timesheetId: timesheetId,
    //     };
    //     if (shouldFetchWithFiltersProjects) {
    //         options = {
    //             ...options,
    //             // timesheetId: timesheetId,
    //             ...(projectFilterState.projectNames?.length > 0 && {
    //                 projectNames: projectFilterState.projectNames,
    //             }),
    //             ...(projectFilterState.timesheetId?.length > 0 && {
    //                 timesheetId: projectFilterState.timesheetId,
    //             }),
    //             ...(projectFilterState.projectCodes?.length > 0 && {
    //                 projectCodes: projectFilterState.projectCodes,
    //             }),
    //             ...(projectFilterState.spocName?.length > 0 && {
    //                 spocName: projectFilterState.spocName,
    //             }),
    //             ...(projectFilterState.spocEmail?.length > 0 && {
    //                 spocEmail: projectFilterState.spocEmail,
    //             }),
    //             ...(projectFilterState.rndPotential?.length > 0 && {
    //                 rndPotential: projectFilterState.rndPotential,
    //             }),
    //             ...(projectFilterState.totalExpense?.length > 0 && {
    //                 totalExpense: projectFilterState.totalExpense,
    //             }),
    //             ...(projectFilterState.rndExpense?.length > 0 && {
    //                 rndExpense: projectFilterState.rndExpense,
    //             }),
    //         };
    //     }
    //     if (projectSortParams && projectSortParams?.sortField && projectSortParams?.sortOrder) {
    //         options.sortField = projectSortParams?.sortField;
    //         options.sortOrder = projectSortParams?.sortOrder;
    //     }

    //     // fetchTimesheetProjects(options);

    // }, [currentState, projectSortParams]);

    const getProjectSortParams = ({ sortField, sortOrder }) => {
        switch (sortField) {
            case "Project Name":
                sortField = "projectName";
                break;
            case "Project ID":
                sortField = "projectCode";
                break;
            case "Account":
                sortField = "companyName";
                break;
            case "Fiscal Year":
                sortField = "accountingYear";
                break;
            case "SPOC Name":
                sortField = "spocName";
                break;
            case "SPOC Email":
                sortField = "spocEmail";
                break;
            case "Total Expense":
                sortField = "TotalExpense";
                break;
            case "QRE Expense":
                sortField = "rndExpense";
                break;
            case "QRE Potential (%)":
                sortField = "rndPotential";
                break;
            default:
                sortField = null;
        }
        // Set both sortField and sortOrder for fetching projects
        setProjectSortParams({ sortField: sortField, sortOrder: sortOrder });
    };
    const totalPages = Math.ceil(filteredRows?.length / itemsPerPage);

    const handleChangePage = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleChangeItemsPerPage = (items) => {
        setItemsPerPage(items);
        setCurrentPage(1);
    };

    const currentData = filteredRows?.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    while (currentData?.length < itemsPerPage) {
        currentData?.push({});
    }

    useEffect(() => {
        if (timesheetProject) {
            const filteredData = timesheetProject?.filter(
                (task) =>
                    task?.projectName?.toLowerCase()?.includes(search?.toLowerCase()) ||
                    task?.projectId?.toLowerCase()?.includes(search?.toLowerCase()) ||
                    task?.projectCode?.toLowerCase()?.includes(search?.toLowerCase()) ||
                    task.firstName?.toLowerCase().includes(search.toLowerCase()) ||
                    task.lastName?.toLowerCase().includes(search.toLowerCase()) ||
                    task.middleName?.toLowerCase().includes(search.toLowerCase()) ||
                    task?.description?.toLowerCase()?.includes(search?.toLowerCase()) ||
                    task?.spocName?.toLowerCase()?.includes(search?.toLowerCase()) ||
                    task?.spocEmail?.toLowerCase()?.includes(search?.toLowerCase()) ||
                    task?.TotalExpense?.toString().toLowerCase().includes(search?.toString()?.toLowerCase()) ||
                    task?.rndExpense?.toString().toLowerCase().includes(search?.toString()?.toLowerCase()) ||
                    task?.rndPotential?.toString().toLowerCase().includes(search?.toString()?.toLowerCase()) ||
                    formatFyscalYear(task?.accountingYear)?.toLowerCase()?.includes(search?.toLowerCase()) ||
                    task?.companyId?.toString()?.includes(search) ||
                    task?.RnDExpenseCumulative?.toString()?.includes(search)
            );
            setFilteredRows(filteredData);
            setCurrentPage(1);
        }
    }, [timesheetProject, search]);


    useEffect(() => {
        if (projects) {
            const filteredData = projects?.filter(
                (task) => {

                    return task?.projectName?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
                        task?.projectId?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
                        task?.projectCode?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
                        task.firstName?.toString()?.toLowerCase().includes(search.toLowerCase()) ||
                        task.lastName?.toString()?.toLowerCase().includes(search.toLowerCase()) ||
                        task.middleName?.toString()?.toLowerCase().includes(search.toLowerCase()) ||
                        task.companyName?.toString()?.toLowerCase().includes(search.toLowerCase()) ||
                        task.spocEmail?.toString()?.toLowerCase().includes(search.toLowerCase()) ||
                        task.spocName?.toString()?.toLowerCase().includes(search.toLowerCase()) ||
                        task?.companyId?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
                        task?.company?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
                        task?.accountingYear?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
                        task?.totalExpense?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
                        task?.TotalExpense?.toString().toLowerCase().includes(search?.toString()?.toLowerCase()) ||
                        task?.rndExpense?.toString().toLowerCase().includes(search?.toString()?.toLowerCase()) ||
                        task?.rndPotential?.toString().toLowerCase().includes(search?.toString()?.toLowerCase()) ||
                        task?.accountingYear?.toString()?.includes(search?.toLowerCase());

                })

            setFilteredRows(filteredData);

        } else {
            setFilteredRows([]);
        }
    }, [projects, search]);

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
        // if (Array.isArray(projectFilterState?.projectNames)) {
        //     if (projectFilterState.projectNames.some(projectNames => projectNames?.trim() !== "")) {
        //         count += 1;
        //     }
        // }

        // if (Array.isArray(projectFilterState?.projectCodes)) {
        //     if (projectFilterState.projectCodes.some(projectCodes => projectCodes?.trim() !== "")) {
        //         count += 1;
        //     }
        // }

        // if (Array.isArray(projectFilterState?.spocName)) {
        //     if (projectFilterState.spocName.some(spocName => spocName?.trim() !== "")) {
        //         count += 1;
        //     }
        // }

        // if (Array.isArray(projectFilterState?.spocEmail)) {
        //     if (projectFilterState.spocEmail.some(spocEmail => spocEmail?.trim() !== "")) {
        //         count += 1;
        //     }
        // }

        // if (Array.isArray(projectFilterState?.totalExpense)) {
        //     if (projectFilterState.totalExpense.some(expense => expense > 0)) {
        //         count += 1;
        //     }
        // }

        // if (Array.isArray(projectFilterState?.rndExpense)) {
        //     if (projectFilterState.rndExpense.some(expense => expense > 0)) {
        //         count += 1;
        //     }
        // }

        // if (Array.isArray(projectFilterState?.rndPotential)) {
        //     if (projectFilterState.rndPotential.some(potential => potential > 0)) {
        //         count += 1;
        //     }
        // }

        return count;
    };


    return (
        <>
            {/* <div sx={{ borderRadius: "20px", overflow: "hidden", padding: "10px", boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)" }}> */}
            <Box sx={{ display: "flex", pt: 0, pb: page === "activity" ? -1 : 0 }}>
                <Box sx={{ marginLeft: "9px", marginTop: "1px", display: "flex", alignItems: "center" }}>
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
                    {/* <AccountFilters /> */}
                    {filterPanelOpen && (
                        <TimesheetProjectFilter
                            timesheetId={timesheetId}
                            handleClose={handleFilterPanelClose}
                            open={filterPanelOpen}
                            page={page}
                            documentType={documentType}
                            onApplyFilters={onApplyFilters}
                            style={{ position: 'absolute', left: 0 }}
                        />
                    )}
                </Drawer>
            </Box>
            <Box
                sx={{
                    // flexGrow: 1,
                    marginLeft: filterPanelOpen ? '300px' : '0',
                    // maxHeight: "85vh",
                    // overflowY: "auto",
                }}
            >
                <TableContainer
                    sx={{
                        maxHeight: "70vh",
                        borderTopLeftRadius: "20px",
                    }}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        {/* <TableHeader tableData={tableData} page="project_details" /> */}
                        <MiniTableHeader tableData={tableData} fetchSortParams={getProjectSortParams} />
                        {!loading && <TimesheetProjectTableBody
                            data={currentData}
                            currentPage={currentPage}
                            itemsPerPage={itemsPerPage}
                        />
                        }
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

                    {currentData.length === 0 && (
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                marginTop: "50px",
                                minHeight: "380px",
                            }}
                        >
                            No projects found.
                        </div>
                    )}
                </TableContainer>
                <CustomPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    changePage={handleChangePage}
                    changeItemsPerPage={handleChangeItemsPerPage}
                />
            </Box>
        </>
    );
}

export default TimesheetProject;
