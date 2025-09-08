import { useContext, useEffect, useState } from "react";
import { useHasAccessToFeature } from "../../utils/helper/HasAccessToFeature";
import { Badge, Box, createTheme, Paper, TableContainer, ThemeProvider, Typography, Tooltip } from "@mui/material";
import ProjectsTeamTableStack from "../../components/ProjectsTeams/ProjectsTeamTableStack";
import { ProjectTeammemberContext } from "../../context/ProjectTeammemberContext";
import TableIntro from "../../components/Common/TableIntro";
import { toast, Toaster } from "react-hot-toast";
import StraightIcon from '@mui/icons-material/Straight';
import { DataGrid, GridToolbarColumnsButton } from "@mui/x-data-grid";
import { postRecentlyViewed } from "../../utils/helper/PostRecentlyViewed";
import { areFiltersApplied } from "../../utils/helper/AreFiltersApplied";
import usePinnedData from "../../components/CustomHooks/usePinnedData";
import { useNavigate } from "react-router-dom";
import { HiFilter } from "react-icons/hi";
import { BaseURL } from "../../constants/Baseurl";
import axios from "axios";
import { Authorization_header } from "../../utils/helper/Constant";
import { throttle } from "lodash";
import UploadSheetsModal from "../../components/UploadedSheets/UploadSheetsModal";
import { DownloadSampleSheetsModal } from "../../components/UploadedSheets/DownloadSampleSheetsModal";
import { formatStatus } from "../../utils/helper/FormatStatus";
// import { postRecentlyViewed } from "../../utils/helper/PostRecentlyViewed";

