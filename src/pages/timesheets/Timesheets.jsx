import { CircularProgress, Paper, Table, TableContainer, Box, Drawer, Badge, Typography, createTheme, ThemeProvider } from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
// import CustomPagination from "../../components/Common/CustomPagination";
// import TableHeader from "../../components/Common/TableHeader";
import TableIntro from "../../components/Common/TableIntro";
import ModalForm from "../../components/Timesheets/ModalForm";
// import TimesheetTableBody from "../../components/Timesheets/TimesheetTableBody";
import { BaseURL } from "../../constants/Baseurl";
import { updateTimeDifference } from "../../utils/helper/UpdateTimeDifference";
import toast, { Toaster } from "react-hot-toast";
import usePinnedData from "../../components/CustomHooks/usePinnedData";
import { FilterListContext } from "../../context/FiltersListContext";
import { TimesheetContext } from "../../context/TimesheetContext";
import { areFiltersApplied } from "../../utils/helper/AreFiltersApplied";
import { Authorization_header } from "../../utils/helper/Constant";
import { useHasAccessToFeature } from "../../utils/helper/HasAccessToFeature";
import { HiFilter } from "react-icons/hi";
import TimesheetFilters from "../../components/Timesheets/TimesheetFilter";
import { DataGrid, GridToolbarColumnsButton } from "@mui/x-data-grid";
import StraightIcon from '@mui/icons-material/Straight';
import { postRecentlyViewed } from "../../utils/helper/PostRecentlyViewed";
import { useNavigate } from "react-router-dom";

