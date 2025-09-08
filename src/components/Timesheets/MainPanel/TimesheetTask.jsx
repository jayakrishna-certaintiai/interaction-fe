import { useContext, useEffect, useState } from "react";
import { BaseURL } from "../../../constants/Baseurl";
import axios from "axios";
import { CircularProgress, Table, TableContainer, TablePagination, Drawer, Box, Badge } from "@mui/material";
import PanelTableHeader from "./PanelTableHeader";
import PanelTableBody from "./PanelTableBody";
import { Authorization_header } from "../../../utils/helper/Constant";
import FormatDatetime, { formattedDateOnly } from "../../../utils/helper/FormatDatetime";
import { HiFilter } from "react-icons/hi";
import { ProjectContext } from "../../../context/ProjectContext";
import TimesheetTaskFilters from "../../FilterComponents/TimesheetTaskFilter";
import { areFiltersApplied } from "../../../utils/helper/AreFiltersApplied";

const tableData = {
    columns: [
        "Project ID",
        "Project Name",
        "Task Description",
        "Task Date",
        "Employee",
        // "QRE Classification",
        "Hourly Rate",
        "Task Effort(Hrs)",
        "Total Expense",
        "QRE Expense",
        // "Created By",
        // "Created Time",
        // "Modified By",
        // "Modified Time",
        // "Task ID",
    ],
    rows: [
        {
            id: 1,
            taskDate: "12/10/2023",
            taskID: "43568",
            taskDesc: "Task Description",
            employee: "Ezra Romero",
            rndClassification: "QRE",
            hourlyRate: "$ 70.00",
            taskEffort: "8.00",
            totalExpense: "$ 560.00",
            rndExpense: "$ 560.00",
        },
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

const TimesheetTask = ({ timesheetId, searchInput }) => {
    const { projectFilterState, currentState } = useContext(ProjectContext);
    const [page, setPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(10);
    const [isLoading, setisLoading] = useState(false);
    const [timesheetData, setTimesheetData] = useState(null);
    const [filteredRows, setFilteredRows] = useState([]);
    const [taskSortParams, setTaskSortParams] = useState({ sortField: null, sortOrder: null });
    const [filterClicked, setFilterClicked] = useState(false);
    // const [filterPanelOpen, setFilterPanelOpen] = useState(false);
    const [filterPanelOpen, setFilterPanelOpen] = useState(false);

    useEffect(() => {
        document.body.style.overflow = filterPanelOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [filterPanelOpen]);


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
            case "Employee":
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
        setTaskSortParams({ sortField, sortOrder });
    }

    const fetchTimesheetDetails = async (filters = {}) => {
        // const companyId = data?.companyId;
        // const apiUrl = `${BaseURL}/api/v1/timesheets/get-tasks?timesheetId=${timesheetId}&page=${page}&limit=${itemsPerPage}`;

        const payload = { headers: Authorization_header().headers };
        if (taskSortParams && taskSortParams?.sortField && taskSortParams?.sortOrder) {
            const params = { sortField: taskSortParams?.sortField, sortOrder: taskSortParams?.sortOrder };
            payload.params = params;
        }

        setisLoading(true);
        // try {
        //     const response = await axios.get(apiUrl, payload);

        //     setTimesheetData(response?.data?.data?.tasks);
        //     setTotalPages(response?.data?.data?.totalCount / itemsPerPage);
        //     setTotalCount(response?.data?.data?.totalCount);
        // } catch (error) {
        //     console.error("Error:", error.message);
        // }
        try {
            const queryParams = new URLSearchParams();
            let taskTimesheetId = JSON.stringify([timesheetId])
            if (filters?.names?.length > 0) {
                queryParams.append("names", JSON.stringify(filters.names));
            }
            if (filters?.projectNames?.length > 0) {
                queryParams.append("projectNames", JSON.stringify(filters.projectNames));
            }
            if (filters.startUploadedOn?.length > 0) {
                queryParams.append("startTaskDate", (filters.startUploadedOn));
            }
            if (filters.endUploadedOn?.length > 0) {
                queryParams.append("endTaskDate", (filters.endUploadedOn));
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
            if (taskSortParams?.sortField && taskSortParams?.sortOrder) {
                queryParams.append("sortField", taskSortParams?.sortField);
                queryParams.append("sortOrder", taskSortParams?.sortOrder);
            }

            const queryString = queryParams.toString();

            const response = await axios.get(
                `${BaseURL}/api/v1/timesheets/get-tasks?timesheetId=${timesheetId}&page=${page}&limit=${itemsPerPage}${queryString ? `&${queryString}` : ""}`
            );
            // setTaskData(response?.data?.data?.tasks || []);
            // setTotalTask(response?.data?.data?.totalCount);
            setTimesheetData(response?.data?.data?.tasks);
            setTotalPages(response?.data?.data?.totalCount / itemsPerPage);
            setTotalCount(response?.data?.data?.totalCount);
        } catch (error) {
            console.error("Error:", error.message);
        }
        setisLoading(false);
    };

    useEffect(() => {
        if (timesheetId) {
            fetchTimesheetDetails(timesheetId);
        }
    }, [timesheetId, page, itemsPerPage]);

    useEffect(() => {
        const shouldFetchWithFiltersProjects =
            projectFilterState.names?.length > 0 ||
            projectFilterState.projectNames?.length > 0 ||
            projectFilterState.startUploadedOn?.length > 0 ||
            projectFilterState.endUploadedOn?.length > 0 ||
            projectFilterState.taskHourlyRate?.length > 0 ||
            projectFilterState.totalExpense?.length > 0 ||
            projectFilterState.rndExpense?.length > 0;
        let options = {};

        if (shouldFetchWithFiltersProjects) {
            options = {
                ...(projectFilterState.names?.length > 0 && {
                    names: projectFilterState.names,
                }),
                ...(projectFilterState.projectNames?.length > 0 && {
                    projectNames: projectFilterState.projectNames,
                }),
                ...(projectFilterState.startUploadedOn?.length > 0 && {
                    startUploadedOn: projectFilterState.startUploadedOn,
                }),
                ...(projectFilterState.endUploadedOn?.length > 0 && {
                    endUploadedOn: projectFilterState.endUploadedOn,
                }),
                ...(projectFilterState.taskHourlyRate?.length > 0 && {
                    taskHourlyRate: projectFilterState.taskHourlyRate,
                }),
                ...(projectFilterState.totalExpense?.length > 0 && {
                    totalExpense: projectFilterState.totalExpense,
                }),
                ...(projectFilterState.rndExpense?.length > 0 && {
                    rndExpense: projectFilterState.rndExpense,
                }),
            };
        }
        fetchTimesheetDetails(options);

    }, [currentState, taskSortParams]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setItemsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeItemsPerPage = (newItemsPerPage) => {
        setItemsPerPage(newItemsPerPage);
        // setPage(1);
    };

    useEffect(() => {
        if (timesheetData) {
            const filteredData = timesheetData?.filter(
                (task) =>
                    task?.taskDescription
                        ?.toLowerCase()
                        ?.includes(searchInput?.toLowerCase()) ||
                    task?.name?.toLowerCase().includes(searchInput?.toLowerCase()) ||
                    formattedDateOnly(task?.taskDate)?.toLowerCase().includes(searchInput?.toLowerCase()) ||
                    task?.projectId?.toLowerCase().includes(searchInput?.toLowerCase()) ||
                    task?.projectCode?.toString()?.toLowerCase().includes(searchInput?.toLowerCase()) ||
                    task?.taskHourlyRate?.toString()?.toLowerCase().includes(searchInput?.toLowerCase()) ||
                    task?.taskTotalExpense?.toString()?.toLowerCase().includes(searchInput?.toLowerCase()) ||
                    task?.taskEffort?.toString()?.toLowerCase().includes(searchInput?.toLowerCase()) ||
                    task?.RnDExpense?.toString()?.toLowerCase().includes(searchInput?.toLowerCase()) ||
                    task?.createdBy?.toString()?.toLowerCase().includes(searchInput?.toLowerCase()) ||
                    task?.modifiedBy?.toString()?.toLowerCase().includes(searchInput?.toLowerCase()) ||
                    task?.taskId?.toString()?.toLowerCase().includes(searchInput?.toLowerCase()) ||
                    FormatDatetime(task?.createdTime)?.toString()?.toLowerCase().includes(searchInput?.toLowerCase()) ||
                    FormatDatetime(task?.modifiedTime)?.toString()?.toLowerCase().includes(searchInput?.toLowerCase()) ||
                    task?.taskEffort?.toString()?.toLowerCase().includes(searchInput?.toLowerCase()) ||
                    task?.taskClassification
                        ?.toLowerCase()
                        ?.includes(searchInput?.toLowerCase()) ||
                    task?.taskId?.toString()?.includes(searchInput)
                // Add more conditions as needed
            );
            setFilteredRows(filteredData);
        }
    }, [timesheetData, searchInput]);
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

    const applyFiltersAndFetch = (filters) => {
        if (areFiltersApplied(appliedFilters)) {
        } else {
            // toast.error("Please select at least one filter.");
        }
    };
    const appliedFilters = {
        company: projectFilterState.company,
    };

    const countActiveFilters = () => {
        let count = 0;
        if (Array.isArray(projectFilterState?.names)) {
            if (projectFilterState.names.some(names => names?.trim() !== "")) {
                count += 1;
            }
        }
        if (Array.isArray(projectFilterState?.projectNames)) {
            if (projectFilterState.projectNames.some(projectNames => projectNames?.trim() !== "")) {
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
            <Box sx={{ display: "flex", pt: 0, pb: page === "activity" ? -1 : 0 }}>
                <Box sx={{ marginLeft: "9px", marginTop: "5px", display: "flex", alignItems: "center" }}>
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
                        marginTop: "20px"
                    }}
                    variant="persistent"
                >
                    {/* <AccountFilters /> */}
                    {filterPanelOpen && (
                        <TimesheetTaskFilters
                            timesheetId={timesheetId}
                            handleClose={handleFilterPanelClose}
                            open={filterPanelOpen}
                            page={page}
                            fetchTimesheetDetails={fetchTimesheetDetails}
                            onApplyFilters={applyFiltersAndFetch}
                            appliedFilters={appliedFilters}
                            style={{ position: 'absolute', left: 0 }}
                        />
                    )}
                </Drawer>
            </Box>
            <Box
                sx={{
                    flexGrow: 1,
                    marginLeft: filterPanelOpen ? '300px' : '0',
                    // maxHeight: "82vh",
                    overflowY: "auto",
                }}
            >
                <TableContainer sx={{ maxHeight: "60vh", overflow: "auto", borderTopLeftRadius: "20px" }}>
                    <Table stickyHeader aria-label="sticky table">
                        <PanelTableHeader tableData={tableData} fetchSortParams={getTaskSortParams} />
                        {!isLoading && <PanelTableBody filledRows={filteredRows} />}
                    </Table>
                    {isLoading && (
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                marginTop: "50px",
                                minHeight: "47vh",
                            }}
                        >
                            <CircularProgress sx={{ color: "#00A398" }} />
                        </div>
                    )}
                    {filteredRows.length === 0 && (
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
                    rowsPerPageOptions={[10, 50, 100, 200]}
                    component="div"
                    count={totalCount}
                    rowsPerPage={itemsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    sx={{
                        borderRadius: "20px",
                        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)"
                    }}
                />
            </Box>
        </>
    )
}

export default TimesheetTask;