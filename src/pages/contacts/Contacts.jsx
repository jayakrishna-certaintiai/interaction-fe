import { CircularProgress, Paper, Table, TableContainer, Box, Drawer, Badge, ThemeProvider, Typography, createTheme } from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import CustomPagination from "../../components/Common/CustomPagination";
import TableHeader from "../../components/Common/TableHeader";
import TableIntro from "../../components/Common/TableIntro";
import ContactModal from "../../components/Contacts/ContactModal";
import ContactsTableBody from "../../components/Contacts/ContactsTableBody";
import usePinnedData from "../../components/CustomHooks/usePinnedData";
import { BaseURL } from "../../constants/Baseurl";
import { ContactContext } from "../../context/ContactContext";
import { FilterListContext } from "../../context/FiltersListContext";
import { areFiltersApplied } from "../../utils/helper/AreFiltersApplied";
import { useHasAccessToFeature } from "../../utils/helper/HasAccessToFeature";
import { updateTimeDifference } from "../../utils/helper/UpdateTimeDifference";
import { Authorization_header, token_obj } from "../../utils/helper/Constant";
import ContactAddModal from "../../components/Contacts/ContactAddModal";
import { EmployeeContext } from "../../context/EmployeeContext";
import { HiFilter } from "react-icons/hi";
import ContactFilters from "../../components/Contacts/ContactFilters";
import { postRecentlyViewed } from "../../utils/helper/PostRecentlyViewed";
import { DataGrid, GridToolbarColumnsButton } from "@mui/x-data-grid";
import StraightIcon from '@mui/icons-material/Straight';
import { useNavigate } from "react-router-dom";

