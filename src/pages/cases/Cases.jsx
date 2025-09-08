import { CircularProgress, Paper, Table, TableContainer, Box, Drawer, Badge, Typography, createTheme, ThemeProvider } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import CustomPagination from "../../components/Common/CustomPagination";
import TableHeader from "../../components/Common/TableHeader";
import TableIntro from "../../components/Common/TableIntro";
import CasesTableBody from "../../components/Cases/CasesTableBody";
import toast, { Toaster } from "react-hot-toast";
import usePinnedData from "../../components/CustomHooks/usePinnedData";
import { FilterListContext } from "../../context/FiltersListContext";
import { useHasAccessToFeature } from "../../utils/helper/HasAccessToFeature";
import CaseModalForm from "../../components/Cases/CaseModalForm";
import { CaseContext } from "../../context/CaseContext";
import { Authorization_header } from "../../utils/helper/Constant";
import { areFiltersApplied } from "../../utils/helper/AreFiltersApplied";
import { HiFilter } from "react-icons/hi";
import CaseFilter from "../../components/Cases/CaseFilter";
import { DataGrid, GridToolbarColumnsButton } from "@mui/x-data-grid";
import StraightIcon from '@mui/icons-material/Straight';
import { postRecentlyViewed } from "../../utils/helper/PostRecentlyViewed";
import { useNavigate } from "react-router-dom";

