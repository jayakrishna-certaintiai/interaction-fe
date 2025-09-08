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
  textAlign: "left",
  backgroundColor: "#ececec",
};

const headerRowStyle = {
  backgroundColor: "rgba(64, 64, 64, 0.1)",
};

const cellStyle = {
  whiteSpace: "nowrap",
  borderRight: "1px solid #ddd",
  textAlign: "left",
  fontSize: "13px",
  py: 0.5,
  height: "30px",
};

const tableContainerStyle = {
  borderRadius: "20px",
  overflow: "auto",
  border: "1px solid #ddd",
  height: "50vh",
};

function TaskList({ columns, data }) {
  const rows =
    data?.length > 10
      ? data
      : Array.from({ length: 10 }, (_, index) => data?.[index] || null);

  return (
    <Box sx={tableContainerStyle}>
      <Table stickyHeader>
        <TableHead>
          <TableRow sx={headerRowStyle}>
            {columns?.map((column, index) => (
              <TableCell
                key={index}
                sx={{
                  ...headerCellStyle,
                  ...(index === 0 && { borderTopLeftRadius: "20px" }),
                  ...(index === columns.length - 1 && {
                    borderTopRightRadius: "20px",
                    borderRight: "none",
                  }),
                }}
              >
                {column}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows?.map((item, index) => (
            <TableRow key={index}>
              <TableCell sx={cellStyle}>{item?.taskDate || ""}</TableCell>
              <TableCell sx={cellStyle}>
                {item?.firstname && item?.lastName
                  ? item?.firstname + " " + item?.lastName
                  : ""}
              </TableCell>
              <TableCell sx={cellStyle}>
                {item?.taskDescription || ""}
              </TableCell>
              <TableCell sx={{ ...cellStyle, borderRight: "none" }}>
                {item?.taskEffort || ""}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}

export default TaskList;
