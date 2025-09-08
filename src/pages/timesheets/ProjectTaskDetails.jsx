import {
    Box,
    CircularProgress,
    Paper,
    Table,
    TableContainer,
    TablePagination,
} from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import usePinnedData from "../../components/CustomHooks/usePinnedData";
import PanelTableBody from "../../components/Timesheets/MainPanel/PanelTableBody";
import PanelTableHeader from "../../components/Timesheets/MainPanel/PanelTableHeader";
import { BaseURL } from "../../constants/Baseurl";
import { FilterListContext } from "../../context/FiltersListContext";
import { TimesheetContext } from "../../context/TimesheetContext";
import { areFiltersApplied } from "../../utils/helper/AreFiltersApplied";
import { useHasAccessToFeature } from "../../utils/helper/HasAccessToFeature";
import { updateTimeDifference } from "../../utils/helper/UpdateTimeDifference";
import { Authorization_header, token_obj } from "../../utils/helper/Constant";

const tableData = {
    columns: [
        "Task Date",
        "Project ID",
        "Task Description",
        "Employee",
        "QRE Classification",
        "Hourly Rate",
        "Task Effort(Hrs)",
        "Total Expense",
        "QRE Expense",
        "Created By",
        "Created Time",
        "Modified By",
        "Modified Time",
        "Task ID",
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

function ProjectTaskDetails(projectIdentifier) {
    const { pinnedObject } = usePinnedData();
    const {
        fetchTimesheets,
        timesheetFilterState,
        timesheets,
        setCurrentState,
        currentState,
    } = useContext(TimesheetContext);
    const [Tsdata, setTsData] = useState(null);
    const [data, setData] = useState(null);
    const [timesheetData, setTimesheetData] = useState(null);
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [filteredRows, setFilteredRows] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [latestUpdateTime, setLatestUpdateTime] = useState("Just now");
    const [page, setPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    // const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(10);
    const [isLoading, setisLoading] = useState(false);
    const { fetchUserDetails } = useContext(FilterListContext);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `${BaseURL}/api/v1/timesheets/${localStorage.getItem(
                        "userid"
                    )}/1/timesheet-logs`, Authorization_header()
                );
                setTsData(response?.data?.data?.list);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [localStorage?.getItem("keys")]);

    const getTaskDetails = async () => {
        try {
            const response = await axios.get(`${BaseURL}/api/v1/projects/${localStorage.getItem("userid")}/${projectIdentifier}/tasks`);
            getTaskDetails(response?.data?.data[0]);
        } catch (err) {
            console.error(err);
        }
    };
    useEffect(() => {
        if (data) {
            getTaskDetails();
        }
    }, [data, page, itemsPerPage, projectIdentifier]);

    const handleSelectedItem = async (selectedItemData) => {
        if (selectedItemData?.timesheetId !== data?.timesheetId) {
            setData(selectedItemData);
        }
    };

    const handleChangePage = (newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setItemsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    useEffect(() => {
        if (timesheetData) {
            const filteredData = timesheetData?.filter(
                (task) =>
                    task?.taskDescription
                        ?.toLowerCase()
                        ?.includes(searchInput?.toLowerCase()) ||
                    task?.taskClassification
                        ?.toLowerCase()
                        ?.includes(searchInput?.toLowerCase()) ||
                    task?.taskId?.toString()?.includes(searchInput)
            );
            setFilteredRows(filteredData);
        }
        if (timesheets) {
            const filteredData = timesheets?.filter(
                (task) =>
                    task?.timesheetId?.toLowerCase()?.includes(search?.toLowerCase()) ||
                    task?.companyId?.toString()?.includes(search)
            );
            setFilteredData(filteredData);
        }
    }, [timesheetData, timesheets]);

    useEffect(() => {
        const timeDifference = updateTimeDifference(Tsdata, "uploadedOn");
        setLatestUpdateTime(timeDifference);
    }, [Tsdata]);

    // const { updateAlertCriteria } = useContext(NotificationContext);

    const appliedFilters = {
        Clients: timesheetFilterState.company,
        Month: timesheetFilterState.monthName,
        MinimumNonRnDHours: timesheetFilterState.nonRnDHours[0],
        MaximumNonRnDHours: timesheetFilterState.nonRnDHours[1],
        MinimumRnDHours: timesheetFilterState.rnDHours[0],
        MaximumRnDHours: timesheetFilterState.rnDHours[1],
        MinimumUncertainHours: timesheetFilterState.uncertainHours[0],
        MaximumUncertainHours: timesheetFilterState.uncertainHours[1],
        MinimumReconciledHours: timesheetFilterState.reconciledHours[0],
        MaximumReconciledHours: timesheetFilterState.reconciledHours[1],
    };

    useEffect(() => {
        const shouldFetchWithFiltersTimesheet =
            timesheetFilterState.companyId.length > 0;
        if (shouldFetchWithFiltersTimesheet) {
            let timesheetOptions = {
                ...(timesheetFilterState.companyId.length > 0 && {
                    client: timesheetFilterState.companyId,
                }),
                ...(timesheetFilterState.month.length > 0 && {
                    month: timesheetFilterState.month,
                }),
                ...(timesheetFilterState.nonRnDHours && {
                    nonRnDHoursMin: timesheetFilterState.nonRnDHours[0],
                }),
                ...(timesheetFilterState.nonRnDHours && {
                    nonRnDHoursMax: timesheetFilterState.nonRnDHours[1],
                }),
                ...(timesheetFilterState.rnDHours && {
                    rnDHoursMin: timesheetFilterState.rnDHours[0],
                }),
                ...(timesheetFilterState.rnDHours && {
                    rnDHoursMax: timesheetFilterState.rnDHours[1],
                }),
                ...(timesheetFilterState.uncertainHours && {
                    uncertainHoursMin: timesheetFilterState.uncertainHours[0],
                }),
                ...(timesheetFilterState.uncertainHours && {
                    uncertainHoursMax: timesheetFilterState.uncertainHours[1],
                }),
                ...(timesheetFilterState.reconciledHours && {
                    reconciledHoursMin: timesheetFilterState.reconciledHours[0],
                }),
                ...(timesheetFilterState.reconciledHours && {
                    reconciledHoursMax: timesheetFilterState.reconciledHours[1],
                }),
            };
            fetchTimesheets(timesheetOptions);
        } else {
            fetchTimesheets();
        }
    }, [currentState]);

    const applyFiltersAndFetch = (filters) => {
        if (areFiltersApplied(appliedFilters)) {
            fetchTimesheets(filters);
        } else {
        }
    };


    const handleSelectedHeaderItem = (item) => {
        setCurrentState(item);
    };

    const updatePinState = async (newState) => {
        const newPinnedObject = {
            ...pinnedObject,
            TIMESHEETS: newState,
        };

        const pinString = Object.entries(newPinnedObject)
            .map(([key, value]) => `${key}:${value}`)
            .join("|");

        const config = {
            method: "put",
            url: `${BaseURL}/api/v1/users/${localStorage.getItem(
                "userid"
            )}/edit-user`,
            headers: { "Content-Type": "application/json", 'Authorization': `Bearer ${token_obj.accessToken}` },
            data: JSON.stringify({ pin: pinString }),
        };

        try {
            const response = await axios.request(config);

            fetchUserDetails();
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <>
            <Box
                sx={{ display: "flex", width: "98%", mx: "auto", gap: "20px", mt: 3 }}
            >
                <Box
                    sx={{
                        width: "110%",
                        display: "flex",
                        flexDirection: "column",
                        overflowX: "hidden",
                    }}
                >
                    <Paper
                        sx={{
                            boxShadow: "0px 3px 6px #0000001F",
                            borderRadius: "20px 20px 3px 3px",
                            mb: 3,
                        }}
                    >
                        {useHasAccessToFeature("F024", "P000000008") && (
                            <>
                                <TableContainer sx={{ maxHeight: "60vh", overflow: "auto" }}>
                                    <Table stickyHeader aria-label="sticky table">
                                        <PanelTableHeader tableData={tableData} />
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
                                </TableContainer>
                                <TablePagination
                                    rowsPerPageOptions={[10, 50, 100, 200]}
                                    component="div"
                                    count={totalCount}
                                    rowsPerPage={itemsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </>
                        )}
                    </Paper>
                </Box>
            </Box>
        </>
    );
}

export default ProjectTaskDetails;
