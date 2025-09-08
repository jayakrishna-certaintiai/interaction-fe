import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  InputAdornment,
  InputBase,
  Table,
  TableContainer,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { HiFilter } from "react-icons/hi";
import { UserManagementContext } from "../../../context/UserManagementContext";
import { useHasAccessToFeature } from "../../../utils/helper/HasAccessToFeature";
import CustomPagination from "../../Common/CustomPagination";
import TableHeader2 from "../../Common/TableHeader2";
import FilledButton from "../../button/FilledButton";
import UserManagementModal from "./UserManagementModal";
import UserManagementTableBody from "./UserManagementTableBody";
import FilterPanel from "../../Common/FilterPanel";
import { areFiltersApplied } from "../../../utils/helper/AreFiltersApplied";
import toast, { Toaster } from "react-hot-toast";
import { formatFilters } from "../../../utils/helper/FormatFilters";

const styles = {
  box1Style: {
    display: "flex",
    justifyContent: "space-between",
    px: 2,
    pt: 2,
    // borderBottom: "1px solid #E4E4E4",
    alignItems: "center",
  },
  newCompanyButtonStyle: {
    textTransform: "capitalize",
    borderRadius: "20px",
    backgroundColor: "#00A398",
    mr: 2,
    "&:hover": {
      backgroundColor: "#00A398",
    },
  },
  iconStyle: { fontSize: "17px", marginRight: "3px" },
  searchIconStyle: {
    color: "#9F9F9F",
    ml: "3px",
    mr: "-3px",
    width: "20px",
    height: "20px",
  },
  inputStyle: {
    borderRadius: "20px",
    width: "55%",
    height: "32px",
    border: "1px solid #9F9F9F",
  },
  filterDownloadStyle: {
    color: "white",
    borderRadius: "50%",
    backgroundColor: "#00A398",
    fontSize: "28px",
    padding: "5px",
    cursor: "pointer",
  },
};

const tableData = {
  columns: [
    "Name",
    "Account",
    "Title",
    "User Role",
    "Status",
    "Email Address",
    // "Last Signin Activity",
    "",
  ],
  rows: [
    {
      id: 1,
      name: "Adam Smith",
      client: "Apple Inc.",
      title: "Finance Head",
      userRole: "Admin",
      status: "Activation Pending",
      email: "adam.smith@apple.com",
      lastSignin: "Signed out 18/11/2023 12:34:26",
      session: "",
    },
  ],
};

