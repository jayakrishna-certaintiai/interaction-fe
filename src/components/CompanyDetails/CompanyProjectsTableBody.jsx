import { Box, TableBody, TableCell, TableRow } from "@mui/material";
import React, { useEffect, useState } from "react";
import ProjectTableCell from "../Common/ProjectTableCell";

const cellStyle = {
  whiteSpace: "nowrap",
  borderRight: "1px solid #ddd",
  borderLeft: "1px solid #ddd",
  borderTop: "1px solid #ddd",
  textAlign: "center",
  py: 1.5,
  fontSize: "12px",
};
const currencyCellStyle = {
  whiteSpace: "nowrap",
  borderRight: "1px solid #ddd",
  borderLeft: "1px solid #ddd",
  borderTop: "1px solid #ddd",
  textAlign: "right",
  py: 0.5,
  fontSize: "12px",
  color: "#FD5707"
};

function CompanyProjectsTableBody({ filledRows }) {
  const rows =
    filledRows?.length > 10
      ? filledRows
      : Array.from({ length: 10 }, (_, index) => filledRows?.[index] || null);
  const [symbol, setSymbol] = useState("");

  const getSymbol = (sym) => {
    const codePoint = parseInt(sym, 16);
    const symb = String.fromCharCode(codePoint);
    setSymbol(symb);
  };

  useEffect(() => {
    const row = rows[0];
    const sym = row?.currencySymbol;
    getSymbol(sym);
  }, [rows])

  return (

    <TableBody>
      {rows?.map((row, rowIndex) => (
        <TableRow key={rowIndex} sx={{ overflowY: "auto" }}>
          <ProjectTableCell id={row?.projectId} name={row?.projectCode} />
          <ProjectTableCell id={row?.projectId} name={row?.projectName} />
          <TableCell sx={{ ...cellStyle, textAlign: "left" }}>
            {row?.spocName || ""}
          </TableCell>
          <TableCell sx={currencyCellStyle}>
            {row?.totalCosts ? `${symbol}${new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(row?.totalCosts)}` : ""}
          </TableCell>
          <TableCell sx={currencyCellStyle}>
            {row?.rndExpense ? `${symbol}${new Intl.NumberFormat('en-US').format(row?.rndExpense)}` : ""}
          </TableCell>
          <TableCell sx={cellStyle}>
            {row?.rndPotential !== undefined & row?.rndPotential != null ? `${new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(row.rndPotential)}` : ""}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>

  );
}

export default CompanyProjectsTableBody;