import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import React from "react";

const headerCellStyle = {
  fontSize: "13px",
  borderRight: "1px solid #ddd",
  whiteSpace: "nowrap",
  py: 0.5,
  textAlign: "center",
};

const headerRowStyle = {
  backgroundColor: "rgba(64, 64, 64, 0.1)",
};

const cellStyle = {
  whiteSpace: "nowrap",
  borderRight: "1px solid #ddd",
  textAlign: "left",
  fontSize: "13px",
  py: 1,
};

const tableContainerStyle = {
  borderRadius: "20px",
  overflowX: "auto",
  border: "1px solid #ddd",
  // scrollbarWidth: "none", // For Firefox
  // msOverflowStyle: "none", // For Internet Explorer 10+
  // "&::-webkit-scrollbar": {
  //   display: "none", // For WebKit browsers like Chrome and Safari
  // },
};

function TaskHoursClassification({ columns, data }) {

  return (
    <Box sx={tableContainerStyle}>
      <Table>
        <TableHead>
          <TableRow sx={headerRowStyle}>
            {columns.map((column, index) => (
              <TableCell key={index} sx={headerCellStyle}>
                {column}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell sx={cellStyle}>{data?.routineHours || ""}</TableCell>
            <TableCell sx={cellStyle}>{data?.rndHours || ""}</TableCell>
            <TableCell sx={cellStyle}>
              {data?.reconcileNonRnDHoursOverride
                ? "$ " + data?.reconcileNonRnDHoursOverride
                : ""}
            </TableCell>
            <TableCell sx={cellStyle}>{data?.uncertainHours || ""}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Box>
  );
}

export default TaskHoursClassification;
