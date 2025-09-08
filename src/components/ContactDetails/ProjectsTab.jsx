import React, { useEffect, useState } from "react";
import { Box, Button, Drawer, InputAdornment, InputBase, Table, TableContainer } from "@mui/material";
import UpdationDetails2 from "../Common/UpdationDetails2";
import AddIcon from "@mui/icons-material/Add";
import MiniTableHeader from "../Common/MiniTableHeader";
import ContactsProjectsTableBody from "./ContactsProjectsTableBody";
import { useHasAccessToFeature } from "../../utils/helper/HasAccessToFeature";
import SearchIcon from "@mui/icons-material/Search";
import { HiFilter } from "react-icons/hi";
import ContactProjectFilterModal from "../ContactFilterComponents/ContactProjectFilterModal";

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
  columns: ["Project ID", "Project Name", "Role", "Employee Title"],
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

function ProjectsTab({ data, modifiedBy, latestUpdateTime, getProjectsSortParams, contactId, callProjects, getProjectsFilterParams }) {
  const [search, setSearch] = useState("");
  const [filteredRows, setFilteredRows] = useState([]);
  // const [sortField, setSortField] = useState("");
  // const [sortOrder, setSortOrder] = useState("");
  // const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [selectedProjectNames, setSelectedProjectNames] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState([]);
  const [selectedRole, setSelectedRole] = useState([]);
  const [selectedEmployeeTitle, setSelectedEmployeeTitle] = useState([]);
  const [sortParams, setSortParams] = useState({});
  const [filterParams, setFilterParams] = useState([]);

  useEffect(() => {
    document.body.style.overflow = filterPanelOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [filterPanelOpen]);

  useEffect(() => {
    const filteredData = data?.filter(task => (
      task?.projectName?.toString()?.toLowerCase()?.includes(search?.toString()?.toLowerCase()) ||
      task?.projectCode?.toString()?.toLowerCase()?.includes(search?.toString()?.toLowerCase()) ||
      task?.projectId?.toString()?.toLowerCase().includes(search?.toString()?.toLowerCase()) ||
      task?.projectRole?.toString().toLowerCase().includes(search?.toString()?.toLowerCase()) ||
      task?.employeeTitle?.toString().toLowerCase().includes(search?.toString()?.toLowerCase())
    ))
    setFilteredRows(filteredData);
  }, [search, data]);

  useEffect(() => {
    if (sortParams?.sortField === "Project ID") getProjectsSortParams({ sortField: "projectCode", sortOrder: sortParams?.sortOrder });
    else if (sortParams?.sortField === "Project Name") getProjectsSortParams({ sortField: "projectName", sortOrder: sortParams?.sortOrder });
    else if (sortParams?.sortField === "Role") getProjectsSortParams({ sortField: "projectRole", sortOrder: sortParams?.sortOrder });
    else if (sortParams?.sortField === "Employee Title") getProjectsSortParams({ sortField: "employeeTitle", sortOrder: sortParams?.sortOrder });
    else getProjectsSortParams({ sortField: "", sortOrder: "" });
    callProjects();
  }, [sortParams])

  const fetchSortParams = (sortParams) => {
    setSortParams(sortParams);
  }

  useEffect(() => {
    getProjectsFilterParams(filterParams);
  }, [filterParams])

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

  function applyFilters() {
    callProjects();
  }

  function clearFilters() {
    setSelectedEmployeeTitle([]);
    setSelectedProjectId([]);
    setSelectedProjectNames([]);
    setSelectedRole([]);
    setTimeout(() => {
      callProjects();
    }, 0)
  }

  const handleSearchInputChange = (event) => {
    setSearch(event?.target?.value);
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
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          {/* <HiFilter
            style={styleConstants.filterDownloadStyle}
            onClick={handleFilterClick}
          /> */}
          {/* <UpdationDetails2
            items={data?.length}
            latestUpdateTime={latestUpdateTime}
            modifiedBy={modifiedBy}
          /> */}
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
        {filterPanelOpen && <ContactProjectFilterModal open={filterPanelOpen} handleClose={handleFilterClose} style={{ position: 'absolute', left: 0 }} contactId={contactId} getFilterParams={getFilterParams} selectedEmployeeTitle={selectedEmployeeTitle} selectedRole={selectedRole} selectedProjectId={selectedProjectId} setSetelectedProjectId={setSelectedProjectId} selectedProjectNames={selectedProjectNames} setSelectedProjectNames={setSelectedProjectNames} setSelectedProjectId={setSelectedProjectId} setSelectedRole={setSelectedRole} setSelectedEmployeeTitle={setSelectedEmployeeTitle} applyFilters={applyFilters} clearFilters={clearFilters} />}
      </Drawer>
      <Box>
        <TableContainer
          sx={{
            width: filterPanelOpen ? "calc(100% - 280px)" : "100%",
            overflowX: "auto",
            maxHeight: "50vh",
            flexGrow: 1,
            marginLeft: filterPanelOpen ? '280px' : '0',
            borderTopLeftRadius: filterPanelOpen ? "20px" : "0",
            overflow: "hidden",
          }}
        >
          <Table aria-label="simple table" stickyHeader>
            <MiniTableHeader tableData={tableData} fetchSortParams={fetchSortParams} />
            <ContactsProjectsTableBody filledRows={filteredRows} />
          </Table>
        </TableContainer>
      </Box>

    </>
  );
}

export default ProjectsTab;
