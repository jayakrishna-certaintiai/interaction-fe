import React, { useEffect, useState } from "react";
import { Box, Drawer, InputAdornment, InputBase, Table, TableContainer } from "@mui/material";
import UpdationDetails2 from "../Common/UpdationDetails2";
import MiniTableHeader from "../Common/MiniTableHeader";
import { HiFilter } from "react-icons/hi";
import ContactsRndTableBody from "./ContactsRndTableBody";
import { useHasAccessToFeature } from "../../utils/helper/HasAccessToFeature";
import ContactsSalaryTableBody from "./ContactsSalaryTableBody";
import SearchIcon from "@mui/icons-material/Search";
import { formattedDate } from "../../utils/helper/FormatDatetime";
import MiniTableHeader2 from "../Common/MiniTableHeader2";
import ContactWagesFilterModal from "../ContactFilterComponents/ContactWagesFilterModal";

const tableData = {
    columns: [
        "Annual Salary",
        "Hourly Rate",
        "Start Date",
        "End Date",
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

const filterIcon = {
    color: "white",
    borderRadius: "50%",
    backgroundColor: "#00A398",
    fontSize: "32px",
    padding: "5px",
    marginRight: "16px",
};

const styleConstants = {
    inputStyle: {
        borderRadius: "20px",
        width: "30%",
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
}

const SalaryTab = ({ data, modifiedBy, latestUpdateTime, currency, currencySymbol, getWagesSortParams, getWagesFilterParams, callWages, contactId }) => {
    const [search, setSearch] = useState("");
    const [filteredRows, setFilteredRows] = useState([]);
    // const [filterPanelOpen, setFilterPanelOpen] = useState(false);
    const [filterPanelOpen, setFilterPanelOpen] = useState(false);
    const [annualSalary, setAnnualSalary] = useState({ min: "", max: "" });
    const [hourlyRate, setHourlyRate] = useState({ min: "", max: "" });
    const [startDate, setStartDate] = useState({ min: null, max: null });
    const [endDate, setEndDate] = useState({ min: null, max: null });
    const [filterParams, setFilterParams] = useState([]);
    const [sortParams, setSortParams] = useState({});

    useEffect(() => {
        document.body.style.overflow = filterPanelOpen ? "hidden" : "";
        return () => {
          document.body.style.overflow = "";
        };
      }, [filterPanelOpen]);

    const fetchSortParams = (sortParams) => {
        setSortParams(sortParams);
    };

    useEffect(() => {
        if (sortParams?.sortField === "Annual Salary") getWagesSortParams({...sortParams, sortField: "annualRate"});
        else if (sortParams?.sortField === "Hourly Rate") getWagesSortParams({...sortParams, sortField: "hourlyRate"});
        else if (sortParams?.sortField === "Start Date") getWagesSortParams({...sortParams, sortField: "startDate"});
        else if (sortParams?.sortField === "End Date") getWagesSortParams({...sortParams, sortField: "endDate"});
        else getWagesSortParams({});
        callWages();
    }, [sortParams]);

    useEffect(() => {
        const params = {};
        if (hourlyRate?.min) {
            params.minHourlyRate = hourlyRate?.min;
        } if (hourlyRate?.max) {
            params.maxHourlyRate = hourlyRate?.max;
        } if (annualSalary?.min) {
            params.minAnnualSalary = annualSalary?.min;
        } if (annualSalary?.max) {
            params.maxAnnualSalary = annualSalary?.max;
        } if (startDate?.min) {
            params.minStartDate = startDate?.min;
        } if (startDate?.max) {
            params.maxStartDate = startDate?.max;
        } if (endDate?.min) {
            params.minEndDate = endDate?.min;
        } if (endDate?.max) {
            params.maxEndDate = endDate?.max;
        }
        getWagesFilterParams(params);
    }, [hourlyRate, annualSalary, startDate, endDate])

    function applyFilter() {
        callWages();
    }

    const handleFilterClick = () => {
        setFilterPanelOpen(!filterPanelOpen);
        setFilterPanelOpen(!filterPanelOpen);
    };

    function clearFilter() {
        setAnnualSalary({ min: "", max: "" });
        setHourlyRate({ min: "", max: "" });
        setStartDate({ min: null, max: null });
        setEndDate({ min: null, max: null });
        setTimeout(() => {
            callWages();
        }, 0)
        
    }

    const getFilterParams = (params) => {
        setFilterParams(params);
    }

    const handleFilterClose = () => {
        setFilterPanelOpen(false);
        setFilterPanelOpen(false);
    }

    const handleSearchInputChange = (event) => {
        setSearch(event?.target?.value);
    }

    useEffect(() => {
        const filteredData = data?.filter(task => (
            task?.annualRate?.toString()?.toLowerCase()?.includes(search?.toString()?.toLowerCase()) ||
            task?.hourlyRate?.toString()?.toLowerCase()?.includes(search?.toString()?.toLowerCase()) ||
            formattedDate(task?.startDate).split(" ")[0]?.toString()?.toLowerCase().includes(search?.toString()?.toLowerCase()) ||
            formattedDate(task?.endDate).split(" ")[0]?.toString()?.toLowerCase().includes(search?.toString()?.toLowerCase())
        ))
        setFilteredRows(filteredData);
    }, [search, data])

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
                    <HiFilter
                        style={styleConstants.filterDownloadStyle}
                        onClick={handleFilterClick}
                    />
                    <UpdationDetails2
                        items={data?.length}
                        latestUpdateTime={latestUpdateTime}
                        modifiedBy={modifiedBy}
                    />
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
            <Drawer anchor="left" open={filterPanelOpen} onClose={handleFilterClose}
                sx={{
                    width: '300px',
                    flexShrink: 0,
                }}
                variant="persistent"
            >
                {filterPanelOpen && <ContactWagesFilterModal open={filterPanelOpen} handleClose={handleFilterClose} style={{ position: 'absolute', left: 0 }} contactId={contactId} getFilterParams={getFilterParams} annualSalary={annualSalary} setAnnualSalary={setAnnualSalary} hourlyRate={hourlyRate} setHourlyRate={setHourlyRate} startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate}  applyFilters={applyFilter} clearFilters={clearFilter} />}
            </Drawer>
            <Box>
                <TableContainer
                    sx={{
                        width: filterPanelOpen ? "calc(100% - 280px)" : "100%",
                        maxHeight: "50vh",
                        overflowX: "auto",
                        marginLeft: filterPanelOpen ? '280px' : '0',
                        borderTopLeftRadius: filterPanelOpen ? "20px" : "0",
                        overflow: "hidden",
                    }}
                >
                    <Table stickyHeader aria-label="simple table">
                        <MiniTableHeader tableData={tableData} fetchSortParams={fetchSortParams} />
                        <ContactsSalaryTableBody filledRows={data}
                            currency={currency}
                            currencySymbol={currencySymbol}
                        />
                    </Table>
                </TableContainer>
            </Box>
        </>
    );
};

export default SalaryTab;
