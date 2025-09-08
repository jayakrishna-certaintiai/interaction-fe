import React, { useContext, useEffect, useState } from "react";
import { Box, CircularProgress, Table, TableContainer, TablePagination, Drawer, Badge, InputBase, InputAdornment } from "@mui/material";
import MiniTableHeader from "../Common/MiniTableHeader";
import TaskTableBody from "./TaskTableBody";
import axios from "axios";
import { BaseURL } from "../../constants/Baseurl";
import { Authorization_header } from "../../utils/helper/Constant";
import { HiFilter } from "react-icons/hi";
import { areFiltersApplied } from "../../utils/helper/AreFiltersApplied";
import { ProjectContext } from "../../context/ProjectContext";
import Teamfilters from "../FilterComponents/Teamfilters";
import ProjectTaskFilters from "../FilterComponents/ProjectTaskFilters";
import FormatDatetime from "../../utils/helper/FormatDatetime";
import SearchIcon from "@mui/icons-material/Search";

const styleConstants = {
    inputStyle: {
        borderRadius: "20px",
        width: "20%",
        height: "40px",
        border: "1px solid #9F9F9F",
        mr: -100,
        ml: "62%"
    },
    searchIconStyle: {
        color: "#9F9F9F",
        ml: "3px",
        mr: "-3px",
        width: "20px",
        height: "20px",
    },
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
    inputStyle: {
        borderRadius: "20px",
        width: "40%",
        height: "40px",
        border: "1px solid #9F9F9F",
        mr: 2,
    },
    searchIconStyle: {
        color: "#9F9F9F",
        ml: "3px",
        mr: "-3px",
        width: "20px",
        height: "20px",
    },
};

const tableData = {
    columns: [
        "Task Description",
        "Task Date",
        "Team Member",
        "Hourly Rate",
        "Task Effort(Hrs)",
        "Total Expense",
        "QRE Expense",

    ],
    rows: [
        {
            id: 1,
            name: "Adam Smith",
            title: "Finance Head",
            role: "Finance Head",
            company: "Apple Inc.",
            status: "Active",
            startDate: "01/01/2023",
            endDate: "-",
            phone: "(336)-222-7000",
            email: "adamsmith@apple.com",
        },
    ],
};

