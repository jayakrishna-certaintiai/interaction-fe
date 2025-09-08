import React from "react";
import { TableBody, TableRow, TableCell } from "@mui/material";
import { formatCurrency } from "../../utils/helper/FormatCurrency";

const cellStyle = {
  whiteSpace: "nowrap",
  borderRight: "1px solid #ddd",
  borderLeft: "1px solid #ddd",
  textAlign: "center",
  py: 0.5,
  fontSize: "12px",
  color: "#404040",
  height: "30px",
};
const currencyCellStyle = {
  whiteSpace: "nowrap",
  borderRight: "1px solid #ddd",
  textAlign: "right",
  py: 1.5,
  fontSize: "12px",
};


const cellLinkStyle = {
  ...cellStyle,
  color: "#00A398",
  textDecoration: "underline",
  cursor: "pointer",
};

function TeamTableBody({ filledRows, rowsPerPage, symbol }) {
  const rows = Array.from(
    { length: rowsPerPage || 10 },
    (_, index) => filledRows?.[index] || null
  );

  return (
    <>
      <TableBody>
        {rows?.map((row, rowIndex) => (
          <TableRow key={rowIndex}>
            <TableCell sx={cellStyle}>{row?.employeeId || ""}</TableCell>
            <TableCell sx={{ ...cellStyle, textAlign: "left" }}>
              {row?.firstName && row?.firstName + " " + row?.lastName}
            </TableCell>
            <TableCell sx={cellStyle}>{row?.employementType || ""}</TableCell>
            <TableCell sx={{ ...cellStyle, textAlign: "left" }} id={row?.teamMemberId}>{row?.employeeTitle}</TableCell>
            <TableCell id={row?.teamMemberId} sx={currencyCellStyle}>{row?.totalHours}</TableCell>
            <TableCell id={row?.teamMemberId} sx={currencyCellStyle}>{row?.hourlyRate ? formatCurrency(row?.hourlyRate, "en-US", row?.currency || "USD") : ""}</TableCell>
            <TableCell id={row?.teamMemberId} sx={currencyCellStyle}>{row?.totalCost ? formatCurrency(row?.totalCost, "en-US", row?.currency || "USD") : ""}</TableCell>
            <TableCell id={row?.teamMemberId} sx={currencyCellStyle}>{row?.rndPotential}</TableCell>
            <TableCell id={row?.teamMemberId} sx={currencyCellStyle}>{row?.rndCredits ? formatCurrency(row?.rndCredits, "en-US", row?.currency || "USD") : ""}</TableCell>
            <TableCell id={row?.teamMemberId} sx={currencyCellStyle}>{row?.qreCost ? formatCurrency(row?.qreCost, "en-US", row?.currency || "USD") : ""}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  );
}

export default TeamTableBody;
