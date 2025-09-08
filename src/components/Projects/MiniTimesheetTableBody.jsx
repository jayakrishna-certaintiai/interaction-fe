import { TableBody, TableCell, TableRow } from "@mui/material";
import React from "react";
import FormatDatetime from "../../utils/helper/FormatDatetime";
import TimesheetTableCell from "../Common/TimesheetTableCell";

const cellStyle = {
  whiteSpace: "nowrap",
  borderRight: "1px solid #ddd",
  textAlign: "center",
  py: 0.5,
  fontSize: "12px",
  color: "#404040",
  height: "30px",
};

const cellLinkStyle = {
  ...cellStyle,
  color: "#00A398",
  textDecoration: "underline",
  cursor: "pointer",
};

function MiniTimesheetTableBody({ filledRows, rowsPerPage }) {
  const rows = Array.from(
    { length: rowsPerPage || 10 },
    (_, index) => filledRows?.[index] || null
  );

  return (
    <>
      <TableBody>
        {rows?.map((row, rowIndex) => (
          <TableRow key={rowIndex}>
            <TimesheetTableCell name={row?.originalFileName} id={row?.originalFileName} />
            {/* <TableCell sx={cellStyle}>
              {row?.timesheetMonth && row?.timesheetYear
                ? row?.timesheetMonth?.substring(0, 3) +
                " " +
                row?.timesheetYear
                : ""}
            </TableCell> */}
            <TableCell
              sx={{
                ...cellStyle, textAlign: "left",
                color:
                  row?.status === "Pending" ? "#FD5707" : "#404040",
              }}
            >
              {row?.status || ""}
            </TableCell>
            <TableCell sx={cellStyle}>
              {FormatDatetime(row?.uploadedOn) || ""}
            </TableCell>
            <TableCell sx={cellStyle}>{row?.totalhours?.toLocaleString('en-US') || ""}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  );
}

export default MiniTimesheetTableBody;