const tableData = {
  columns: ["Employee ID", "Name", "Employement Type", "Employee Title", "Account"],
  rows: [
    {
      id: 1,
      name: "Adam Smith",
      title: "Finance Head",
      role: "Finance Head",
      company: "Apple Inc.",
      phone: "(336) 222-7000",
      emailAddress: "adam.smith@apple.com",
      rndExpense: "$ 12,213.59",
    },
  ],
};
const styleConstants = {
  filterDownloadStyle: {
    color: "white",
    borderRadius: "50%",
    backgroundColor: "#00A398",
    fontSize: "28px",
    padding: "5px",
    marginRight: "16px",
    cursor: "pointer",
    // opacity: opacityValue,
  },
  tableContainerStyle: {
    borderLeft: "1px solid #E4E4E4",
    // backgroundColor: `rgba(255, 255, 255, ${opacityValue})`, 
  },
};
const headerCellStyle = {
  fontSize: "13px",
  borderRight: "1px solid #ddd",
  borderLeft: "1px solid #ddd",
  whiteSpace: "nowrap",
  py: 0.8,
  textAlign: "left",
  position: "sticky",
  top: 0,
  zIndex: 10,
  backgroundColor: "#ececec",
  cursor: "pointer",
};
const theme = createTheme({
  components: {
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: '#00A398 !important',
          height: '-5em',
        },
        checked: {
          color: '#00A398 !important',
        },
        menu: {
          sx: {
            width: '150px',
            fontSize: '12px',
            padding: '4px 8px',
          },
        },
      },
    },
  },
});
function Contacts(page = "Employees", documentType = "") {
  const navigate = useNavigate();
  const { pinnedObject } = usePinnedData();
  const { clientList, fetchUserDetails } = useContext(FilterListContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filteredRows, setFilteredRows] = useState([]);
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [latestUpdateTime, setLatestUpdateTime] = useState("Just now");
  const { fetchEmployeesSheets, employeesSheets } = useContext(EmployeeContext);
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const [selectedTab, setSelectedTab] = useState("All Employees");
  const {
    contactData,
    fetchContactData,
    getEmployeeSortParams,
    contactFilterState,
    getContactData,
    setIsContactFilterApplied,
    setCurrentState,
    currentState,
    loading,
  } = useContext(ContactContext);
  const [pinStates, setPinStates] = useState({
    "All Employees": false,
    "Recently Viewed": false,
  });
  const fieldNameMapping = {
    employeeid: "employeeId",
    contactid: "contactId",
    name: "firstName",
    employementtype: "employementType",
    employeetitle: "employeeTitle",
    account: "companyName",
    companyid: "companyId",
  };
  const sortFieldUiMapping = {
    name: "name",
    employeeid: "employeeId",
    employementtype: "employementType",
    employeetitle: "employeeTitle",
    account: "companyName",
  };
  const removeSpecialCharsAndLowerCase = (str) => {
    return str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "");
  };
  useEffect(() => {
    if (Array.isArray(contactData)) {
      const mappedRows = contactData.map((row) => {
        const mappedRow = {};
        Object.keys(fieldNameMapping).forEach((field) => {
          const mappedField = fieldNameMapping[field];
          mappedRow[field] = row[mappedField] || "";
        });
        mappedRow.id = row.contactId || `generated-id-${row.contactId}`;
        return mappedRow;
      });
      if (search) {
        const lowerCaseSearch = search.toLowerCase();
        const filteredData = mappedRows.filter((row) =>
          Object.values(row)
            .filter(Boolean)
            .some((value) =>
              removeSpecialCharsAndLowerCase(value.toString()).includes(removeSpecialCharsAndLowerCase(lowerCaseSearch))
            )
        );
        setFilteredRows(filteredData.length > 0 ? filteredData : []);
      } else {
        setFilteredRows(mappedRows);
      }
    } else {
      setFilteredRows([]);
    }
  }, [contactData, search]);
  const mappedRows = Array.isArray(contactData)
    ? contactData.map((row) => {
      const mappedRow = {};
      Object.keys(fieldNameMapping).forEach((field) => {
        const mappedField = fieldNameMapping[field];
        mappedRow[field] = row[mappedField] || "";
      });
      mappedRow.id = row.contactid;
      return mappedRow;
    })
    : [];
  const [rows, setRows] = useState(mappedRows);
  const handleColumnClick = (col) => {
    const fieldName = removeSpecialCharsAndLowerCase(col);
    const mappedField = sortFieldUiMapping[fieldName];
    if (sortField === mappedField) {
      if (sortOrder === "asc") {
        setSortOrder("dsc");
      } else if (sortOrder === "dsc") {
        setSortOrder(null);
        setSortField(null);
      } else {
        setSortOrder("asc");
      }
    } else {
      setSortField(mappedField);
      setSortOrder("asc");
    }
  };
  useEffect(() => {
    if (Object.keys(page).length === 0) {
      getEmployeeSortParams({ sortField, sortOrder });
      const options = {
        sortField,
        sortOrder,
      };
      fetchContactData(options);
    }
  }, [sortField, sortOrder, page]);

  const renderSortIcons = (column, index) => {
    const fieldName = removeSpecialCharsAndLowerCase(column);
    const mappedField = sortFieldUiMapping[fieldName];
    let upColor = activeColor;
    let downColor = activeColor;
    let upOpacity = 0.6;
    let downOpacity = 0.6;
    if (sortField === mappedField) {
      if (sortOrder === "asc") {
        upColor = "#FD5707";
        downColor = inactiveColor;
        upOpacity = 10.8;
        downOpacity = 0.8;
      } else if (sortOrder === "dsc") {
        upColor = inactiveColor;
        downColor = "#FD5707";
        upOpacity = 0.2;
        downOpacity = 0.8;
      }
    }

    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <StraightIcon
          fontSize="small"
          style={{
            color: upColor,
            opacity: upOpacity,
            marginRight: -5,
            fontSize: "17px",
          }}
          onClick={() => handleColumnClick(column)}
        />
        <StraightIcon
          fontSize="small"
          style={{
            color: downColor,
            opacity: downOpacity,
            marginLeft: -5,
            fontSize: "17px",
            transform: "rotate(180deg)",
          }}
          onClick={() => handleColumnClick(column)}
        />
      </Box>
    );
  };
  const sortRows = (rows) => {
    if (!sortField || !sortOrder) return rows;
    return [...rows].sort((a, b) => {
      const fieldA = a[sortField];
      const fieldB = b[sortField];
      if (fieldA < fieldB) {
        return sortOrder === "asc" ? -1 : 1;
      }
      if (fieldA > fieldB) {
        return sortOrder === "asc" ? 1 : -1;
      }
      return 0;
    });
  };

  useEffect(() => {
    const sortedRows = sortRows(rows);
    setRows(sortedRows);
  }, [sortField, sortOrder]);

  const columns = tableData.columns.map((col) => {
    const fieldName = removeSpecialCharsAndLowerCase(col);
    const mappedField = fieldNameMapping[fieldName];
    return {
      field: fieldName,
      headerName: col,
      flex: 1,
      sortable: false,
      headerAlign: 'center',
      renderHeader: () => (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {col}
          {renderSortIcons(col, mappedField)}
        </Box>
      ),
      renderCell: (params) => {
        const cellStyle = {
          backgroundColor: "transparent",
          padding: "0px",
        };
        const isCentered = ["autosendinteraction"].includes(params.field);
        const displayValue = params.value;

        if (
          params.field === "employeeid" ||
          params.field === "account" ||
          params.field === ""
        ) {
          return (
            <Typography
              className="value-text"
              sx={{
                justifyContent: isCentered ? "center" : "flex-start",
                display: "flex",
                alignItems: "center",
                height: "100%",
                width: "100%",
                padding: "0 10px",
                textOverflow: "ellipsis",
                overflow: "hidden",
                color: "#00A398",
                textDecoration: "underline",
                fontSize: "13px",
                lineHeight: 2.5,
                marginBottom: "0",
                ...cellStyle,
              }}
              title={displayValue}
            >
              {displayValue}
            </Typography>
          );
        }

        return (
          <div style={cellStyle}>
            {displayValue}
          </div>
        );
      }
    };
  });

  const activeColor = "#404040";
  const inactiveColor = "#ccc";
  let upColor = activeColor;
  let downColor = activeColor;
  if (sortField === columns) {
    if (sortOrder === "asc") {
      downColor = "#FD5707";
      upColor = inactiveColor;
    } else if (sortOrder === "dsc") {
      upColor = "#FD5707";
      downColor = inactiveColor;
    }
  }
  const handleProjectClick = (id) => {
    (async () => {
      await postRecentlyViewed(id, "employee");
      navigate(`/employees/info?contactId=${encodeURIComponent(id)}`);
    })();
  };
  const handleCompanyClick = (companyId) => {
    (async () => {
      await postRecentlyViewed(companyId, "company");
      navigate(`/accounts/info?companyId=${encodeURIComponent(companyId)}`);
    })();
  };
  const handleRowClick = (params) => {
    if (params.field === "employeeid") {
      handleProjectClick(params.row.contactid);
    }
    else if (params.field === "account") {
      handleCompanyClick(params.row.companyid);
    }
  };

  const processRowUpdate = (newRow, oldRow) => {
    const { id } = newRow;
    const editedFields = Object.keys(newRow).filter(
      (key) => newRow[key] !== oldRow[key]
    );
    if (editedFields.length > 0) {
      const updatedFields = {};

      editedFields.forEach((field) => {
        const backendField = fieldNameMapping[field];
        if (backendField) {
          updatedFields[backendField] = newRow[field];
        }
      });
      setRows((prevRows) =>
        prevRows.map((row) =>
          row.id === id ? { ...row, ...newRow } : row
        )
      );
    }
    return newRow;
  };
  const CustomToolbar = () => {
    return (
      <Box
        className="custom-toolbar"
        sx={{
          position: 'absolute',
          top: '10px',
          left: '5px',
          zIndex: 2,
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          p: 0.5,
        }}
      >
        <GridToolbarColumnsButton
          componentsProps={{
            menu: {
              sx: {
                height: "10px",
                width: '150px',
                fontSize: '12px',
                padding: '4px 8px',
              },
            },
          }}
          sx={{
            '& .MuiCheckbox-root': {
              color: 'red !important',
              height: '16px',
              width: '16px',
              padding: 0,
            },
            '& .Mui-checked': {
              color: 'red !important',
            },
          }}
        />
      </Box>
    );
  };
  const totalPages = Math.ceil(contactData?.length / itemsPerPage);
  const totalPagesForSheets = Math.ceil(employeesSheets?.length / itemsPerPage);

  const appliedFilters = {
    company: contactFilterState.company,
    employeeTitles: contactFilterState.employeeTitles,
    phones: contactFilterState.phones,
  };

  useEffect(() => {
    document.body.style.overflow = filterPanelOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [filterPanelOpen]);

  useEffect(() => {
    setCurrentState(
      pinnedObject?.CONT === "RV" ? "Recently Viewed" : "All Employees"
    );
  }, [localStorage?.getItem("keys")]);

  useEffect(() => {
    const updatedPinStates = {
      "All Employees": pinnedObject.CONT === "ALL",
      "Recently Viewed": pinnedObject.CONT === "RV",
    };
    setPinStates(updatedPinStates);
  }, [pinnedObject.CONT]);

  useEffect(() => {
    const shouldFetchWithFiltersContact =
      contactFilterState.companyIds?.length > 0 ||
      contactFilterState.titleName !== "";
    if (shouldFetchWithFiltersContact) {
      let contactOptions = {
        ...(contactFilterState.companyId?.length > 0 && {
          company: contactFilterState.companyId,
        }),
        ...(contactFilterState.employementType && {
          employementType: [contactFilterState.employementType],
        }),
        ...Authorization_header(contactFilterState.phones !== "" && {
          phones: [contactFilterState.phones],
        })
      };
      fetchContactData(contactOptions);
      // fetchEmployeesSheets(contactOptions);
    } else {
      fetchContactData();
      // fetchEmployeesSheets();
    }
  }, [currentState, Authorization_header]);

  const handleChangePage = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleChangeItemsPerPage = (items) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  let currentData = filteredRows?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  let currentSheetData = employeesSheets?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Ensuring currentData always has 20 items
  const placeholderRow = {};
  while (currentData?.length < itemsPerPage) {
    currentData.push(placeholderRow);
  }
  const currentPlaceholderRow = {};
  while (currentSheetData?.length < itemsPerPage) {
    currentSheetData.push(placeholderRow);
  }

  const handleUploadClick = () => {
    setModalOpen(true);
  };
  const handleEmployeeUploadClick = () => {
    setShowAddEmployeeModal(true);
  }
  const handleEmployeeUploadClose = () => {
    setShowAddEmployeeModal(false);
  }


  const handleModalClose = () => {
    setModalOpen(false);
  };

  const addContact = async (contactInfo) => {
    const apiUrl = `${BaseURL}/api/v1/contacts/${localStorage.getItem(
      "userid"
    )}/1/create-contact`;

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
          error.response?.data?.error?.message || "Failed to add employee.",
      })
      .then(() => {
        fetchContactData();
      })
      .catch((error) => {
        console.error("Employee addition failed:", error);
      });
  };

  const handleSearch = (input) => {
    setSearch(input);

  };


  useEffect(() => {
    const timeDifference = updateTimeDifference(contactData, "modifiedTime");
    setLatestUpdateTime(timeDifference);
  }, [contactData]);

  const isCreate = useHasAccessToFeature("F033", "P000000007");
  const isSearch = useHasAccessToFeature("F033", "P000000009");
  const handleSelectedHeaderItem = (item) => {
    setCurrentState(item);
  };

  const togglePinState = (selectedHeading) => {
    setPinStates((prevStates) => {
      const resetStates = Object.keys(prevStates).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {});

      const newState = {
        ...resetStates,
        [selectedHeading]: !prevStates[selectedHeading],
      };

      const allFalse =
        !newState["All Employees"] && !newState["Recently Viewed"];
      if (allFalse) {
        newState["All Employees"] = true;
      }

      return newState;
    });
  };

  const updatePinState = async (newState) => {
    const newPinnedObject = {
      ...pinnedObject,
      CONT: newState,
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

  useEffect(() => {
    const newState = Object.keys(pinStates).find(
      (key) => pinStates[key] === true
    );

    if (newState) {
      const newStateValue = newState === "All Employees" ? "ALL" : "RV";

      updatePinState(newStateValue)
        .then(() => {
        })
        .catch((error) => {
          console.error("Failed to update pin state:", error);
        });
    }
  }, [pinStates]);

  const handleSelectedTab = (name) => {
    setSelectedTab(name);
  }
  useEffect(() => {
    setSelectedTab(selectedTab);
  }, [selectedTab])

  useEffect(() => {

  }, [selectedTab])

  const getSelectedTab = (tabName) => {
    setSelectedTab(tabName);
  }

  useEffect(() => {
    if (selectedTab === 'All Employees') {
      fetchContactData();
    } else if (selectedTab === 'Uploaded Sheets') {
      fetchEmployeesSheets();
    }
  }, [Authorization_header, selectedTab]);

  const handleUploadEmployee = async (values) => {
    const apiUrl = `${BaseURL}/api/v1/contacts/${localStorage.getItem("userid")}/${values.companyId}/upload-employee-sheet`;
    const data = {
      companyId: values.companyId,
      employees: values.file,
    };
    toast.loading("Uploading employees sheet....");
    try {
      const tokens = localStorage.getItem('tokens');
      const token_obj = JSON.parse(tokens);
      const response = await axios.post(apiUrl, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          'Authorization': `Bearer ${token_obj?.accessToken}`
        }
      });
      handleEmployeeUploadClose();
      toast.dismiss();
      toast.success(response?.data?.message || "employees uploaded successfully");
    } catch (error) {
      console.error(error);
      toast.dismiss();
      toast.error(error?.response?.data?.message || "Failed to upload employees sheet.");
    } finally {
      fetchEmployeesSheets();
    }
  };

  const handleUploadwages = async (values) => {
    const apiUrl = `${BaseURL}/api/v1/contacts/${localStorage.getItem("userid")}/${values.companyId}/upload-payroll-sheet`;
    const data = {
      companyId: values.companyId,
      payroll: values.file,
    };
    toast.loading("Uploading wages sheet....");
    try {
      const tokens = localStorage.getItem('tokens');
      const token_obj = JSON.parse(tokens);
      const response = await axios.post(apiUrl, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          'Authorization': `Bearer ${token_obj?.accessToken}`
        }
      });
      handleEmployeeUploadClose();
      toast.dismiss();
      toast.success(response?.data?.message || "wages uploaded successfully");
    } catch (error) {
      console.error(error);
      toast.dismiss();
      toast.error(error?.response?.data?.message || "Failed to upload wages sheet.");
    } finally {
      fetchEmployeesSheets();
    }
  };

  const handleSubmit = (values) => {
    if (values.documentType === 'Employees') {
      handleUploadEmployee(values);
    } else if (values.documentType === 'Wages') {
      handleUploadwages(values);
    }
  };

  const handleFilterClick = () => {
    setFilterPanelOpen(!filterPanelOpen);  // Only manage the drawer's open/close state here
    if (!filterPanelOpen) {
      setFilterPanelOpen(true);  // Ensure the filter panel is opened when the drawer is opened
    }
  };

  const handleFilterPanelClose = () => {
    setFilterPanelOpen(false);
    setFilterPanelOpen(false);  // Always close the drawer when the filter panel is closed
  };
  const handleFilterClose = () => {
    setFilterPanelOpen(false);
  };


  const applyFiltersAndFetch = (filters) => {
    if (areFiltersApplied(appliedFilters)) {
      fetchContactData(filters);
      fetchEmployeesSheets(filters);
      setIsContactFilterApplied(true);
    } else {
      toast.error("Please select at least one filter.");
    }
  };

  const countActiveFilters = (sendInteractions) => {
    let count = 0;

    if (contactFilterState?.company?.length > 0 && contactFilterState.company[0] !== "ALL") count += 1;
    if (contactFilterState?.employeeTitles?.length > 0) count += 1;
    if (Array.isArray(contactFilterState?.phones) && contactFilterState.phones.some(phone => phone !== "")) count += 1;

    return count;
  };


  return (
    <>
      <Box
        sx={{
          transition: 'opacity 0.3s ease-in-out',
        }}
      >
        {useHasAccessToFeature("F033", "P000000008") && (
          <Paper
            sx={{
              display: "flex",
              width: "98.5%",
              mx: "auto",
              mt: 1,
              flexDirection: "column",
              borderRadius: "20px",
              mb: 3,
              boxShadow: "0px 3px 6px #0000001F",
            }}
          >
            <TableIntro
              heading={
                pinnedObject?.CONT === "RV" ? "Recently Viewed" : "All Employees"
              }
              btnName={"New Employee"}
              btnNameX={"Upload"}
              page={"Employees"}
              data={contactData}
              totalItems={filteredRows?.length || 0}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              onUploadClick={handleUploadClick}
              onUploadClickX={handleEmployeeUploadClick}
              onSearch={handleSearch}
              latestUpdateTime={latestUpdateTime}
              items={["All Employees", "Recently Viewed"]}
              onApplyFilters={applyFiltersAndFetch}
              appliedFilters={appliedFilters}
              createPermission={isCreate}
              searchPermission={isSearch}
              onSelectedItem={handleSelectedHeaderItem}
              isPinnedState={pinStates[currentState]}
              onPinClicked={() => togglePinState(currentState)}
              handleSelectedTab={handleSelectedTab}
              selectedTab={selectedTab}
            />
            <ContactAddModal
              open={showAddEmployeeModal}
              handleClose={handleEmployeeUploadClose}
              handleSubmit={handleSubmit}
              type={"upload"}
            />
            <ContactModal
              open={modalOpen}
              handleClose={handleModalClose}
              onAddContact={handleAddContact}
              clients={clientList}
            />
            {/* <CustomPagination
              currentPage={currentPage}
              totalPages={totalPages}
              changePage={handleChangePage}
              changeItemsPerPage={handleChangeItemsPerPage}
              minRows={20}
            /> */}

            <Box sx={{ display: "flex", pt: 0, pb: page === "activity" ? -1 : 0 }}>
              <Box sx={{ marginLeft: "9px", marginTop: "-70px", display: "flex", alignItems: "center" }}>
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
                  <ContactFilters
                    handleClose={handleFilterPanelClose}
                    open={filterPanelOpen}
                    page={page}
                    documentType={documentType}
                    // onApplyFilters={onApplyFilters}
                    onApplyFilters={applyFiltersAndFetch}
                    style={{ position: 'absolute', left: 0 }}
                  />
                )}
              </Drawer>
            </Box>
            <Box
              sx={{
                flexGrow: 1,
                marginLeft: filterPanelOpen ? '300px' : '0',
              }}
            >
              {selectedTab === "All Employees" && (
                <TableContainer
                  sx={{
                    maxHeight: "82vh",
                    overflowY: "auto",
                    borderTopLeftRadius: "20px",
                    position: 'relative',
                    paddingTop: "1.5em"
                  }}
                >
                  {/* <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHeader tableData={tableData} page="contacts" />
                    {!loading && (
                      <ContactsTableBody
                        data={currentData}
                        currentPage={currentPage}
                        itemsPerPage={itemsPerPage}
                      />
                    )}
                  </Table> */}
                  <div
                    style={{
                      ...headerCellStyle,
                      textAlign: "center",
                      width: "100%",
                      height: "calc(101vh - 200px)",
                    }}
                  >
                    <ThemeProvider theme={theme}>
                      <DataGrid
                        columns={columns}
                        rows={filteredRows}
                        getRowId={(row) => row.contactid || row.id}
                        loading={false}
                        // disableColumnResize={true}
                        processRowUpdate={processRowUpdate}
                        onCellClick={handleRowClick}
                        itemsPerPage={itemsPerPage}
                        experimentalFeatures={{ newEditingApi: true }}
                        slots={{
                          toolbar: CustomToolbar,
                        }}
                        density="compact"
                        sx={{
                          backgroundColor: "white",
                          "& .MuiDataGrid-columnHeader": {
                            position: "sticky",
                            left: 0,
                            zIndex: 1,
                            backgroundColor: "#ececec !important",
                            borderTop: "1px solid #ddd",
                            borderRight: "1px solid #ddd",
                          },
                          "& .MuiDataGrid-cell": {
                            backgroundColor: "white",
                            borderRight: "1px solid #ccc",
                          },
                          '& .MuiDataGrid-columnMenu': {
                            width: '150px',
                            fontSize: '12px',
                            '& .MuiMenuItem-root': {
                              padding: '6px 8px',
                            },
                          },
                          "& .MuiDataGrid-footerContainer": {
                            backgroundColor: "#ececec",
                            mt: "-10px"
                          },
                        }}
                      />
                    </ThemeProvider>
                  </div>
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
                  {currentData?.length === 0 && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: "50px",
                        minHeight: "380px",
                      }}
                    >
                      No Employees found.
                    </div>
                  )}
                </TableContainer>
              )}
            </Box>
          </Paper>
        )}
      </Box>
    </>
  );
}

export default Contacts;