function Task({
    details,
    symbol,
    projectId,
}) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [filteredProjectTask, setFilteredProjectTask] = useState([]);
    const [originalProjectTask, setOriginalProjectTask] = useState([]);
    const [error, setError] = useState(null);
    const [totalTask, setTotalTask] = useState(0);
    const [loading, setLoading] = useState(false);
    const [taskSortParams, setTaskSortParams] = useState({ sortField: null, sortOrder: null })
    const [filterClicked, setFilterClicked] = useState(false);
    const [filterPanelOpen, setFilterPanelOpen] = useState(false);
    const { projectFilterState, currentState } = useContext(ProjectContext);
    const [search, setSearch] = useState("");
    const [filteredRow, setFilteredRows] = useState([]);

    useEffect(() => {
        document.body.style.overflow = filterPanelOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [filterPanelOpen]);
    useEffect(() => {
        if (search.trim() === "") {
            // Reset filteredRows to include all tasks when search is cleared
            setFilteredRows(originalProjectTask);
        } else {
            // Filter data based on the search term
            const filteredData = originalProjectTask?.filter(task => (
                task?.taskDescription?.toString()?.trim()?.toLowerCase()?.includes(search?.toString()?.toLowerCase()) ||
                FormatDatetime(task?.taskDate)?.toString().toLowerCase().includes(search?.toString()?.toLowerCase()) ||
                task?.name?.toString()?.toLowerCase().includes(search?.toString()?.toLowerCase()) ||
                task?.taskHourlyRate?.toString().toLowerCase().includes(search?.toString()?.toLowerCase()) ||
                task?.taskEffort?.toString().toLowerCase().includes(search?.toString()?.toLowerCase()) ||
                task?.taskTotalExpense?.toString()?.trim()?.toLowerCase()?.includes(search?.toString()?.toLowerCase()) ||
                task?.RnDExpense?.toString()?.toLowerCase().includes(search?.toString()?.toLowerCase()) ||
                task?.originalFileName?.toString().toLowerCase().includes(search?.toString()?.toLowerCase()) ||
                FormatDatetime(task?.uploadedOn)?.toString().toLowerCase().includes(search?.toString()?.toLowerCase()) ||
                task?.totalhours?.toString().toLowerCase().includes(search?.toString()?.toLowerCase())
            ));
            setFilteredRows(filteredData);
        }
    }, [search, originalProjectTask]);


    const handleSearchInputChange = (event) => {
        setSearch(event?.target?.value);
    }

    useEffect(() => {
        if (filteredRow) {
            const filteredData = filteredRow?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            setFilteredProjectTask(filteredData);
        }
    }, [filteredRow, page, rowsPerPage]);


    const getTaskSortParams = ({ sortField, sortOrder }) => {
        switch (sortField) {
            case "Project ID":
                sortField = "projectCode";
                break;
            case "Project Name":
                sortField = "projectName";
                break;
            case "Task Description":
                sortField = "taskDescription";
                break;
            case "Task Date":
                sortField = "taskDate";
                break;
            case "Team Member":
                sortField = "name";
                break;
            case "Hourly Rate":
                sortField = "taskHourlyRate";
                break;
            case "Task Effort(Hrs)":
                sortField = "taskEffort";
                break;
            case "Total Expense":
                sortField = "taskTotalExpense";
                break;
            case "QRE Expense":
                sortField = "RnDExpense";
                break;
            default:
                sortField = null;
        }
        setTaskSortParams({ sortField: sortField, sortOrder: sortOrder });
    }

    const projectTask = async (filters = {}) => {
        setLoading(true);
        const payload = { headers: Authorization_header().headers };
        if (taskSortParams && taskSortParams?.sortField && taskSortParams?.sortOrder) {
            const params = { sortField: taskSortParams?.sortField, sortOrder: taskSortParams?.sortOrder };
            payload.params = params;
        }
        try {
            const queryParams = new URLSearchParams();
            let taskProjectId = JSON.stringify([projectId])
            if (filters?.names?.length > 0) {
                queryParams.append("names", JSON.stringify(filters.names));
            }
            if (filters.startUploadedOn?.length > 0) {
                queryParams.append("startTaskDate", filters.startUploadedOn);
            }
            if (filters.endUploadedOn?.length > 0) {
                queryParams.append("endTaskDate", filters.endUploadedOn);
            }
            if (filters.minHourlyRate != null && filters.minHourlyRate > 0) {
                queryParams.append("minHourlyRate", filters.minHourlyRate);
            }
            if (filters.maxHourlyRate != null && filters.maxHourlyRate) {
                queryParams.append("maxHourlyRate", filters.maxHourlyRate);
            }
            if (filters.minTotalExpense != null && filters.minTotalExpense > 0) {
                queryParams.append("minTotalExpense", filters.minTotalExpense);
            }

            if (filters.maxTotalExpense != null && filters.maxTotalExpense) {
                queryParams.append("maxTotalExpense", filters.maxTotalExpense);
            }

            if (filters.minRnDExpense != null && filters.minRnDExpense > 0) {
                queryParams.append("minRnDExpense", filters.minRnDExpense);
            }

            if (filters.maxRnDExpense != null && filters.maxRnDExpense) {
                queryParams.append("maxRnDExpense", filters.maxRnDExpense);
            }

            const queryString = queryParams.toString();

            const response = await axios.get(
                `${BaseURL}/api/v1/timesheets/get-tasks?projectIds=${taskProjectId}&page=${page}&limit=${rowsPerPage}${queryString ? `&${queryString}` : ""}`, payload
            );
            setFilteredProjectTask(response?.data?.data?.tasks || []);
            setOriginalProjectTask(response?.data?.data?.tasks || []);
            setFilteredRows(response?.data?.data?.tasks || []);
            setTotalTask(response?.data?.data?.totalCount);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            setError("An error occurred");
        }
    };

    useEffect(() => {
        projectTask();
    }, [details?.id, page, rowsPerPage, taskSortParams]);

    useEffect(() => {
        // Paginate filtered rows
        const paginatedData = filteredRow.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
        setFilteredProjectTask(paginatedData);
    }, [filteredRow, page, rowsPerPage]);

    useEffect(() => {
        const shouldFetchWithFiltersProjects =
            projectFilterState?.names?.length > 0 ||
            projectFilterState?.startUploadedOn?.length > 0 ||
            projectFilterState?.endUploadedOn?.length > 0 ||
            projectFilterState?.minHourlyRate?.length > 0 ||
            projectFilterState?.maxHourlyRate?.length > 0 ||
            projectFilterState?.minTotalExpense?.length > 0 ||
            projectFilterState?.maxTotalExpense?.length > 0 ||
            projectFilterState?.minRnDExpense?.length > 0 ||
            projectFilterState?.maxRnDExpense?.length > 0;
        if (shouldFetchWithFiltersProjects) {
            let filters = {
                ...(projectFilterState?.names?.length > 0 && {
                    names: projectFilterState?.names,
                }),
                ...(projectFilterState?.startUploadedOn?.length > 0 && {
                    startUploadedOn: projectFilterState?.startUploadedOn,
                }),
                ...(projectFilterState?.endUploadedOn?.length > 0 && {
                    endUploadedOn: projectFilterState?.endUploadedOn,
                }),
                ...(projectFilterState?.minHourlyRate?.length > 0 && {
                    minHourlyRate: projectFilterState?.minHourlyRate,
                }),
                ...(projectFilterState?.maxHourlyRate?.length > 0 && {
                    maxHourlyRate: projectFilterState?.maxHourlyRate,
                }),
                ...(projectFilterState?.minTotalExpense?.length > 0 && {
                    minTotalExpense: projectFilterState?.minTotalExpense,
                }),
                ...(projectFilterState?.maxTotalExpense?.length > 0 && {
                    maxTotalExpense: projectFilterState?.maxTotalExpense,
                }),
                ...(projectFilterState?.minRnDExpense?.length > 0 && {
                    minRnDExpense: projectFilterState?.minRnDExpense,
                }),
                ...(projectFilterState?.maxRnDExpense?.length > 0 && {
                    maxRnDExpense: projectFilterState?.maxRnDExpense,
                }),
            };
            projectTask(filters);
        } else {
            // projectTask();
        }
    }, [currentState, taskSortParams]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const applyFiltersAndFetch = (filters) => {
        if (areFiltersApplied(appliedFilters)) {
        } else {
            // toast.error("Please select at least one filter.");
        }
    };
    const appliedFilters = {
        company: projectFilterState.company,
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
        if (Array.isArray(projectFilterState?.names)) {
            if (projectFilterState.names.some(names => names?.trim() !== "")) {
                count += 1;
            }
        }
        if (Array.isArray(projectFilterState?.startUploadedOn)) {
            if (projectFilterState.startUploadedOn.some(startUploadedOn => startUploadedOn?.trim() !== "")) {
                count += 1;
            }
        }

        if (Array.isArray(projectFilterState?.endUploadedOn)) {
            if (projectFilterState.endUploadedOn.some(endUploadedOn => endUploadedOn?.trim() !== "")) {
                count += 1;
            }
        }

        if (Array.isArray(projectFilterState?.taskHourlyRate)) {
            if (projectFilterState.taskHourlyRate.some(taskHourlyRate => taskHourlyRate > 0)) {
                count += 1;
            }
        }

        if (Array.isArray(projectFilterState?.totalExpense)) {
            if (projectFilterState.totalExpense.some(totalExpense => totalExpense > 0)) {
                count += 1;
            }
        }

        if (Array.isArray(projectFilterState?.rndExpense)) {
            if (projectFilterState.rndExpense.some(rndExpense => rndExpense > 0)) {
                count += 1;
            }
        }

        return count;
    };

    return (
        <>
            <Box
                sx={{
                    borderTop: "1px solid #E4E4E4",
                    p: 1,
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
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
                                <ProjectTaskFilters
                                    handleClose={handleFilterPanelClose}
                                    open={filterPanelOpen}
                                    page={page}
                                    projectTask={projectTask}
                                    onApplyFilters={applyFiltersAndFetch}
                                    appliedFilters={appliedFilters}
                                    style={{ position: 'absolute', left: 0 }}
                                    projectId={projectId}
                                />
                            )}
                        </Drawer>
                    </Box>
                    <InputBase
                        type="text"
                        placeholder="Search..."
                        onChange={handleSearchInputChange}
                        startAdornment={
                            <InputAdornment position="start">
                                <SearchIcon sx={styleConstants.searchIconStyle} />
                            </InputAdornment>
                        }
                        sx={styleConstants.inputStyle}
                    />
                </Box>
            </Box>
            <Box
                sx={{
                    flexGrow: 1,
                    marginLeft: filterPanelOpen ? '300px' : '0',
                    px: 2,
                }}
            >
                <TableContainer
                    sx={{
                        width: "100%",
                        maxHeight: "82vh",
                        overflowY: "auto",
                        borderTopLeftRadius: "20px",
                        height: 300,
                    }}
                >
                    <Table stickyHeader aria-label="simple table">
                        <MiniTableHeader tableData={tableData} fetchSortParams={getTaskSortParams} />
                        {!loading && <TaskTableBody filteredProjectTask={filteredProjectTask} rowsPerPage={rowsPerPage} symbol={symbol} />}
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
                    {filteredProjectTask.length === 0 && (
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                marginTop: "50px",
                                minHeight: "380px",
                            }}
                        >
                            No task found.
                        </div>
                    )}
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 50, 100]}
                    component="div"
                    count={totalTask}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Box>
        </>
    );
}

export default Task;
