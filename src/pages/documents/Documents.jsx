import { Paper, Table, TableContainer, Box, Drawer, Badge, createTheme, Typography, ThemeProvider, Tooltip } from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import CustomPagination from "../../components/Common/CustomPagination";
import TableHeader2 from "../../components/Common/TableHeader2";
import TableIntro from "../../components/Common/TableIntro";
import DocumentsModal from "../../components/Documents/DocumentsModal";
import DocumentsTableBody from "../../components/Documents/DocumentsTableBody";
import { BaseURL } from "../../constants/Baseurl";
import { DocumentContext } from "../../context/DocumentContext";
import { FilterListContext } from "../../context/FiltersListContext";
import { areFiltersApplied } from "../../utils/helper/AreFiltersApplied";
import { formattedDate } from "../../utils/helper/FormatDatetime";
import { getTimeDifference } from "../../utils/helper/UpdateTimeDifference";
import { useHasAccessToFeature } from "../../utils/helper/HasAccessToFeature";
import { Authorization_header, token_obj } from "../../utils/helper/Constant";
import usePinnedData from "../../components/CustomHooks/usePinnedData";
import { HiFilter } from "react-icons/hi";
import TimesheetFilters from "../../components/Timesheets/TimesheetFilter";
import ContactFilters from "../../components/Contacts/ContactFilters";
import DocumentFilters from "../../components/Documents/DocumentFilters";
import { postRecentlyViewed } from "../../utils/helper/PostRecentlyViewed";
import { DataGrid, GridToolbarColumnsButton } from "@mui/x-data-grid";
import StraightIcon from '@mui/icons-material/Straight';
import { useNavigate } from "react-router-dom";
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined';
import { formatStatus } from "../../utils/helper/FormatStatus";

