import React, { useEffect, useState } from "react";
import { Box, Drawer, InputAdornment, InputBase, Table, TableContainer } from "@mui/material";
import UpdationDetails2 from "../Common/UpdationDetails2";
import MiniTableHeader from "../Common/MiniTableHeader";
import { HiFilter } from "react-icons/hi";
import ContactsRndTableBody from "./ContactsRndTableBody";
import { useHasAccessToFeature } from "../../utils/helper/HasAccessToFeature";
import SearchIcon from "@mui/icons-material/Search";
import ContactRnDFilterModal from "../ContactFilterComponents/ContactRnDFilterModal";

const tableData = {
  columns: [
    "Project ID",
    "Project Name",
    "Total Hours",
    "Hourly Rate",
    "QRE Expense",
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

const filterIcon = {
  color: "white",
  borderRadius: "50%",
  backgroundColor: "#00A398",
  fontSize: "32px",
  padding: "5px",
  marginRight: "16px",
};

const RndExpenseTab = ({ data, modifiedBy, latestUpdateTime, getrndSortParams, contactId, callRnd, getRndFilterParams }) => {
  const [search, setSearch] = useState("");
  const [filteredRows, setFilteredRows] = useState([]);
  // const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [selectedProjectNames, setSelectedProjectNames] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState([]);
  const [selectedRnDExpense, setSelectedRnDExpense] = useState({ min: "", max: "" });
  const [selectedHourlyRate, setSelectedHourlyRate] = useState({ min: "", max: "" });
  const [selectedTotalHours, setSelectedTotalHours] = useState({ min: "", max: "" });
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
    if (sortParams?.sortField === "Project Name") getrndSortParams({ ...sortParams, sortField: "projectName" });
    else if (sortParams?.sortField === "Project ID") getrndSortParams({ ...sortParams, sortField: "projectId" });
    else if (sortParams?.sortField === "Total Hours") getrndSortParams({ ...sortParams, sortField: "totalHours" });
    else if (sortParams?.sortField === "Hourly Rate") getrndSortParams({ ...sortParams, sortField: "hourlyRate" });
    else if (sortParams?.sortField === "QRE Expense") getrndSortParams({ ...sortParams, sortField: "rndExpense" });
    else getrndSortParams({});
    callRnd();
  }, [sortParams])

  const handleSearchInputChange = (event) => {
    setSearch(event?.target?.value);
  };

  useEffect(() => {
    const params = {};
    if (selectedProjectNames?.length) params.projectNames = selectedProjectNames;
    if (selectedProjectId?.length) params.projectIds = selectedProjectId;
    if (selectedRnDExpense?.min) params.minRnDExpense = selectedRnDExpense?.min;
    if (selectedRnDExpense?.max) params.maxRnDExpense = selectedRnDExpense?.max;
    if (selectedHourlyRate?.min) params.minHourlyRate = selectedHourlyRate?.min;
    if (selectedHourlyRate?.max) params.maxHourlyRate = selectedHourlyRate?.max;
    if (selectedTotalHours?.min) params.minTotalHours = selectedTotalHours?.min;
    if (selectedTotalHours?.max) params.maxTotalHours = selectedTotalHours?.max;
    getRndFilterParams(params);
  }, [selectedProjectNames, selectedProjectId, selectedRnDExpense, selectedHourlyRate, selectedTotalHours,])

  useEffect(() => {
    const filteredData = data?.filter(task => (
      task?.projectName?.toString()?.toLowerCase()?.includes(search?.toString()?.toLowerCase()) ||
      task?.projectCode?.toString()?.toLowerCase()?.includes(search?.toString()?.toLowerCase()) ||
      task?.projectId?.toString()?.toLowerCase().includes(search?.toString()?.toLowerCase()) ||
      task?.projectRole?.toString().toLowerCase().includes(search?.toString()?.toLowerCase()) ||
      task?.totalRndHours?.toString().toLowerCase().includes(search?.toString()?.toLowerCase()) ||
      task?.hourlyRate?.toString().toLowerCase().includes(search?.toString()?.toLowerCase()) ||
      task?.rndExpense?.toString().toLowerCase().includes(search?.toString()?.toLowerCase()) ||
      task?.employeeTitle?.toString().toLowerCase().includes(search?.toString()?.toLowerCase())
      // task?.rndPotential?.toString().toLowerCase().includes(search?.toString()?.toLowerCase()) 
      // formatFyscalYear(task?.accountingYear)?.toString().toLowerCase().includes(search?.toString()?.toLowerCase())
    ))
    setFilteredRows(filteredData);
  }, [search, data])

  const clearFilters = () => {
    setSelectedProjectNames([]);
    setSelectedProjectId([]);
    setSelectedRnDExpense({ min: "", max: "" });
    setSelectedHourlyRate({ min: "", max: "" });
    setSelectedTotalHours({ min: "", max: "" });
    setTimeout(() => {
      callRnd();
    }, 0);
  }

  const applyFilters = () => {
    callRnd();
  }

  const handleFilterClick = () => {
    setFilterPanelOpen(!filterPanelOpen);
    setFilterPanelOpen(!filterPanelOpen);
  };

  const getFilterParams = (params) => {
    setFilterParams(params);
  }

  const handleFilterClose = () => {
    setFilterPanelOpen(false);
    setFilterPanelOpen(false);
  }

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
        {filterPanelOpen && <ContactRnDFilterModal open={filterPanelOpen} handleClose={handleFilterClose} style={{ position: 'absolute', left: 0 }} contactId={contactId} getFilterParams={getFilterParams} selectedProjectNames={selectedProjectNames} setSelectedProjectNames={setSelectedProjectNames} selectedProjectId={selectedProjectId} setSetelectedProjectId={setSelectedProjectId} selectedRnDExpense={selectedRnDExpense} setSelectedRnDExpense={setSelectedRnDExpense} selectedHourlyRate={selectedHourlyRate} setSelectedHourlyRate={setSelectedHourlyRate} selectedTotalHours={selectedTotalHours} setSelectedTotalHours={setSelectedTotalHours} applyFilters={applyFilters} clearFilters={clearFilters} />}
      </Drawer>
      <Box>
        <TableContainer
          sx={{
            width: filterPanelOpen ? "calc(100% - 280px)" : "100%",
            maxHeight: "50vh",
            overflowX: "auto",
            flexGrow: 1,
            marginLeft: filterPanelOpen ? '280px' : '0',
            // px: filterPanelOpen ? 2 : 0,
            borderTopLeftRadius: filterPanelOpen ? "20px" : "0",
            // borderTopRightRadius: filterPanelOpen ? "20px" : "0",
            overflow: "hidden",
          }}
        >
          <Table stickyHeader aria-label="simple table">
            <MiniTableHeader tableData={tableData} fetchSortParams={fetchSortParams} />
            <ContactsRndTableBody filledRows={filteredRows} />
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};

export default RndExpenseTab;