const tableData = {
  columns: [
    "Case Code",
    "Case type",
    "Account",
    "Location",
    "Case Owner",
    "Created On",
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

function Cases(page, documentType = "") {
  const { pinnedObject } = usePinnedData();
  const {
    getAllCases,
    caseData,
    caseFilterState,
    currentState,
    loading,
    getCaseSortParams,
    fetchAllCases
  } = useContext(CaseContext);
  const { clientList, fetchClientList } = useContext(FilterListContext);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [search, setSearch] = useState("");
  const [filteredRows, setFilteredRows] = useState([]);
  const [latestUpdateTime, setLatestUpdateTime] = useState("Just now");
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState(null)
  const navigate = useNavigate();
  const [pinStates, setPinStates] = useState({
    "All Cases": false,
    "Recently Viewed": false,
  });
  const fieldNameMapping = {
    id: "caseId",
    caseid: "caseId",
    casecode: "caseCode",
    casetype: "caseType",
    account: "companyName",
    location: "countryName",
    caseowner: "caseOwnerName",
    createdon: "createdOn",
    companyid: "companyId"
  }

  const removeSpecialCharsAndLowerCase = (str) => {
    return str.toLowerCase().replace(/[^a-z0-9]/g, "");
  };

  useEffect(() => {
    if (Array.isArray(caseData)) {
      const mappedRows = caseData.map((row) => {
        const mappedRow = {};
        Object.keys(fieldNameMapping).forEach((field) => {
          const mappedField = fieldNameMapping[field];
          mappedRow[field] = row[mappedField] || "";

        });
        mappedRow.id = row.caseId || `generated-id-${row.caseId}`;
        return mappedRow;
      });
      if (search) {
        const lowerCaseSearch = search.toLowerCase();
        const filteredData = mappedRows.filter((row) =>
          Object.values(row).filter(Boolean).some((value) =>
            removeSpecialCharsAndLowerCase(value?.toString()).includes(removeSpecialCharsAndLowerCase(lowerCaseSearch)))
        );
        setFilteredRows(filteredData.length > 0 ? filteredData : []);
      } else {
        setFilteredRows(mappedRows);
      }
    }
  }, [caseData, search]);

  const mappedRows = caseData.map((row) => {
    const mappedRow = {};
    Object.keys(fieldNameMapping).forEach((field) => {
      const mappedField = fieldNameMapping[field];
      mappedRow[field] = row[mappedField] || "N/A";
    });
    mappedRow.id = row.caseId;
    return mappedRow;
  });

  const [rows, setRows] = useState(mappedRows);

  const handleColumnClick = (col) => {
    if (sortField === col) {
      if (sortOrder === "asc") {
        setSortOrder("dsc");
      } else if (sortOrder === "dsc") {
        setSortField(null);
        setSortOrder(null);
      } else {
        setSortOrder("asc");
      }
    } else {
      setSortField(col);
      setSortOrder("asc");
    }
  };

  useEffect(() => {
    const options = {};
    if (sortField && sortOrder) {
      options.sortField = sortField;
      options.sortOrder = sortOrder;
    }
    getCaseSortParams(options);
    getAllCases(options);
  }, [sortField, sortOrder, page]);



  const renderSortIcons = (column) => {
    let upColor = inactiveColor;
    let downColor = inactiveColor;
    let upOpacity = 0.8;
    let downOpacity = 0.6;
    if (sortField === column) {
      if (sortOrder === "asc") {
        upColor = "#FD5707";
        downColor = inactiveColor;
        upOpacity = 1;
        downOpacity = 0.6;
      } else if (sortOrder === "dsc") {
        upColor = inactiveColor;
        downColor = "#FD5707";
        upOpacity = 0.6;
        downOpacity = 1;
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
          {renderSortIcons(col)}
        </Box>
      ),
      renderCell: (params) => {
        const displayValue = params.value;

        const cellStyle = {
          backgroundColor: "transparent",
          padding: "0px",
          display: "flex",
          alignItems: "center",
          justifyContent: params.field === "createdon" || params.field === "casecode" ? "center" : "flex-start", // Center for createdon & casecode, left for others
          height: "100%",
          width: "100%",
        };

        if (params.field === "casetype") {
          return <CasesTableBody data={caseData} />;
        }
        if (params.field === "casecode" || params.field === "account") {
          return (
            <Typography
              className="value-text"
              sx={{
                justifyContent: params.field === "casecode" ? "center" : "flex-start",
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
              }}
              title={displayValue}
            >
              {displayValue}
            </Typography>
          );
        }
        return <div style={cellStyle}>{displayValue}</div>;
      }
    };
  });

  const activeColor = "#404040";
  const inactiveColor = "#404040";
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
      await postRecentlyViewed(id, "cases");
      navigate(`/cases/details?caseId=${encodeURIComponent(id)}`);
    })();
  };
  const handleCompanyClick = (companyId) => {
    (async () => {
      await postRecentlyViewed(companyId, "account");
      navigate(`/accounts/info?companyId=${encodeURIComponent(companyId)}`);
    })();
  };
  const handleRowClick = (params) => {
    if (params.field === "casecode") {
      handleProjectClick(params.row.caseid);
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

  const totalPages = Math.ceil(filteredRows?.length / itemsPerPage);

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
  const appliedFilters = {
    Clients: caseFilterState?.company,
    Countryname: caseFilterState?.countryName,
    caseOwners: caseFilterState?.caseOwners,
  };
  const applyFiltersAndFetch = (filters) => {
    if (areFiltersApplied(appliedFilters)) {
      getAllCases(filters);
    }
    else {
      getAllCases(filters);
      // toast.error("Please select at least one filter.");
    }
  };


  useEffect(() => {
    getAllCases();
  }, [Authorization_header]);

  useEffect(() => {
    fetchClientList();
  }, [Authorization_header]);

  useEffect(() => {
    const updatedPinStates = {
      "All Cases": pinnedObject.CASES === "ALL",
      "Recently Viewed": pinnedObject.CASES === "RV",
    };
    setPinStates(updatedPinStates);
  }, [pinnedObject.CASES]);


  const handleSearch = (input) => {
    setSearch(input);
  };

  // useEffect(() => {
  //   if (caseData) {
  //     const filteredData = caseData?.filter(
  //       (task) => {
  //         return task?.caseCode?.toLowerCase()?.includes(search?.toLowerCase()) ||
  //           task?.primaryContactName?.toLowerCase()?.includes(search?.toLowerCase()) ||
  //           task?.companyName?.toLowerCase()?.includes(search?.toLowerCase()) ||
  //           task?.primaryContactEmail?.toLowerCase()?.includes(search?.toLowerCase()) ||
  //           task?.caseOwnerName?.toLowerCase()?.includes(search?.toLowerCase()) ||
  //           task?.caseId?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
  //           task?.caseType?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
  //           task?.countryName?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
  //           task?.createdOn?.toString()?.toLowerCase()?.includes(search?.toLowerCase())
  //       }
  //     );
  //     setFilteredRows(filteredData);
  //     setCurrentPage(1);
  //   }
  // }, [caseData, search]);

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
        !newState["All Cases"] && !newState["Recently Viewed"];
      if (allFalse) {
        newState["All Cases"] = true;
      }

      return newState;
    });
  };

  useEffect(() => {
    const newState = Object.keys(pinStates).find(
      (key) => pinStates[key] === true
    );

    if (newState) {
      const newStateValue = newState === "All Cases" ? "ALL" : "RV";
    }
  }, [pinStates]);
  useEffect(() => {
    const shouldFetchWithFiltersCase =
      caseFilterState?.company?.length > 0 ||
      caseFilterState?.companyId?.length > 0 ||
      caseFilterState?.countryName?.length > 0 ||
      caseFilterState?.caseOwnerName?.length > 0 ||
      caseFilterState?.sortField?.length > 0 ||
      caseFilterState?.sortOrder?.length > 0;
    if (shouldFetchWithFiltersCase) {
      let caseOptions = {
        ...(caseFilterState?.companyId?.length > 0 && {
          client: caseFilterState?.companyId,
        }),
        ...(caseFilterState.countryName?.length > 0 && {
          countryName: caseFilterState.countryName,
        }),
        ...(caseFilterState.caseOwners?.length > 0 && {
          caseOwners: caseFilterState.caseOwners,
        }),
      };
      getAllCases(caseOptions);
    } else {
      getAllCases();
    }
  }, [currentState, Authorization_header]);


  const countActiveFilters = () => {
    let count = 0;
    if (caseFilterState?.company?.length > 0) count += 1;
    if (caseFilterState?.countryName?.length > 0) count += 1;
    if (caseFilterState?.caseOwners?.length > 0) count += 1;
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
            }}>
            <TableIntro
              heading={
                pinnedObject?.CASES === "RV"
                  ? "Recently Viewed"
                  : "All Cases"
              }
              btnName={"Add Case"}
              page={"case"}
              totalItems={filteredRows?.length || 0}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              onUploadClick={handleUploadClick}
              onSearch={handleSearch}
              latestUpdateTime={latestUpdateTime}
              items={["All Cases", "Recently Viewed"]}
              onApplyFilters={applyFiltersAndFetch}
              searchPermission={isSearch}
              appliedFilters={appliedFilters}
            />
            <CaseModalForm
              open={modalOpen}
              handleClose={handleModalClose}
              clients={clientList}
              handleFetchAllCases={getAllCases}
            />
            {/* <CustomPagination
              currentPage={currentPage}
              totalPages={totalPages}
              changePage={handleChangePage}
              changeItemsPerPage={handleChangeItemsPerPage}
              minRows={20}
            /> */}
            <Box sx={{ display: "flex", pt: 0, pb: page === "activity" ? -1 : 0 }}>
              <Box sx={{ marginLeft: "9px", marginTop: "-75px", display: "flex", alignItems: "center" }}>
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
                  <CaseFilter
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
              <TableContainer sx={{
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
                        const id = row.caseid;
                        return id;
                      }}
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
                {/* <Table sx={{ minWidth: 650 }} aria-label="simple table">

                  <TableHeader tableData={tableData} page={"cases"} />
                  <CasesTableBody
                    data={currentData}
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                  />
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
              </TableContainer>
            </Box>
          </Paper>
        )}
        <Toaster />
      </Box >
    </>
  );
}

export default Cases;