const tableData = {
  columns: [
    "Document Name",
    "Account",
    "Category",
    "QRE Potential (%)",
    "Status",
    "Project Name",
    "Uploaded On",
    "Uploaded By",
  ],
  rows: [
    {
      id: 1,
      name: "Attachment 01",
      category: "POC",
      relatedTo: "Project 1",
      uploadedOn: "12/12/2023",
      uploadedBy: "Prabhu Balakrishnan",
    },
    {
      id: 2,
      name: "Attachment 02",
      category: "POC",
      relatedTo: "Apple Inc.",
      uploadedOn: "19/12/2023",
      uploadedBy: "Prabhu Balakrishnan",
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
const documentType = ["SOW", "Technical Documents", "Project Status Reports", "JIRA Dumps", "Minutes of Meetings (MOMs)"];
async function downloadDocument(documentName) {
  function getAccessToken() {
    const tokens = localStorage.getItem('tokens');
    const token_obj = JSON.parse(tokens);
    return token_obj?.accessToken || '';
  }
  try {
    const response = await axios.get(
      `${BaseURL}/api/v1/documents/${localStorage.getItem("userid")}/${documentName}/download`,
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
        responseType: 'blob',
      }
    );

    if (response.data) {
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = documentName;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(blobUrl);
      link.remove();
    } else {
      console.error('File download failed: No data in response');
    }
  } catch (error) {
    console.error('Error downloading file:', error.message);
  }
}
function Documents(page) {
  const { documents, setCurrentState, fetchDocuments, docFilterState, currentState, getDocumentsSortParams } =
    useContext(DocumentContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [modalOpen, setModalOpen] = useState(false);
  const { clientList, fetchClientList } = useContext(FilterListContext);
  const [search, setSearch] = useState("");
  const [filteredRows, setFilteredRows] = useState([]);
  const [latestUpdateTime, setLatestUpdateTime] = useState("Just now");
  const [documentData, setDocumentdata] = useState(null);
  const { pinnedObject } = usePinnedData();
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const [downloaded, setDownloaded] = useState(false);
  const navigate = useNavigate();
  const [pinStates, setPinStates] = useState({
    "All Documents": false,
    "Recently Viewed": false,
  });


  const fieldNameMapping = {
    blobname: "blobName",
    documentid: "documentId",
    documentname: "documentName",
    account: "companyName",
    category: "documentType",
    qrepotential: "rd_score",
    status: "aistatus",
    projectname: "projectName",
    uploadedby: "createdBy",
    uploadedon: "createdTime",
    companyid: "companyId",
  };

  const removeSpecialCharsAndLowerCase = (str) => {
    return str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "");
  };

  useEffect(() => {
    if (Array.isArray(documents)) {
      const mappedRows = documents.map((row) => {
        const mappedRow = {};
        Object.keys(fieldNameMapping).forEach((field) => {
          const mappedField = fieldNameMapping[field];
          if (mappedField === "createdTime") {
            const rawDate = row[mappedField];
            mappedRow[field] = rawDate
              ? rawDate.replaceAll("Z", "").replaceAll("T", " ")
              : "";
          } else if (["aistatus"]?.includes(mappedField))  {
            mappedRow[field] = formatStatus(row[mappedField] || "")
          } else {
            mappedRow[field] = row[mappedField] || "";
          }
        });
        mappedRow.id = row.documentId || `generated-id-${row.documentId}`;
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
  }, [documents, search]);
  const mappedRows = Array.isArray(filteredRows)
    ? filteredRows.map((row) => {
      const mappedRow = {};
      Object.keys(fieldNameMapping).forEach((field) => {
        const mappedField = fieldNameMapping[field];
        mappedRow[field] = row[mappedField] || "";
      });
      mappedRow.id = row.documentid;
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
      getDocumentsSortParams({ sortField, sortOrder });
      const options = {
        sortField,
        sortOrder,
      };
      fetchDocuments(options);
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

  const columns = tableData.columns.map((col) => {
    const fieldName = removeSpecialCharsAndLowerCase(col);
    const mappedField = fieldNameMapping[fieldName];
    const isCentered = ["category", "status", "uploadedon"].includes(fieldName);
    const isRightAligned = ["qrepotential"].includes(fieldName);
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
        const handleDownloadClick = async (documentName) => {
          setDownloaded(true);
          await downloadDocument(documentName);
        };

        let displayValue = params.value;
        if (fieldName === "qrepotential" && displayValue !== "") {
          displayValue = parseFloat(displayValue).toFixed(2);
        }
        if (fieldName === "account") {
          return (
            <Typography
              className="value-text"
              sx={{
                textDecoration: "underline",
                color: "#00A398",
                fontSize: "13px",
                lineHeight: 2.5,
                padding: "0 10px",
              }}
              title={params.value}
            >
              {params.value}
            </Typography>
          );
        }
        const isSpecialField = fieldName === "documentname";
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
            {isSpecialField && (
              <Tooltip title={downloaded ? "Downloaded!" : "Download"}>
                <CloudDownloadOutlinedIcon
                  style={{
                    fontSize: "20px",
                    marginRight: "5px",
                    marginLeft: "-5px",
                    color: "#00A398",
                    cursor: "pointer",
                  }}
                  onClick={() => handleDownloadClick(params.row.blobname)}
                />
              </Tooltip>
            )}
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
  const handleCompanyClick = (companyId) => {
    (async () => {
      await postRecentlyViewed(companyId, "company");
      navigate(`/accounts/info?companyId=${encodeURIComponent(companyId)}`);
    })();
  };
  const handleRowClick = (params) => {
    if (params.field === "account") {
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
  const handleFilterClose = () => {
    setFilterPanelOpen(false);
  };

  const handleChangePage = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleUploadClick = () => {
    setModalOpen(true);
  };

  useEffect(() => {
    const shouldFetchWithFilters =
      docFilterState.companyId.length > 0 ||
      docFilterState.projectId ||
      docFilterState.document;

    const options = {
      ...(docFilterState.companyId.length > 0 && { companyIds: docFilterState.companyId }),
      ...(docFilterState.projectId && { relationId: docFilterState.projectId }),
      ...(docFilterState.document && { documentType: docFilterState.document }),
    };

    fetchDocuments(shouldFetchWithFilters ? options : undefined);
  }, [currentState, Authorization_header]);

  const handleSelectedHeaderItem = (item) => {
    setCurrentState(item);
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


  useEffect(() => {
    fetchClientList();
    setCurrentState(
      pinnedObject?.DOCUMENTS === "RV" ? "Recently Viewed" : "All Documents"
    );
  }, [Authorization_header]);
  useEffect(() => {
    const updatedPinStates = {
      "All Documents": pinnedObject.DOCUMENTS === "ALL",
      "Recently Viewed": pinnedObject.DOCUMENTS === "RV",
    };
    setPinStates(updatedPinStates);
  }, [pinnedObject.DOCUMENTS]);


  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleChangeItemsPerPage = (items) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  let currentData = filteredRows?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Ensuring currentData always has 20 items
  const placeholderRow = {};
  while (currentData?.length < itemsPerPage) {
    currentData.push(placeholderRow);
  }

  const handleSearch = (input) => {
    setSearch(input);
  };

  // useEffect(() => {
  //   if (documents) {
  //     const filteredData = documents?.filter(
  //       (task) => {
  //         return task?.relatedTo?.toLowerCase()?.includes(search?.toLowerCase()) ||
  //           task?.documentName?.toLowerCase()?.includes(search?.toLowerCase()) ||
  //           task?.documentType?.toLowerCase()?.includes(search?.toLowerCase()) ||
  //           task?.createdBy?.toLowerCase()?.includes(search?.toLowerCase()) ||
  //           task?.RnDScope?.toLowerCase()?.includes(search?.toLowerCase()) ||
  //           task?.status?.toLowerCase()?.includes(search?.toLowerCase()) ||
  //           task?.companyName?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
  //           task?.rd_score?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
  //           task?.aistatus?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
  //           task?.projectName?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
  //           formattedDate(task?.createdTime)
  //             ?.toLowerCase()
  //             ?.includes(search?.toLowerCase())
  //       }
  //     );
  //     setFilteredRows(filteredData);
  //     setCurrentPage(1);
  //   }
  // }, [documents, search]);

  useEffect(() => {
    const timeDifference = getTimeDifference(documents, "createdTime");
    setLatestUpdateTime(timeDifference);
  }, [documents]);

  const handleFormSubmit = async (formData) => {
    const apiUrl = `${BaseURL}/api/v1/documents/${localStorage.getItem(
      "userid"
    )}/upload-doc`;

    const formDataToSubmit = new FormData();
    formData.files?.forEach((file) => {
      formDataToSubmit.append("documents", file);
    });

    formDataToSubmit.append("companyId", formData.companyId);
    formDataToSubmit.append("relatedTo", formData.relatedTo);
    formDataToSubmit.append("relationId", formData.relationId);
    formDataToSubmit.append("docType", formData.doc);

    toast.loading("Uploading Documents...");
    try {
      const tokens = localStorage.getItem('tokens');
      const token_obj = JSON.parse(tokens);

      const response = await axios.post(apiUrl, formDataToSubmit, {
        headers: {
          "Content-Type": "multipart/form-data",
          'Authorization': `Bearer ${token_obj?.accessToken}`
        },
      });
      setDocumentdata(response?.data?.data);
      fetchDocuments();
      handleModalClose();
      toast.dismiss();
      toast.success(response?.data?.message || "The file has been uploaded successfully and is currently in the processing queue. You'll receive a notification once processing is complete.");
    } catch (error) {
      toast.dismiss();
      toast.error(error?.response?.data?.message || "Failed to upload document.")
    }
  };

  const isUpload = useHasAccessToFeature("F029", "P000000002");
  const isSearch = useHasAccessToFeature("F029", "P000000009");

  const countActiveFilters = () => {
    let count = 0;

    if (docFilterState?.company?.length > 0 && docFilterState.company[0] !== "ALL") count += 1;
    if (docFilterState?.documentType?.length > 0) count += 1;
    if (docFilterState?.status?.some(phone => phone !== "")) count += 1;
    if (Array.isArray(docFilterState.uploadedBy) && docFilterState.uploadedBy.some(u => u !== "")) {
      count += 1;
    }
    return count;
  };

  return (
    <>
      <Box
        sx={{
          transition: 'opacity 0.3s ease-in-out',
        }}
      >
        {useHasAccessToFeature("F029", "P000000008") && (
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
              heading={"All Documents"}
              btnName={"Upload"}
              page={"document"}
              totalItems={filteredRows?.length || 0}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              onUploadClick={handleUploadClick}
              onSearch={handleSearch}
              latestUpdateTime={latestUpdateTime?.difference}
              documentType={documentType}
              onApplyFilters={applyFiltersAndFetch}
              appliedFilters={appliedFilters}
              createPermission={isUpload}
              searchPermission={isSearch}
              onSelectedItem={handleSelectedHeaderItem}
            />
            <DocumentsModal
              open={modalOpen}
              handleClose={handleModalClose}
              handleSubmit={handleFormSubmit}
              type={"upload"}
              clients={clientList}
              docType={documentType}
              page="document"
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
                  <DocumentFilters
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
                        const id = row.documentid;
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
                  <TableHeader2 tableData={tableData} page={"document"} />
                  <DocumentsTableBody data={currentData} />
                </Table> */}
              </TableContainer>
            </Box>
          </Paper>
        )}
        <Toaster />
      </Box >
    </>
  );
}

export default Documents;