const tableData = {
  columns: [
    "Sheet ID", "Sheet Name", "Sheet Type", "Account Name",
    "Uploaded By", "Uploaded On", "Status", "Total Records", "Processed Records"
  ],
  rows: [{
    sheet_id: 1,
    sheet_name: "Sheet 1",
    account_name: "Account 1",
    project_code: 1,
    project_name: "Project 1",
    uploaded_by: "User 1",
    uploaded_on: "2021-10-01",
    status: "Active",
    Total_records: 10,
    processed_records: 5
  },
  { sheet_id: 2, sheet_name: "Sheet 2", account_name: "Account 2", project_code: 2, project_name: "Project 2", uploaded_by: "User 2", uploaded_on: "2021-10-02", status: "Inactive", Total_records: 20, processed_records: 10 },
  ]
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

function UploadedSheets(page) {
  const [search, setSearch] = useState("");
  const [uploadedSheets, setUpoadedSheets] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredRows, setFilteredRows] = useState([]);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const navigate = useNavigate();
  const { pinnedObject } = usePinnedData();
  const docFilterState = {};
  const [modalOpen, setModalOpen] = useState(false);
  const [downloadFileOpen, setDownloadFileOpen] = useState(false);
  const [currentState, setCurrentState] = useState("All Uploaded Sheets");
  const [appliedSort, setAppliedSort] = useState(null);
  const [pinStates, setPinStates] = useState({
    "All Uploaded Sheets": false,
    "Recently Viewed": false,
  });
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const THROTTLE_DELAY = 300;

  const loading = false;

  const DEBOUNCE_DELAY = 300;

  const fetchSheets = async ({ sortField, sortOrder, otherParams } = {}) => {
    try {
      const queryParams = new URLSearchParams({
        ...otherParams, // Include any additional dynamic params here
      });

      sortField && sortOrder && queryParams.append("sortField", sortField);
      sortField && sortOrder && queryParams.append("sortOrder", sortOrder);

      const url = `${BaseURL}/api/v1/sheets/get-upload-sheets?${queryParams}`;
      const response = await axios.get(url, Authorization_header());
      setUpoadedSheets(response?.data?.data?.list || []);
    } catch (error) {
      console.error("Error fetching sheets:", error);
    }
  };

  const fieldNameMapping = {
    sheetid: "sheet_id",
    sheetname: "sheet_name",
    accountname: "account_name",
    sheettype: "sheet_type",
    projectcode: "project_code",
    projectname: "project_name",
    uploadedby: "uploaded_by",
    uploadedon: "uploaded_on",
    status: "status",
    totalrecords: "Total_records",
    processedrecords: "processed_records",
    accountid: "account_id",
    projectid: "project_id",
  };


  const removeSpecialCharsAndLowerCase = (str) => {
    return str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "");
  };

  const handleUploadClick = () => {
    setModalOpen(true);
  };

  const handleDownloadClick = () => {
    setDownloadFileOpen(true);
  }

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleDownloadFileClose = () => {
    setDownloadFileOpen(false);
  };

  const throttledFilter = throttle((uploadedSheets, search, setFilteredRows, setRows) => {
    if (Array.isArray(uploadedSheets)) {
      const mappedRows = uploadedSheets.map((row) => {
        const mappedRow = {};
        Object.keys(fieldNameMapping).forEach((field) => {
          const mappedField = fieldNameMapping[field];
          if (mappedField === "uploaded_on") {
            const rawDate = row[mappedField];
            mappedRow[field] = rawDate
              ? rawDate.replaceAll("Z", "").replaceAll("T", " ")
              : "";
          } else if (mappedField === "status") {
            mappedRow[field] = formatStatus(row[mappedField] || "");
          } else {
            mappedRow[field] = row[mappedField] || "";
          }
        });
        mappedRow.id = row.sheetid || `generated-id-${row.sheetid}`;
        return mappedRow;
      });

      // Apply filtering based on the search value
      const filteredRows = mappedRows.filter((row) =>
        Object.values(row).some((value) =>
          value?.toString().toLowerCase().includes(search.toLowerCase())
        )
      );

      setFilteredRows(filteredRows);
      setRows(mappedRows);
    } else {
      setFilteredRows([]);
      setRows([]);
    }
  }, THROTTLE_DELAY);

  useEffect(() => {
    throttledFilter(uploadedSheets, search, setFilteredRows, setRows);
  }, [uploadedSheets, search]);

  const mappedRows = Array.isArray(filteredRows)
    ? filteredRows.map((row) => {
      const mappedRow = {};
      Object.keys(fieldNameMapping).forEach((field) => {
        const mappedField = fieldNameMapping[field];
        mappedRow[field] = row[mappedField] || "";
      });
      mappedRow.id = row.sheetid;
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
    const params = {
      sortField,
      sortOrder,
      page,
      otherParams: {
        filter: "active",
      },
    };

    fetchSheets(params);
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

  const getAlignmentStyle = (field) => {
    if (["sheetid", "projectid", "status", 'sheettype', 'totalrecords', 'processedrecords'].includes(field)) {
      return { justifyContent: "center", textAlign: "center" };
    } else if (["totalrecords", "processedrecords"].includes(field)) {
      return { justifyContent: "flex-end", textAlign: "right" };
    }
    return { justifyContent: "flex-start", textAlign: "left", };
  };

  const columns = tableData.columns.map((col) => {
    const fieldName = removeSpecialCharsAndLowerCase(col);
    const mappedField = fieldNameMapping[fieldName];
    return {
      field: fieldName,
      headerName: col,
      width: 270,
      sortable: false,
      headerAlign: "center",
      renderHeader: () => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {col}
          {renderSortIcons(col, mappedField)}
        </Box>
      ),
      renderCell: (params) => {

        const alignmentStyle = getAlignmentStyle(params.field);
        const displayValue = params.value || "";

        return (
          <Typography
            className="value-text"
            sx={{
              ...alignmentStyle,
              display: "flex",
              alignItems: "center",
              height: "100%",
              width: "100%",
              textOverflow: "ellipsis",
              overflow: "hidden",
              color: "#00A398",
              // textDecoration: "underline",
              fontSize: "13px",
              lineHeight: 2.5,
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

  const isUpload = useHasAccessToFeature("F029", "P000000002");
  const isSearch = useHasAccessToFeature("F029", "P000000009");

  const handleCompanyClick = (companyId) => {
    (async () => {
      await postRecentlyViewed(companyId, "company");
      navigate(`/accounts/info?companyId=${encodeURIComponent(companyId)}`);
    })();
  };

  const handleProjectsClick = (projectId) => {
    (async () => {
      await postRecentlyViewed(projectId, "project");
      navigate(`/projects/info?projectId=${encodeURIComponent(projectId)}`);
    })();
  }

  const handleRowClick = (params) => {
    if (params.field === "accountname") {
      handleCompanyClick(params.row.accountid);
    } else if (params.field === "projectid" || params.field === "projectname") {
      handleProjectsClick(params.row.projectid);
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

  };

  const fetchDocuments = (filters) => { };

  const handleFilterPanelClose = () => {
    setFilterPanelOpen(false);
    // setFilterPanelOpen(false);
  };
  const appliedFilters = {
    Clients: docFilterState.company,
    Projects: docFilterState.project,
    DocumentType: docFilterState.document,
    SortField: docFilterState.sortField,
    SortOrder: docFilterState.sortOrder
  };

  const applyFiltersAndFetch = (filters) => {
    if (areFiltersApplied(appliedFilters) || filters?.sortField || filters?.sortOrder) {
      fetchDocuments(filters);
    } else {
      fetchDocuments();
      toast.error("Please select at least one filter.");
    }
  };

  const handleSelectedHeaderItem = (item) => {
    setCurrentState(item);
  };

  useEffect(() => {
    const updatedPinStates = {
      // "All Uploaded Sheets": pinnedObject.DOCUMENTS === "ALL",
      "All Uploaded Sheets": pinnedObject.DOCUMENTS === "ALL",
      "Recently Viewed": pinnedObject.DOCUMENTS === "RV",
    };
    setPinStates(updatedPinStates);
  }, [pinnedObject.DOCUMENTS]);

  let currentData = filteredRows?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const placeholderRow = {};
  while (currentData?.length < itemsPerPage) {
    currentData.push(placeholderRow);
  }

  const countActiveFilters = () => {
    let count = 0;

    if (docFilterState?.sheetname?.length > 0 && docFilterState.company[0] !== "ALL") count += 1;
    if (docFilterState?.documentType?.length > 0) count += 1;
    if (docFilterState?.status?.some(phone => phone !== "")) count += 1;
    if (Array.isArray(docFilterState.uploadedBy) && docFilterState.uploadedBy.some(u => u !== "")) {
      count += 1;
    }
    return count;
  };

  const handleSearch = (input) => {
    setSearch(input);
  };

  return (
    <>
      <UploadSheetsModal open={modalOpen} handleClose={handleModalClose} fetchSheets={fetchSheets} />
      <DownloadSampleSheetsModal open={downloadFileOpen} handleClose={handleDownloadFileClose} />
      <Box sx={{ transition: 'opacity 0.3s ease-in-out' }}>
        {useHasAccessToFeature("F029", "P000000008") && (
          <Paper sx={{
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
              heading={"All Uploaded Sheets"}
              // btnName={"upload"}
              page={"upload-sheet"}
              totalItems={filteredRows?.length || 0}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              onUploadClick={handleUploadClick}
              onDownloadClick2={handleDownloadClick}
              onSearch={handleSearch}
              onApplyFilters={applyFiltersAndFetch}
              appliedFilters={appliedFilters}
              createPermission={isUpload}
              searchPermission={isSearch}
              onSelectedItem={handleSelectedHeaderItem}
            />
            <Box sx={{ display: "flex", pt: 0, pb: page === "activity" ? -1 : 0 }}>
              <Box sx={{ marginLeft: "9px", marginTop: "-70px", display: "flex", alignItems: "center" }}>
                {!(page === "activity") && (
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

            </Box>
            <Box
              sx={{
                flexGrow: 1,
                marginLeft: filterPanelOpen ? '300px' : '0',
                mt: "20px"
              }}>
              <TableContainer
                sx={{
                  maxHeight: "82vh",
                  overflowY: "auto",
                  borderTopLeftRadius: "20px",
                }}
              >
                <div style={{
                  ...headerCellStyle,
                  textAlign: "center",
                  width: "100%",
                  height: "calc(101vh - 200px)",
                }}>
                  <ThemeProvider theme={theme}>
                    <DataGrid
                      columns={columns}
                      rows={filteredRows}
                      getRowId={(row) => row.sheetid || `generated-id-${row.sheetid}`}
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
              </TableContainer>
            </Box>
          </Paper>
        )}
        <Toaster />
      </Box>
    </>
  );
}

export default UploadedSheets;