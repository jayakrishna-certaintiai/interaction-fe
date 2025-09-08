import AddIcon from "@mui/icons-material/Add";
import { Box, Button, Drawer, InputAdornment, InputBase, Table, TableContainer, Tooltip } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { BaseURL } from "../../constants/Baseurl";
import MiniTableHeader from "../Common/MiniTableHeader";
import UpdationDetails2 from "../Common/UpdationDetails2";
import ContactModal from "../Contacts/ContactModal";
import CompanyDetailsTableBody from "./CompanyDetailsTableBody";
import { useHasAccessToFeature } from "../../utils/helper/HasAccessToFeature";
import { Authorization_header } from "../../utils/helper/Constant";
import SearchIcon from "@mui/icons-material/Search";
import { Add } from "@mui/icons-material";
import { HiFilter } from "react-icons/hi";
import CompanyContactFilterModal from "../CompanyFilterComponents/CompanyContactFilterModal";

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
  columns: ["Employee Id", "Employee Name", "Employee Title", "Employement Type", "Email Address"],
  rows: [
    {
      id: 1,
      name: "Adam Smith",
      title: "Finance Head",
      phone: "(336) 222-7000",
      email: "adam.smith@apple.com",
    },
  ],
};

function CompanyContacts({
  data,
  latestUpdateTime,
  modifiedBy,
  comId,
  callFetchFunction,
  getEmployeeFilterState,
  getEmployeeSortState,

}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [clientsData, setClientsData] = useState(null);
  const [search, setSearch] = useState("");
  const [filteredRows, setFilteredRows] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  // const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [selectedContactNames, setSelectedContactNames] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState([]);
  const [selectedEmployeeEmail, setSelectedEmployeeEmail] = useState([]);
  const [selectedEmployeeTitle, setSelectedEmployeeTitle] = useState([]);
  const [selectedEmployementType, setSelectedEmployementType] = useState([]);
  const [filterParams, setFilterParams] = useState([]);

  useEffect(() => {
    document.body.style.overflow = filterPanelOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [filterPanelOpen]);

  useEffect(() => {
    switch (sortField) {
      case "Name":
        getEmployeeSortState({ sortField: "name", sortOrder: sortOrder });
        break;
      case "Employee Id":
        getEmployeeSortState({ sortField: "employeeId", sortOrder: sortOrder });
        break;
      case "Employee Title":
        getEmployeeSortState({ sortField: "employeeTitle", sortOrder: sortOrder });
        break;
      case "Employement Type":
        getEmployeeSortState({ sortField: "employementType", sortOrder: sortOrder });
        break;
      case "Email Address":
        getEmployeeSortState({ sortField: "email", sortOrder: sortOrder });
        break;
      case "Employee Name":
        getEmployeeSortState({ sortField: "name", sortOrder: sortOrder });
        break;
      default:
        getEmployeeSortState({ sortField: "", sortOrder: "" });
    }
    callFetchFunction();
  }, [sortField, sortOrder]);

  useEffect(() => {

    getEmployeeFilterState(filterParams);
  }, [filterParams])

  const clearFilters = () => {
    setSelectedContactNames([]);
    setSelectedEmployeeEmail([]);
    setSelectedEmployeeId([]);
    setSelectedEmployeeTitle([]);
    setSelectedEmployementType([]);
    setTimeout(() => {
      callFetchFunction();
    }, 0)

  };

  const applyFilters = () => {
    callFetchFunction();
  }

  const getFilterParams = (params) => {

    setFilterParams(params);
  }

  const handleSearchInputChange = (event) => {
    setSearch(event?.target?.value);
  }

  const handleFilterClick = () => {
    setFilterPanelOpen(!filterPanelOpen);
    setFilterPanelOpen(!filterPanelOpen);
  }

  const handleFilterClose = () => {
    setFilterPanelOpen(false);
    setFilterPanelOpen(false);
  }

  useEffect(() => {
    const filteredData = data?.filter(task => (
      task?.firstName?.toString()?.toLowerCase()?.includes(search?.toString()?.toLowerCase()) ||
      task?.lastName?.toString()?.toLowerCase()?.includes(search?.toString()?.toLowerCase()) ||
      (task?.firstName + " " + task?.lastName)?.toString()?.toLowerCase()?.includes(search?.toString()?.toLowerCase()) ||
      task?.employeeTitle?.toString()?.toLowerCase().includes(search?.toString()?.toLowerCase()) ||
      task?.employementType?.toString()?.toLowerCase().includes(search?.toString()?.toLowerCase()) ||
      task?.phone?.toString().toLowerCase().includes(search?.toString()?.toLowerCase()) ||
      task?.email?.toString().toLowerCase().includes(search?.toString().toLowerCase()) ||
      task?.companyId?.toString().toLowerCase().includes(search?.toString()?.toLowerCase()) ||
      task?.employeeId?.toString().toLowerCase().includes(search?.toString()?.toLowerCase()) 
    ))
    setFilteredRows(filteredData);
  }, [search, data])

  const fetchSortParams = ({ sortField, sortOrder }) => {

    setSortField(sortField);
    setSortOrder(sortOrder);
  };

  const addContact = async (contactInfo) => {
    const apiUrl = `${BaseURL}/api/v1/contacts/${localStorage.getItem(
      "userid"
    )}/${comId}/create-contact`;

    try {
      const response = await axios.post(apiUrl, contactInfo, Authorization_header());
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const handleAddContact = async (contactInfo) => {
    toast
      .promise(addContact(contactInfo), {
        loading: "Adding New Employee...",
        success: (data) => data?.message || "Employee added successfully",
        error: (error) =>
          error.response?.data?.error?.message || "Failed to add Employee.",
      })
      .then(() => {
        callFetchFunction();
      })
      .catch((error) => {
        console.error("Employee addition failed:", error);
      });
  };

  const handleModalClose = () => {
    setModalOpen(false);
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
          <HiFilter
            style={styleConstants.filterDownloadStyle}
            onClick={handleFilterClick}
          />
          {/* <UpdationDetails2
            items={data?.length}
            latestUpdateTime={latestUpdateTime}
            modifiedBy={modifiedBy}
          /> */}
          {useHasAccessToFeature("F011", "P000000007") && (
            <>
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
              <Tooltip title="Create Contact">
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
            </>
          )}
          <ContactModal
            open={modalOpen}
            handleClose={handleModalClose}
            onAddContact={handleAddContact}
            clients={clientsData}
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
        {filterPanelOpen && <CompanyContactFilterModal open={filterPanelOpen} handleClose={handleFilterClose} style={{ position: 'absolute', left: 0 }} companyId={comId} getFilterParams={getFilterParams} setSelectedContactNames={setSelectedContactNames} setSelectedEmployeeId={setSelectedEmployeeId} setSelectedEmployeeEmail={setSelectedEmployeeEmail} setSelectedEmployementType={setSelectedEmployementType} setSelectedEmployeeTitle={setSelectedEmployeeTitle} selectedContactNames={selectedContactNames} selectedEmployeeId={selectedEmployeeId} selectedEmployeeEmail={selectedEmployeeEmail} selectedEmployeeTitle={selectedEmployeeTitle} selectedEmployementType={selectedEmployementType} applyFilters={applyFilters} clearFilters={clearFilters} />}
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
            borderTopRightRadius: filterPanelOpen ? "20px" : "0",
            // overflow: "hidden",
            maxHeight: '50vh', // Controls the scrollable area height
            overflowY: 'auto', // Enables vertical scrolling
          }}
        >
          <Table aria-label="simple table" stickyHeader>
            <MiniTableHeader tableData={tableData} fetchSortParams={fetchSortParams} />
            <CompanyDetailsTableBody filledRows={filteredRows} />
          </Table>
        </TableContainer>
      </Box>
      <Toaster />
    </>
  );
}

export default CompanyContacts;
