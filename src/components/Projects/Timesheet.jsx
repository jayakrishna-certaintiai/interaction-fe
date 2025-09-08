import { Box, InputAdornment, InputBase, Table, TableContainer, TablePagination, Drawer, Badge } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import UpdationDetails2 from "../Common/UpdationDetails2";
import PanelTableHeader from "../Timesheets/MainPanel/PanelTableHeader";
import MiniTimesheetTableBody from "./MiniTimesheetTableBody";
import SearchIcon from "@mui/icons-material/Search";
import FormatDatetime from "../../utils/helper/FormatDatetime";
import { HiFilter } from "react-icons/hi";
import { areFiltersApplied } from "../../utils/helper/AreFiltersApplied";
import { ProjectContext } from "../../context/ProjectContext";
import Teamfilters from "../FilterComponents/Teamfilters";
import ProjectTimesheetFilter from "../FilterComponents/ProjectTimesheetFilter";


const styleConstants = {
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
  }, filterDownloadStyle: {
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
}

const tableData = {
  columns: [
    "Timesheet",
    "Status",
    // "Uploaded By",
    "Uploaded On",
    "Total Hours"
  ],
  rows: [
    {
      id: 1,
      month: "Nov 2023",
      status: "Pending",
      timesheet: "",
      uploadedOn: "",
      uploads: "",
      rndHours: "",
      rndExpense: "",
      uncertainHrs: "",
      reconciledHrs: "",
    },
    {
      id: 2,
      month: "Oct 2023",
      status: "Uploaded",
      timesheet: "TS_Oct23",
      uploadedOn: "28/10/2023",
      uploads: "1",
      rndHours: "285",
      rndExpense: "$1300",
      uncertainHrs: "26",
      reconciledHrs: "0",
    },
    {
      id: 3,
      month: "Sep 2023",
      status: "Uploaded",
      timesheet: "TS_Sep23",
      uploadedOn: "29/09/2023",
      uploads: "3",
      rndHours: "456",
      rndExpense: "$1729",
      uncertainHrs: "0",
      reconciledHrs: "42",
    },
    {
      id: 4,
      month: "Aug 2023",
      status: "Uploaded",
      timesheet: "TS_Aug23",
      uploadedOn: "26/08/2023",
      uploads: "1",
      rndHours: "231",
      rndExpense: "$982",
      uncertainHrs: "0",
      reconciledHrs: "56",
    },
  ],
};

function Timesheet({ timesheetData, fetchTimesheetData, projectId, getTimeSheetSortParams }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filteredProjectTimeheet, setFilteredProjectTimeheet] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredRow, setFilteredRows] = useState([]);
  const [filterClicked, setFilterClicked] = useState(false);
  // const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [filterPanelOpen, setFilterPanelOpen] = useState(false)
  const { projectFilterState } = useContext(ProjectContext);

  useEffect(() => {
    document.body.style.overflow = filterPanelOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [filterPanelOpen]);

  useEffect(() => {
    const filteredData = timesheetData?.filter(task => (
      task?.status?.toString()?.trim()?.toLowerCase()?.includes(search?.toString()?.toLowerCase()) ||
      task?.uploadedOn?.toString()?.toLowerCase().includes(search?.toString()?.toLowerCase()) ||
      task?.originalFileName?.toString().toLowerCase().includes(search?.toString()?.toLowerCase()) ||
      FormatDatetime(task?.uploadedOn)?.toString().toLowerCase().includes(search?.toString()?.toLowerCase()) ||
      task?.totalhours?.toString().toLowerCase().includes(search?.toString()?.toLowerCase())
    ))
    setFilteredRows(filteredData);
  }, [search, timesheetData])

  const handleSearchInputChange = (event) => {
    setSearch(event?.target?.value);
  }



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
      setFilteredProjectTimeheet(filteredData);
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
    if (Array.isArray(projectFilterState?.status)) {
      if (projectFilterState.status.some(status => status?.trim() !== "")) {
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

    if (Array.isArray(projectFilterState?.totalhours)) {
      if (projectFilterState.totalhours.some(totalhours => totalhours > 0)) {
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
          display: "flex", justifyContent: "space-between"
        }}
      > <Box sx={{ display: "flex", justifyContent: "space-between" }}>
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
                <ProjectTimesheetFilter
                  handleClose={handleFilterPanelClose}
                  open={filterPanelOpen}
                  page={page}
                  fetchTimesheetData={fetchTimesheetData}
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
        <TableContainer sx={{
          maxHeight: "82vh",
          overflowY: "auto",
          borderTopLeftRadius: "20px",
          height: 300,
        }}>
          <Table stickyHeader aria-label="simple table">
            <PanelTableHeader tableData={tableData} fetchSortParams={getTimeSheetSortParams} />
            <MiniTimesheetTableBody filledRows={filteredProjectTimeheet} rowsPerPage={rowsPerPage} />
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          component="div"
          count={timesheetData?.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </>
  );
}

export default Timesheet;
