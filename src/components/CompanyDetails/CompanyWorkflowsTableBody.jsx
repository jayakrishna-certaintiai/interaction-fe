import React from "react";
import { TableBody, TableRow, TableCell } from "@mui/material";

const cellStyle = {
  whiteSpace: "nowrap",
  borderRight: "1px solid #ddd",
  textAlign: "center",
  py: 0.5,
  fontSize: "12px",
};

const cellLinkStyle = {
  ...cellStyle,
  color: "#00A398",
  textDecoration: "underline",
  cursor: "pointer",
};

function CompanyWorkflowsTableBody({ filledRows }) {
  const rows = Array.from(
    { length: 10 },
    (_, index) => filledRows?.[index] || null
  );

  return (
    <>
      <TableBody>
        {rows?.map((row, rowIndex) => (
          <TableRow key={rowIndex}>
            <TableCell sx={cellStyle}>{rowIndex + 1 || ""}</TableCell>
            <TableCell sx={{ ...cellLinkStyle}}>
              {row?.workflowId}
            </TableCell>
            <TableCell sx={cellStyle}>{row?.type || ""}</TableCell>
            <TableCell sx={{ ...cellLinkStyle}}>{row?.primaryContact || ""}</TableCell>
            <TableCell sx={cellStyle}>{row?.createdOn || ""}</TableCell>
            <TableCell sx={{ ...cellLinkStyle}}>{row?.createdBy || ""}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  );
}

export default CompanyWorkflowsTableBody;
