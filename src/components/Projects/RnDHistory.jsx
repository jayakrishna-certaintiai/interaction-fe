import React, { useEffect, useRef, useState } from "react";
import { Box, Table, TableCell, TableContainer, ThemeProvider, Tooltip, Typography, createTheme } from "@mui/material";
import { DataGrid, GridToolbarColumnsButton } from "@mui/x-data-grid";
import ContentModal from "./ContentModal";
import ContentIcon from "./ContentIcon";
const tableData = {
  columns: [
    "Sequence",
    "Type",
    "Contents",
    "QRE (%) - Score",
    "Date",
  ],
};
const styles = {
  cellStyle: {
    whiteSpace: "nowrap",
    borderRight: "1px solid #ddd",
    textAlign: "left",
    fontSize: "13px",
    py: 1,
  },
}
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
function RnDHistory({
  rndHistoryData,
  page,
  projectId
}) {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filteredProjectTeam, setFilteredProjectTeam] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredRow, setFilteredRows] = useState([]);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const [showTechSummary, setShowTechSummary] = useState(false);
  const [selectedSequence, setSelectedSequence] = useState(null);
  const textFieldRef = useRef(null);

  const fieldNameMapping = {
    sequence: "sequence_no",
    contectid: "id",
    type: "type",
    date: "date",
    contents: "content",
    qrescore: "rd_score"
  };

  const handleTechSummaryClose = () => {
    setShowTechSummary(false);
    // Do not reset the selectedSequence when closing the modal, unless necessary
  };

  const handleSelectSequence = (id) => {
    const selectedRow = rows.find(row => row.id === id);
  };



  const removeSpecialCharsAndLowerCase = (str) => {
    return str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "");
  };

  const mappedRows = rndHistoryData?.map((row) => ({
    id: `${row.id}`,  // Ensure the row id is correctly used
    type: row.type || "",
    date: row.date || "",
    content: typeof row.content === "string"
      ? row.content
      : Object.values(row.content || {}).map(item => item.content).join("\n"),
    rd_score: row.rd_score || "",
    sequence_no: row.sequence_no || "",
  })) || [];  // Remove sequence_no or index from here

  const [rows, setRows] = useState(mappedRows);  // Use the updated rows without indices

  const sortRows = (rows) => {
    if (!Array.isArray(rows) || !sortField || !sortOrder) return rows || [];
    return [...rows].sort((a, b) => {
      const fieldA = a[sortField];
      const fieldB = b[sortField];
      if (fieldA < fieldB) return sortOrder === "asc" ? -1 : 1;
      if (fieldA > fieldB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  };

  useEffect(() => {
    const sortedRows = sortRows(rows);
    setRows(sortedRows);
  }, [sortField, sortOrder]);

  const getDynamicIndex = (row) => {
    const index = row.id;
    return index;
  };

  const dynamicIndex = rows.length > 0 ? getDynamicIndex() : 0;
  const columns = tableData.columns.map((col) => {
    const fieldName = removeSpecialCharsAndLowerCase(col);
    const mappedField = fieldNameMapping[fieldName]; return {
      field: mappedField || fieldName,
      headerName: col,
      flex: 1,
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
        </Box>
      ),
      renderCell: (params) => {

        const isCentered = ["sequence", "date"].includes(params.field);
        const isRightAligned = params.field === "rd_score";
        const isRdScore = params.field === "rd_score";

        const formattedValue = isRdScore && params.value != null
          ? Number(params.value).toFixed(2)
          : params.value;
        const rowIndex = rows.findIndex(row => row.id === params.row.id);

        if (col === "Contents") {
          return (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-evenly",
                alignItems: "center",
                width: "100%",
              }}
            >
              <ContentIcon
                sx={{ width: "10px", padding: 10, pb: "-10px" }}
                showTechSummary={showTechSummary}
                setShowTechSummary={setShowTechSummary}
                onClick={() => handleSelectSequence(params.row.id)}
              />
            </Box>
          );
        }

        return (
          <Box
            sx={{
              display: "flex",
              justifyContent: isCentered
                ? "center"
                : isRightAligned
                  ? "flex-end"
                  : "flex-start",
              alignItems: "center",
              height: "100%",
              width: "100%",
              padding: "0 10px",
              textOverflow: "ellipsis",
              overflow: "hidden",
              color: isRdScore ? "#FD5707" : "inherit",
            }}
          >
            {formattedValue || ""}
          </Box>
        );
      }
    };
  });

  return (
    <>
      <ContentModal
        id={rows[dynamicIndex]?.id}
        open={showTechSummary}
        textFieldRef={textFieldRef}
        handleClose={handleTechSummaryClose}
        projectId={projectId}
      />
      <Box
        sx={{
          borderTop: "1px solid #E4E4E4",
          p: 1,
          flexGrow: 1,
          px: 2,
        }}
      >
        <TableContainer sx={{ maxHeight: "82vh", borderRadius: "20px", height: 300 }}>
          <Table stickyHeader aria-label="simple table">
            <div
              style={{
                ...headerCellStyle,
                textAlign: "center",
                width: "100%",
                height: "calc(58vh - 80px)",
              }}
            >
              <ThemeProvider theme={theme}>
                <DataGrid
                  columns={columns}
                  rows={mappedRows}
                  getRowId={(row) => row.id}
                  loading={false}
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
                      width: '10px',
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
          </Table>
        </TableContainer>
      </Box>
    </>
  );
}

export default RnDHistory;

