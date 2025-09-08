import AddIcon from "@mui/icons-material/Add";
import { Box, Button, Drawer, InputAdornment, InputBase, Table, TableContainer, Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useHasAccessToFeature } from "../../utils/helper/HasAccessToFeature";
import MiniTableHeader from "../Common/MiniTableHeader";
import UpdationDetails2 from "../Common/UpdationDetails2";
import ProjectModal from "../Projects/ProjectModal";
import CompanyProjectsTableBody from "./CompanyProjectsTableBody";
import SearchIcon from "@mui/icons-material/Search";
import { formatFyscalYear } from "../../utils/helper/FormatFiscalYear";
import { Add } from "@mui/icons-material";
import { HiFilter } from "react-icons/hi";
import CompanyProjectFilterModal from "../CompanyFilterComponents/CompanyProjectFilterModal";

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
  addIconStyle: {
    fontSize: "25px",
    fontWeight: "bold",
    strokeWidth: "10px",
    color: "#FFFFFF",
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
}

const tableData = {
  columns: [
    "Project ID",
    "Project Name",
    // "Fiscal Year",
    "SPOC Name",
    "Total Expense",
    "QRE Expense",
    "QRE Potential (%)",
  ],
  rows: [
    {
      id: 1,
      projectName: "Project 1",
      projectId: "000000000011258",
      portfolio: "Rogers",
      accYear: "2022",
      description: "CDU",
      projectManager: "Ezra Romero",
      totalExpense: "$ 15,555.00",
      rndExpense: "$ 5,149.00",
    },
  ],
};

