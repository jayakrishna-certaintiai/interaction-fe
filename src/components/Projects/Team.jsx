import React, { useContext, useEffect, useState } from "react";
import { Box, Button, InputAdornment, InputBase, Table, TableContainer, TablePagination, Drawer, Badge, Tooltip } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import UpdationDetails2 from "../Common/UpdationDetails2";
import AddIcon from "@mui/icons-material/Add";
import MiniTableHeader from "../Common/MiniTableHeader";
import TeamTableBody from "./TeamTableBody";
import TeamModal from "./Team/TeamModal";
import { useHasAccessToFeature } from "../../utils/helper/HasAccessToFeature";
import { ProjectContext } from "../../context/ProjectContext";
import { HiFilter } from "react-icons/hi";
import { areFiltersApplied } from "../../utils/helper/AreFiltersApplied";
import Teamfilters from "../FilterComponents/Teamfilters";
import { Add } from "@mui/icons-material";

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
};

const styles = {
  inputBase: {
    borderRadius: "20px",
    height: "40px",
    border: "1px solid #E4E4E4",
    pl: 1,
    width: "200px",
  },
  addIconStyle: {
    fontSize: "25px",
    fontWeight: "bold",
    strokeWidth: "10px",
    color: "#FFFFFF",
  },
}

const tableData = {
  columns: [
    "Employee ID",
    "Employee Name",
    "Employement Type",
    "Designation",
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

function Team({
  teamData,
  projectId,
  fetchTeamData,
  details,
  symbol,
  getTeamSortParams,
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filteredProjectTeam, setFilteredProjectTeam] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredRow, setFilteredRows] = useState([]);
  const [filterClicked, setFilterClicked] = useState(false);
  // const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  // const [projectSortParams, setProjectSortParams] = useState({ sortField: null, sortOrder: null });
  const { projectFilterState } = useContext(ProjectContext);

  useEffect(() => {
    document.body.style.overflow = filterPanelOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [filterPanelOpen]);

  //update data after filter applied
  useEffect(() => {
    const filteredData = teamData?.filter(task => (
      task?.employeeId?.toString()?.toLowerCase()?.includes(search?.toString()?.toLowerCase()) ||
      task?.firstName?.toString()?.trim()?.toLowerCase()?.includes(search?.toString()?.toLowerCase()) ||
      task?.lastName?.toString()?.trim()?.toLowerCase()?.includes(search?.toString()?.toLowerCase()) ||
      task?.employementType?.toString()?.toLowerCase().includes(search?.toString()?.toLowerCase()) ||
      task?.employeeTitle?.toString()?.toLowerCase().includes(search?.toString()?.toLowerCase()) ||
      task?.totalHours?.toString().toLowerCase().includes(search?.toString()?.toLowerCase()) ||
      task?.hourlyRate?.toString().toLowerCase().includes(search?.toString()?.toLowerCase()) ||
      task?.totalCost?.toString().toLowerCase().includes(search?.toString()?.toLowerCase()) ||
      task?.rndPotential?.toString().toLowerCase().includes(search?.toString()?.toLowerCase()) ||
      task?.rndCredits?.toString().toLowerCase().includes(search?.toString()?.toLowerCase()) ||
      task?.qreCost?.toString().toLowerCase().includes(search?.toString()?.toLowerCase())
    ))
    setFilteredRows(filteredData);
  }, [search, teamData])

  const handleSearchInputChange = (event) => {
    setSearch(event?.target?.value);
  }

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };



  useEffect(() => {
    if (filteredRow) {
      const filteredData = filteredRow?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      setFilteredProjectTeam(filteredData);
    }
  }, [filteredRow, page, rowsPerPage]);

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

    if (Array.isArray(projectFilterState?.projectRoles)) {
      if (projectFilterState.projectRoles.some(projectRoles => projectRoles?.trim() !== "")) {
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
    if (Array.isArray(projectFilterState?.totalHourlyrate)) {
      if (projectFilterState.totalHourlyrate.some(totalHourlyrate => totalHourlyrate > 0)) {
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
            <Box sx={{ marginLeft: "10px", marginTop: "-7px", display: "flex", alignItems: "center" }}>
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
                <Teamfilters
                  handleClose={handleFilterPanelClose}
                  open={filterPanelOpen}
                  page={page}
                  fetchTeamData={fetchTeamData}
                  onApplyFilters={applyFiltersAndFetch}
                  appliedFilters={appliedFilters}
                  style={{ position: 'fixed', left: 0, marginTop: 10 }}
                  projectId={projectId}
                />
              )}
            </Drawer>
          </Box>
          {useHasAccessToFeature("F017", "P000000007") && (
            <Tooltip title="Add Team Member">
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
          <InputBase
            type="text"
            placeholder="Search..."
            onChange={handleSearchInputChange}
            startAdornment={
              <InputAdornment position="start">
                <SearchIcon sx={styleConstants.searchIconStyle} />
              </InputAdornment>
            }
            // sx={styleConstants.inputStyle}
            sx={{
              ...styles.inputBase,
              width: "30%",
              height: "33px",
              alignItems: "right",
              mr: 1,
              ml: "-27em"
            }}
          />

          {/* {useHasAccessToFeature("F017", "P000000007") && (
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
          )} */}
          <TeamModal
            fetchTeamData={fetchTeamData}
            open={modalOpen}
            handleClose={handleModalClose}
            details={details}
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
        <TableContainer sx={{
          maxHeight: "82vh",
          overflowY: "auto",
          borderTopLeftRadius: "20px",
          height: 300,
        }}>
          <Table stickyHeader aria-label="simple table">
            <MiniTableHeader tableData={tableData} fetchSortParams={getTeamSortParams} />
            <TeamTableBody filledRows={filteredProjectTeam} rowsPerPage={rowsPerPage} symbol={symbol} />
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          component="div"
          count={teamData?.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </>
  );
}

export default Team;
