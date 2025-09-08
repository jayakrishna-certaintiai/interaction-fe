import React, { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Drawer, InputAdornment, InputBase, Table, TableContainer, TablePagination, Typography } from "@mui/material";
import { HiFilter } from 'react-icons/hi';
import SearchIcon from "@mui/icons-material/Search";
import MiniTableHeader from '../../Common/MiniTableHeader';
import ProjectTeamTableBody from './ProjectTeamTableBody';
import { BaseURL } from '../../../constants/Baseurl';
import { Authorization_header } from '../../../utils/helper/Constant';
import { useAuthContext } from '../../../context/AuthProvider';
import axios from 'axios';
import CaseProjectTeamFilterModal from './CaseProjectTeamFilterModal';

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
  rows: [
    {
      id: 1,
      projectId: "000000000011258",
      role: "Finance Head",
      startDate: Date.now(),
      endDate: Date.now(),
    },
    {
      id: 2,
      projectId: "000000000011258",
      role: "Finance Head",
      startDate: Date.now(),
      endDate: Date.now(),
    },
  ],
};


const ProjectTeam = ({ caseId }) => {
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filteredRows, setFilteredRows] = useState([]);
  const [sortParams, setSortParams] = useState({ sortField: "", sortOrder: "" });
  const [filterParams, setFilterParams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [triggerFetch, setTriggerFetch] = useState(true);
  const [data, setData] = useState([]);
  const { logout } = useAuthContext();
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPageNumber, setCurrentPageNumber] = useState(0);
  const [filteredData, setFilteredData] = useState([]);
  const [triggerClear, setTriggerClear] = useState({});

  const fetchFilters = (filterParams) => {
    setFilterParams(filterParams);
    setTriggerFetch(true);
  };

  const clearFilters = () => {
    setFilterParams({});
    setTriggerFetch(true);
    setTriggerClear(false);
  }

  useEffect(() => {
    clearFilters();
  }, [triggerClear])

  async function getTeamData() {
    setLoading(true);
    const queryParams = new URLSearchParams();
    try {
      if (filterParams?.teamMembers && filterParams?.teamMembers?.length) queryParams.append("teamMembers", JSON.stringify(filterParams?.teamMembers));
            if (filterParams?.employeeIds && filterParams?.employeeIds?.length) queryParams.append("employeeIds", JSON.stringify(filterParams?.employeeIds));
            if (filterParams?.employeeTitles && filterParams?.employeeTitles?.length) queryParams.append("employeeTitles", JSON.stringify(filterParams?.employeeTitles));
            if (filterParams?.names && filterParams?.names?.length) queryParams.append("names", JSON.stringify(filterParams?.names));
            if (filterParams?.employementTypes && filterParams?.employementTypes?.length) queryParams.append("employementTypes", JSON.stringify(filterParams?.employementTypes));
            if (filterParams?.companyIds && filterParams?.companyIds?.length) queryParams.append("companyIds", JSON.stringify(filterParams?.companyIds));
            if (filterParams?.projectIds && filterParams?.projectIds?.length) queryParams.append("projectIds", JSON.stringify(filterParams?.projectIds));
            if (filterParams?.projectCodes && filterParams?.projectCodes?.length) queryParams.append("projectCodes", JSON.stringify(filterParams?.projectCodes));
            if (filterParams?.projectNames && filterParams?.projectNames?.length) queryParams.append("projectNames", JSON.stringify(filterParams?.projectNames));
            if (filterParams?.hourlyRate && filterParams?.hourlyRate?.length) queryParams.append("hourlyRates", JSON.stringify(filterParams?.hourlyRate));
            if (filterParams?.totalHours && filterParams?.totalHours?.length) queryParams.append("totalHourses", JSON.stringify(filterParams?.totalHours));
            if (filterParams?.totalCosts && filterParams?.totalCosts?.length) queryParams.append("totalCosts", JSON.stringify(filterParams?.totalCosts));
            if (filterParams?.qreCosts && filterParams?.qreCosts?.length) queryParams.append("qreCosts", JSON.stringify(filterParams?.qreCosts));
            if (filterParams?.rndPotentials && filterParams?.rndPotentials?.length) queryParams.append("rndPotentials", JSON.stringify(filterParams?.rndPotentials));
      queryParams.append("caseId", caseId);
      if (sortParams && sortParams?.sortField && sortParams?.sortOrder) {
        queryParams.append("sortField", sortParams?.sortField);
        queryParams.append("sortOrder", sortParams?.sortOrder);
      }

      const queryString = queryParams.toString();
      const url = `${BaseURL}/api/v1/contacts/get-team-members?${queryString && queryString}`;
      const response = await axios.get(url, Authorization_header())
  
      setData(response?.data?.list);
    } catch (err) {
      console.error(err);
      if (err?.response?.status === 401) {
        logout();
      }
    } finally {
      setTriggerFetch(false);
      setLoading(false);
    }
  }

  function fetchSortParams({ sortField, sortOrder }) {
    switch (sortField) {
      case "Employee ID":
        sortField = "employeeId";
        break;
      case "Employee Name":
        sortField = "firstName";
        break;
      case "Employement Type":
        sortField = "employementType";
        break;
      case "Role":
        sortField = "employeeTitle";
        break;
      case "Company Name":
        sortField = "companyName";
        break;
      case "Project Ids":
        sortField = "projectCode";
        break;
      case "Project Name":
        sortField = "projectName"
        break;
      case "Total Hours":
        sortField = "totalHours";
        break;
      case "Hourly Rate":
        sortField = "hourlyRate";
        break;
      case "Total Expense":
        sortField = "totalCost";
        break;
      case "QRE Potential (%)":
        sortField = "rndPotential";
        break;
      case "R&D Credits":
        sortField = "rndCredits";
        break;
      case "QRE Cost":
        sortField = "qreCost";
        break;
      default:
        sortField = null;
        break;
    };
    setSortParams({ sortField: sortField, sortOrder: sortOrder });
    setTriggerFetch(true);
  }

  useEffect(() => {
    triggerFetch && getTeamData();
  }, [triggerFetch])

  useEffect(() => {
    document.body.style.overflow = filterPanelOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [filterPanelOpen]);

  const handleFilterClick = () => {
    setFilterPanelOpen(!filterPanelOpen);
    // setFilterPanelOpen(!filterPanelOpen);
  };

  const handleSearchInputChange = (event) => {
    setSearch(event?.target?.value);
  };

  const handlePageChange = (event, value) => {
    setCurrentPageNumber(value);
  };
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPageNumber(0);
  };

  useEffect(() => {

    const filteredData = data?.filter(task => (
      task?.projectName?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
      task?.projectId?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
      task?.projectCode?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
      task.firstName?.toString()?.toLowerCase().includes(search.toLowerCase()) ||
      task.lastName?.toString()?.toLowerCase().includes(search.toLowerCase()) ||
      task.middleName?.toString()?.toLowerCase().includes(search.toLowerCase()) ||
      task.companyName?.toString()?.toLowerCase().includes(search.toLowerCase()) ||
      task.employeeId?.toString()?.toLowerCase().includes(search.toLowerCase()) ||
      task.employementType?.toString()?.toLowerCase().includes(search.toLowerCase()) ||
      task.employeeTitle?.toString()?.toLowerCase().includes(search.toLowerCase()) ||
      task?.teamMemberId?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
      task?.companyId?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
      task?.totalCost?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
      task?.totalHours?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
      task?.rndCredits?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
      task?.rndPotential?.toString()?.toLowerCase()?.includes(search?.toLocaleLowerCase()) ||
      task?.hourlyRate?.toString()?.toLowerCase()?.includes(search?.toLowerCase())
    ))
    setFilteredData(filteredData);
    const newData = filteredData?.slice(currentPageNumber * rowsPerPage, currentPageNumber * rowsPerPage + rowsPerPage);
    setFilteredRows(newData);
  }, [search, data, currentPageNumber, rowsPerPage]);

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
          <Box sx={{ display: "flex", alignItems:"center" }}>
             <HiFilter
              style={styleConstants.filterDownloadStyle}
              onClick={handleFilterClick}
            /> 
            <Typography sx={{fontWeight: 600, fontSize: "15px"}} >Projects Team</Typography>
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
        <Drawer anchor="left" open={filterPanelOpen} onClose={handleFilterClick}
        sx={{
          width: '300px',
          flexShrink: 0,
        }}
        variant="persistent"
      >
        {filterPanelOpen && <CaseProjectTeamFilterModal open={filterPanelOpen} onClose={handleFilterClick} caseId={caseId} fetchFilters={fetchFilters}  triggerClear={triggerClear} setTriggerClear={setTriggerClear} />}
        {/* {filterPanelOpen && <ContactProjectFilterModal open={filterPanelOpen} handleClose={handleFilterClose} style={{ position: 'absolute', left: 0 }} contactId={contactId} getFilterParams={getFilterParams} selectedEmployeeTitle={selectedEmployeeTitle} selectedRole={selectedRole} selectedProjectId={selectedProjectId} setSetelectedProjectId={setSelectedProjectId} selectedProjectNames={selectedProjectNames} setSelectedProjectNames={setSelectedProjectNames} setSelectedProjectId={setSelectedProjectId} setSelectedRole={setSelectedRole} setSelectedEmployeeTitle={setSelectedEmployeeTitle} applyFilters={applyFilters} clearFilters={clearFilters} />} */}
      </Drawer>
      </Box>
      <Box>
        <TableContainer
          sx={{
            width: filterPanelOpen ? "calc(100% - 280px)" : "100%",
            overflowX: "auto",
            maxHeight: "50vh",
            flexGrow: 1,
            marginLeft: filterPanelOpen ? '280px' : '0',
            borderTopLeftRadius: filterPanelOpen ? "20px" : "0",
            overflowY: "auto",
          }}
        >
          <Table>
            <MiniTableHeader tableData={tableData} fetchSortParams={fetchSortParams} />
            {!loading && <ProjectTeamTableBody filledRows={filteredRows} rowsPerPage={rowsPerPage} />}
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
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredData?.length}
          rowsPerPage={rowsPerPage}
          page={currentPageNumber}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </Box>
    </>
  )
}

export default ProjectTeam