function UserManagement() {
  const {
    userList,
    fetchUsers,
    userFilterState,
    setUserFilterState,
    isUserFilterApplied,
    setIsUserFilterApplied,
    triggerUserClearFilters,
  } = useContext(UserManagementContext);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [search, setSearch] = useState("");
  const [filteredRows, setFilteredRows] = useState([]);
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [appliedFilterState, setAppliedFilterState] = useState({
    clients: [],
    title: [],
    role: [],
    status: "",
    clientName: "",
    titleName: "",
    roleType: "",
    statusType: "",
  });

  const totalPages = Math.ceil(filteredRows?.length / itemsPerPage);

  const appliedFilters = {
    Client: userFilterState.clientName,
    Title: userFilterState.titleName,
    Role: userFilterState.roleType,
    Status: userFilterState.statusType,
  };

  useEffect(() => {
    const shouldFetchWithFiltersUsers =
      userFilterState.clients.length > 0 ||
      userFilterState.title.length > 0 ||
      userFilterState.role.length > 0 ||
      userFilterState.status !== "";
    if (shouldFetchWithFiltersUsers) {
      let options = {
        ...(userFilterState.clients.length > 0 && {
          clients: userFilterState.clients,
        }),
        ...(userFilterState.title.length > 0 && {
          title: userFilterState.title,
        }),
        ...(userFilterState.role.length > 0 && {
          role: userFilterState.role,
        }),
        ...(userFilterState.status !== "" && {
          status: userFilterState.status,
        }),
        // ...(userFilterState.status !== "" && {
        //   status: [userFilterState.status],
        // }),
      };
      fetchUsers(options);
    } else {
      fetchUsers();
    }
  }, [appliedFilterState]);

  const applyFiltersAndFetch = (filters) => {
    if (areFiltersApplied(appliedFilters)) {
      fetchUsers(filters);
      setAppliedFilterState(userFilterState);
      setIsUserFilterApplied(true);
    } else {
      toast.error("Please select at least one filter.");
    }
  };

  const handleChangePage = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleChangeItemsPerPage = (items) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  useEffect(() => {
    fetchUsers();
  }, [localStorage?.getItem("keys")]);

  let currentData = filteredRows?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Ensuring currentData always has 20 items
  const placeholderRow = {};
  while (currentData?.length < itemsPerPage) {
    currentData.push(placeholderRow);
  }

  const handleUploadClick = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    if (userList) {
      const filteredData = userList?.filter(
        (task) =>
          task?.firstName?.toLowerCase()?.includes(search?.toLowerCase()) ||
          task?.lastName?.toLowerCase()?.includes(search?.toLowerCase()) ||
          task?.description?.toLowerCase()?.includes(search?.toLowerCase()) ||
          task?.email?.toLowerCase()?.includes(search?.toLowerCase()) ||
          task?.role?.toLowerCase()?.includes(search?.toLowerCase()) ||
          task?.employeeTitle?.toLowerCase()?.includes(search?.toLowerCase()) ||
          task?.status?.toLowerCase()?.includes(search?.toLowerCase())
      );
      setFilteredRows(filteredData);
      setCurrentPage(1);
    }
  }, [userList, search]);

  const isCreate = useHasAccessToFeature("F001", "P000000007");
  const isSearch = useHasAccessToFeature("F001", "P000000009");

  const handleFilterClick = () => {
    setFilterPanelOpen(!filterPanelOpen);
  };

  const handleFilterClose = () => {
    setFilterPanelOpen(false);
  };

  const clearFilters = () => {
    setUserFilterState({
      clients: [],
      title: [],
      role: [],
      status: "",
      clientName: "",
      titleName: "",
      roleType: "",
      statusType: "",
    });
    applyFiltersAndFetch({});
    triggerUserClearFilters();
    setIsUserFilterApplied(false);
  };


  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", mb: 1 }}>
        <Box sx={styles.box1Style}>
          <Typography sx={{ fontSize: "23px", fontWeight: "500" }}>
            User Management
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {isCreate && (
              <FilledButton
                btnname={"New User"}
                onClick={handleUploadClick}
                width="130px"
              />
            )}
            {isSearch && (
              <>
                <InputBase
                  type="text"
                  placeholder="Search..."
                  onChange={handleSearch}
                  startAdornment={
                    <InputAdornment position="start">
                      <SearchIcon sx={styles.searchIconStyle} />
                    </InputAdornment>
                  }
                  sx={styles.inputStyle}
                />
                {/* <HiFilter
                  style={styles.filterDownloadStyle}
                  onClick={handleFilterClick}
                /> */}
                {/* {filterPanelOpen && (
                  <FilterPanel
                    handleClose={handleFilterClose}
                    open={filterPanelOpen}
                    page={"user management"}
                    onApplyFilters={applyFiltersAndFetch}
                  />
                )} */}
              </>
            )}
          </Box>
          <UserManagementModal
            open={modalOpen}
            handleClose={handleModalClose}
            fetchUsersList={fetchUsers}
          />
        </Box>
        <Typography sx={{ px: 2, fontSize: "13px", color: "#9F9F9F" }}>
          {areFiltersApplied(appliedFilters) && isUserFilterApplied && (
            <>
              <span>Filtered By {formatFilters(appliedFilters)}</span>
              <span
                style={{
                  color: "#FD5707",
                  fontSize: "13px",
                  marginLeft: "5px",
                  fontWeight: "500",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
                onClick={clearFilters}
              >
                Clear Filters
              </span>
            </>
          )}
        </Typography>
      </Box>
      {useHasAccessToFeature("F001", "P000000008") && (
        <Box>
          <TableContainer
            sx={{
              width: "100%",
              maxHeight: "89.5vh",
              overflowX: "auto",
            }}
          >
            <Table
              sx={{ minWidth: 650 }}
              aria-label="simple table"
              stickyHeader
            >
              <TableHeader2 tableData={tableData} />
              <UserManagementTableBody
                filledRows={currentData}
                fetchUsers={fetchUsers}
              />
            </Table>
          </TableContainer>
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            changePage={handleChangePage}
            changeItemsPerPage={handleChangeItemsPerPage}
            minRows={20}
          />
        </Box>
      )}
      <Toaster />
    </>
  );
}

export default UserManagement;