const tableData = {
  columns: [
    "Timesheet Name",
    "Fiscal Year",
    "Account",
    "Status",
    "Uploaded On",
    "Uploaded By",
    "Total Hours",
  ],
  rows: [
    {
      id: 1,
      timesheetName: "TS_Oct23",
      month: "Oct 2023",
      project: "PR-000000049",
      company: "Apple Inc.",
      projectManager: "Ezra Romero",
      uploadedOn: "29/11/2023 12:35:12",
      uploadedBy: "Ezra Romero",
      nonRnD: "1321",
      RnD: "285",
      uncertainHrs: "0",
      reconciledHrs: "26",
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
  },
  tableContainerStyle: {
    borderLeft: "1px solid #E4E4E4",
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
function Timesheets(page = "Timesheets", documentType = "") {
  const { pinnedObject } = usePinnedData();
  const {
    timesheets,
    fetchTimesheets,
    timesheetFilterState,
    currentState,
    setCurrentState,
    getTimeSheetsortParams,
    loading
  } = useContext(TimesheetContext);
  const { clientList, fetchUserDetails, fetchClientList } = useContext(FilterListContext);
  const [modalOpen, setModalOpen] = useState(false);
  const [timesheetData, setTimesheetData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [search, setSearch] = useState("");
  const [filteredRows, setFilteredRows] = useState([]);
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState(null)
  const [latestUpdateTime, setLatestUpdateTime] = useState("Just now");
  const navigate = useNavigate();
  const [pinStates, setPinStates] = useState({
    "All Timesheets": false,
    "Recently Viewed": false,
  });
  const fieldNameMapping = {
    timesheetid: "timesheetId",
    timesheetname: "originalFileName",
    fiscalyear: "accountingYear",
    account: "companyName",
    status: "status",
    uploadedon: "uploadedOn",
    uploadedby: "uploadedBy",
    totalhours: "totalhours",
    companyid: "companyId",
  };
  const formatFiscalYear = (accountingYear) => {
    const currentYear = accountingYear;
    const previousYear = currentYear - 1;
    return `${previousYear}-${currentYear.toString().slice(-2)}`;
  };

  const removeSpecialCharsAndLowerCase = (str) => {
    return str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "");
  };
  useEffect(() => {
    if (Array.isArray(timesheets)) {
      const mappedRows = timesheets?.map((row) => {
        const mappedRow = {};
        Object.keys(fieldNameMapping)?.forEach((field) => {
          const mappedField = fieldNameMapping[field];
          if (mappedField === "accountingYear") {
            mappedRow[field] = formatFiscalYear(row[mappedField])
          } else if (mappedField === "uploadedOn") {
            const rawDate = row[mappedField];
            mappedRow[field] = rawDate
              ? rawDate?.replaceAll("Z", "")?.replaceAll("T", " ")
              : "";
          } else {
            mappedRow[field] = row[mappedField] || "";
          }
        });
        mappedRow.id = row.timesheetId || `generated-id-${row.timesheetId}`;
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
  }, [timesheets, search]);
  const mappedRows = Array?.isArray(timesheets)
    ? timesheets?.map((row) => {
      const mappedRow = {};
      Object.keys(fieldNameMapping)?.forEach((field) => {
        const mappedField = fieldNameMapping[field];
        mappedRow[field] = row[mappedField] || "";
      });
      mappedRow.id = row.timesheetid;
      return mappedRow;
    })
    : [];
  const [rows, setRows] = useState(mappedRows);
  const handleColumnClick = (col) => {
    const fieldName = removeSpecialCharsAndLowerCase(col);
    const mappedField = fieldNameMapping[fieldName];
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
      getTimeSheetsortParams({ sortField, sortOrder });

      const options = {
        sortField,
        sortOrder,
      };
      fetchTimesheets(options);
    }
  }, [sortField, sortOrder, page]);

  const renderSortIcons = (column, index) => {
    const fieldName = removeSpecialCharsAndLowerCase(column);
    const mappedField = fieldNameMapping[fieldName];
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

  const columns = tableData.columns?.map((col) => {
    const fieldName = removeSpecialCharsAndLowerCase(col);
    const mappedField = fieldNameMapping[fieldName];
    const isCentered = ["fiscalyear", "uploadedon"]?.includes(fieldName);
    const isRightAligned = ["totalhours"].includes(fieldName);
    const alignmentStyle = isCentered
      ? { justifyContent: "center", textAlign: "center" }
      : isRightAligned
        ? { justifyContent: "flex-end", textAlign: "right" }
        : { justifyContent: "flex-start", textAlign: "left" };

    return {
      field: fieldName,
      headerName: col,
      width: 270,
      sortable: false,
      headerAlign: 'center',
      renderHeader: () => (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {col}
          {renderSortIcons(col, mappedField)}
        </Box>
      ),
      renderCell: (params) => {
        let displayValue = params.value;
        if (fieldName === "totalhours" && displayValue !== "") {
          displayValue = parseFloat(displayValue).toFixed(2);
        }
        const isSpecialField = ["timesheetname", "account"]?.includes(fieldName);
        return (
          <Typography
            className="value-text"
            sx={{
              display: "flex",
              alignItems: "center",
              height: "100%",
              width: "100%",
              padding: "0 10px",
              textOverflow: "ellipsis",
              overflow: "hidden",
              fontSize: "13px",
              lineHeight: 2.5,
              marginBottom: "0",
              color: isSpecialField ? "#00A398" : "inherit",
              textDecoration: isSpecialField ? "underline" : "none",
              ...alignmentStyle,
            }}
            title={displayValue}
          >
            {displayValue}
          </Typography>
        );
      },
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
      await postRecentlyViewed(id, "timesheet");
      navigate(`/timesheets/details?timesheetId=${encodeURIComponent(id)}`);
    })();
  };
  const handleCompanyClick = (companyId) => {
    (async () => {
      await postRecentlyViewed(companyId, "company");
      navigate(`/accounts/info?companyId=${encodeURIComponent(companyId)}`);
    })();
  };
  const handleRowClick = (params) => {
    if (params.field === "timesheetname") {
      handleProjectClick(params.row.timesheetid);
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
  useEffect(() => {
    document.body.style.overflow = filterPanelOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [filterPanelOpen]);

  const handleFilterClick = () => {
    setFilterPanelOpen(!filterPanelOpen);
    if (!filterPanelOpen) {
      setFilterPanelOpen(true);
    }
  };
  const handleFilterPanelClose = () => {
    setFilterPanelOpen(false);
    setFilterPanelOpen(false);
  };
  const totalPages = Math.ceil(filteredRows?.length / itemsPerPage);

  const handleChangePage = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleChangeItemsPerPage = (items) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  const currentData = filteredRows?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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

  const appliedFilters = {};
  if (timesheetFilterState.company) {
    appliedFilters.company = timesheetFilterState.company;
  }
  if (timesheetFilterState.accYear) {
    appliedFilters.accYear = timesheetFilterState.accYear;
  }
  if (timesheetFilterState.totalhours && timesheetFilterState.totalhours[0] !== undefined) {
    appliedFilters.MinimumTotalHours = timesheetFilterState.totalhours[0];
  }
  if (timesheetFilterState.totalhours && timesheetFilterState.totalhours[1] < 2000000) {
    appliedFilters.MaximumTotalHours = timesheetFilterState.totalhours[1];
  }
  if (timesheetFilterState.sortField) {
    appliedFilters.SortField = timesheetFilterState.sortField;
  }
  if (timesheetFilterState.sortOrder) {
    appliedFilters.sortOrder = timesheetFilterState.sortOrder;
  }

  const applyFiltersAndFetch = (filters) => {
    if (areFiltersApplied(appliedFilters)) {
      fetchTimesheets(filters);
    } else {
      toast.error("Please select at least one filter.");
    }
  };

  useEffect(() => {
    fetchClientList();
    setCurrentState(
      pinnedObject?.TIMESHEETS === "RV" ? "Recently Viewed" : "All Timesheets"
    );
  }, [Authorization_header]);

  useEffect(() => {
    const updatedPinStates = {
      "All Timesheets": pinnedObject.TIMESHEETS === "ALL",
      "Recently Viewed": pinnedObject.TIMESHEETS === "RV",
    };
    setPinStates(updatedPinStates);
  }, [pinnedObject.TIMESHEETS]);

  useEffect(() => {
    const shouldFetchWithFiltersTimesheet =
      timesheetFilterState.companyId.length > 0 ||
      timesheetFilterState.accountingYear.length > 0 ||
      timesheetFilterState.totalhours.length > 0;
    if (shouldFetchWithFiltersTimesheet) {
      let timesheetOptions = {
        ...(timesheetFilterState.companyId.length > 0 && {
          company: timesheetFilterState.companyId,
        }),
        ...(timesheetFilterState.accountingYear.length > 0 && {
          accountingYear: timesheetFilterState.accountingYear,
        }),
        ...(timesheetFilterState.totalhours && {
          minTotalhours: timesheetFilterState.totalhours[0],
        }),
        ...(timesheetFilterState.totalhours && {
          maxTotalhours: timesheetFilterState.totalhours[1],
        }),
      };
      fetchTimesheets(timesheetOptions);
    } else {
      fetchTimesheets();
    }
  }, [currentState, Authorization_header]);


  const handleFormSubmit = async (formData) => {
    const apiUrl = `${BaseURL}/api/v1/timesheets/${localStorage.getItem(
      "userid"
    )}/A01/timesheet-upload`;
    const data = {
      companyId: formData.company,
      timesheet: formData.file,
      month: formData.month,
      year: formData.year,
    };
    toast.loading("Uploading timesheet...");
    try {
      const tokens = localStorage.getItem('tokens');
      const token_obj = JSON.parse(tokens);

      const response = await axios.post(apiUrl, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          'Authorization': `Bearer ${token_obj?.accessToken}`
        },
      });
      setTimesheetData(response?.data?.data);
      fetchTimesheets();
      handleModalClose();
      toast.dismiss();
      toast.success(response?.data?.message || "The file has been uploaded successfully and is currently in the processing queue.");
    } catch (error) {
      console.error("er", error);
      toast.dismiss();
      toast.error(error?.response?.data?.message || "Failed to upload timesheet.")
    }
  };

  const handleSearch = (input) => {
    setSearch(input);
  };

  useEffect(() => {
    const timeDifference = updateTimeDifference(timesheets, "uploadedOn");
    setLatestUpdateTime(timeDifference);
  }, [timesheets]);

  const handleSelectedHeaderItem = (item) => {
    setCurrentState(item);
  };

  const isUpload = useHasAccessToFeature("F018", "P000000002");
  const isSearch = useHasAccessToFeature("F018", "P000000009");

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
        !newState["All Timesheets"] && !newState["Recently Viewed"];
      if (allFalse) {
        newState["All Timesheets"] = true;
      }

      return newState;
    });
  };

  const updatePinState = async (newState) => {
    const newPinnedObject = {
      ...pinnedObject,
      TIMESHEETS: newState,
    };

    const pinString = Object.entries(newPinnedObject)
      .map(([key, value]) => `${key}:${value}`)
      .join("|");

    const config = {
      method: "put",
      url: `${BaseURL}/api/v1/users/${localStorage.getItem(
        "userid"
      )}/edit-user`,
      headers: { "Content-Type": "application/json" },
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
      const newStateValue = newState === "All Timesheets" ? "ALL" : "RV";
      updatePinState(newStateValue)
        .then(() => {
        })
        .catch((error) => {
          console.error("Failed to update pin state:", error);
        });
    }
  }, [pinStates]);

  const countActiveFilters = () => {
    let count = 0;

    if (timesheetFilterState?.company?.length > 0 && timesheetFilterState.company[0] !== "ALL") count += 1;
    if (timesheetFilterState?.accYear?.length > 0) count += 1;
    if (timesheetFilterState?.uploadedBy?.length > 0) count += 1;
    if (timesheetFilterState?.accountingYear?.length > 0) count += 1;
    if (timesheetFilterState?.status?.some(phone => phone !== "")) count += 1;
    if (timesheetFilterState?.totalhours?.some(count => count > 0)) count += 1;
    return count;
  };

  return (
    <>
      <Box
        sx={{
          transition: 'opacity 0.3s ease-in-out',
        }}
      >
        {useHasAccessToFeature("F018", "P000000008") && (
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
                pinnedObject?.TIMESHEETS === "RV"
                  ? "Recently Viewed"
                  : "All Timesheets"
              }
              btnName={"Upload"}
              page={"timesheet"}
              totalItems={filteredRows?.length || 0}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              onUploadClick={handleUploadClick}
              onSearch={handleSearch}
              latestUpdateTime={latestUpdateTime}
              items={["All Timesheets", "Recently Viewed"]}
              onApplyFilters={applyFiltersAndFetch}
              appliedFilters={appliedFilters}
              createPermission={isUpload}
              searchPermission={isSearch}
              onSelectedItem={handleSelectedHeaderItem}
              isPinnedState={pinStates[currentState]}
              onPinClicked={() => togglePinState(currentState)}
            />
            <ModalForm
              open={modalOpen}
              handleClose={handleModalClose}
              handleSubmit={handleFormSubmit}
              type={"upload"}
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
                  <TimesheetFilters
                    handleClose={handleFilterPanelClose}
                    open={filterPanelOpen}
                    page={page}
                    documentType={documentType}
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
                mt: "20px"
              }}
            >
              <TableContainer
                sx={{
                  maxHeight: "82vh",
                  overflowY: "auto",
                  borderTopLeftRadius: "20px",
                }}>
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
                      getRowId={(row) => {
                        const id = row.timesheetid;
                        return id;
                      }}
                      loading={false}
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
                {/* <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHeader tableData={tableData} page="timeSheet" />
                  {!loading && <TimesheetTableBody
                    data={currentData}
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                  />
                  }
                </Table> */}
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
                {currentData.length === 0 && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: "50px",
                      minHeight: "380px",
                    }}
                  >
                    No timesheet found.
                  </div>
                )}
              </TableContainer>
            </Box>
          </Paper>
        )}
        <Toaster />
      </Box>
    </>
  );
}

export default Timesheets;