function CompanyProjects({
  data,
  latestUpdateTime,
  modifiedBy,
  comId,
  fetchCompanyProjects,
  callFetchFunction,
  getProjectsFilterState,
  getProjectsSortState
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filteredRows, setFilteredRows] = useState([]);
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  // const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [selectedProjectNames, setSelectedProjectNames] = useState([]);
  const [selectedProjectId, setSetelectedProjectId] = useState([]);
  const [selectedFiscalYear, setSelectedFiscalYear] = useState({});
  const [selectedSpocName, setSelectedSpocName] = useState({});
  const [selectedTotalExpense, setSelectedTotalExpense] = useState({ min: "", max: "" });
  const [selectedRnDExpense, setSelectedRnDExpense] = useState({ min: "", max: "" });
  const [selectedRnDPotential, setSelectedRnDPotential] = useState({ min: "", max: "" });
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
      task?.phone?.toString().toLowerCase().includes(search?.toString()?.toLowerCase()) ||
      task?.spocName?.toString().toLowerCase().includes(search?.toString()?.toLowerCase()) ||
      task?.totalCosts?.toString().toLowerCase().includes(search?.toString()?.toLowerCase()) ||
      task?.rndExpense?.toString().toLowerCase().includes(search?.toString()?.toLowerCase()) ||
      task?.rndPotential?.toString().toLowerCase().includes(search?.toString()?.toLowerCase()) ||
      formatFyscalYear(task?.accountingYear)?.toString().toLowerCase().includes(search?.toString()?.toLowerCase())
    ))
    setFilteredRows(filteredData);
  }, [search, data])

  const handleSearchInputChange = (event) => {
    setSearch(event?.target?.value);
  }

  const handleFilterClick = () => {
    setFilterPanelOpen(!filterPanelOpen);
    setFilterPanelOpen(!filterPanelOpen);
  };

  useEffect(() => {
    getProjectsFilterState(filterParams);
  }, [filterParams]);

  useEffect(() => {
    getProjectsSortState({ sortField: sortField, sortOrder: sortOrder });
    callFetchFunction();
  }, [sortField, sortOrder])

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const fetchSortParams = ({ sortField, sortOrder }) => {
    if (sortField === "Project Name") setSortField("projectName");
    if (sortField === "Project ID") setSortField("projectCode");
    if (sortField === "Fiscal Year") setSortField("fiscalYear");
    if (sortField === "SPOC Name") setSortField("spocName");
    if (sortField === "Total Expense") setSortField("TotalExpense");
    if (sortField === "QRE Expense") setSortField("rndExpense");
    if (sortField === "QRE Potential (%)") setSortField("rndPotential");
    setSortOrder(sortOrder);
  };

  const getFilterParams = (params) => {
    setFilterParams(params);
  }

  const handleFilterClose = () => {
    setFilterPanelOpen(false);
    setFilterPanelOpen(false);
  }

  const applyFilters = () => {
    callFetchFunction();
  }

  const clearFilters = () => {
    setSelectedProjectNames([]);
    setSelectedRnDExpense({ min: "", max: "" });
    setSelectedTotalExpense({ min: "", max: "" });
    setSelectedRnDPotential({ min: "", max: "" });
    setSelectedSpocName([]);
    setSetelectedProjectId([]);
    setTimeout(() => {
      callFetchFunction();
    }, 0)

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

          {/* <UpdationDetails2
            items={data?.length}
            latestUpdateTime={latestUpdateTime}
            modifiedBy={modifiedBy}
          /> */}
          <HiFilter
            style={styleConstants.filterDownloadStyle}
            onClick={handleFilterClick}
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
          {useHasAccessToFeature("F013", "P000000007") && (
            <Tooltip title="Create Project">
              <Button
                sx={{
                  width: "0.5em",
                  height: "2.5em",
                  fontSize: "12px",
                  minWidth: "unset",
                  padding: "10px 20px !important",
                  textTransform: "capitalize",
                  borderRadius: "10px",
                  backgroundColor: "#00A398",
                  color: "white",
                  mr: 2,
                  "&:hover": {
                    backgroundColor: "#00A398",
                  },
                }}
                onClick={() => setModalOpen(!modalOpen)}
              >
                <Add style={styleConstants.addIconStyle} />
              </Button>
            </Tooltip>
          )}
          <ProjectModal
            open={modalOpen}
            handleClose={handleModalClose}
            comId={comId}
            fetchProjectData={fetchCompanyProjects}
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
        {filterPanelOpen && <CompanyProjectFilterModal open={filterPanelOpen} handleClose={handleFilterClose} style={{ position: 'absolute', left: 0 }} companyId={comId} getFilterParams={getFilterParams} setSelectedProjectNames={setSelectedProjectNames} setSetelectedProjectId={setSetelectedProjectId} setSelectedFiscalYear={setSelectedFiscalYear} setSelectedSpocName={setSelectedSpocName} setSelectedTotalExpense={setSelectedTotalExpense} setSelectedRnDExpense={setSelectedRnDExpense} setSelectedRnDPotential={setSelectedRnDPotential} selectedProjectNames={selectedProjectNames} selectedProjectId={selectedProjectId} selectedFiscalYear={selectedFiscalYear} selectedSpocName={selectedSpocName} selectedTotalExpense={selectedTotalExpense} selectedRnDExpense={selectedRnDExpense} selectedRnDPotential={selectedRnDPotential} applyFilters={applyFilters} clearFilters={clearFilters} />}
      </Drawer>
      <Box >
        <TableContainer
          sx={{
            width: filterPanelOpen ? "calc(100% - 280px)" : "100%",
            overflowX: "auto",
            maxHeight: "50vh",
            flexGrow: 1,
            marginLeft: filterPanelOpen ? '280px' : '0',
            borderTopLeftRadius: filterPanelOpen ? "20px" : "0",
            borderTopRightRadius: filterPanelOpen ? "20px" : "0",
            overflow: "hidden",
            maxHeight: '50vh', // Controls the scrollable area height
            overflowY: 'auto', // Enables vertical scrolling
          }}
        >
          <Table stickyHeader aria-label="simple table">
            <MiniTableHeader tableData={tableData} fetchSortParams={fetchSortParams} />

            <CompanyProjectsTableBody filledRows={filteredRows}
              fetchCompanyProjects={fetchCompanyProjects}
            />

          </Table>
        </TableContainer>
      </Box>
    </>
  );
}

export default CompanyProjects;