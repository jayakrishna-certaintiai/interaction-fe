import MoreVertIcon from "@mui/icons-material/MoreVert";
import { TableBody, TableCell, TableRow } from "@mui/material";
import React, { useEffect, useState } from "react";
import ContactTableCell from "../Common/ContactTableCell";

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
  py: 0.5,
};

function CompanyDetailsTableBody({ filledRows = [] }) {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const rowms =
      filledRows?.length > 10
        ? filledRows
        : Array.from({ length: 10 }, (_, index) => filledRows?.[index] || null);
    setRows(rowms);

    return (() => {
      setRows([]);
    })
  }, [filledRows]);
  return (
    <TableBody>
      {Array.isArray(filledRows) && filledRows?.map((row, rowIndex) => (
        <TableRow key={row?.companyId}>

          <ContactTableCell
            id={row?.contactId}
            name={row?.employeeId}
            nameLength={10}
          />
          <ContactTableCell
            id={row?.contactId}
            name={
              row?.firstName || row?.lastName
                ? (row?.firstName && row.firstName) + " " + (row?.lastName ? row.lastName : "")
                : ""
            }
            nameLength={25}
          />
          <TableCell sx={{ ...cellStyle, textAlign: "left" }}>{row?.employeeTitle || ""}</TableCell>
          <TableCell sx={{ ...cellStyle, textAlign: "left" }}>{row?.employementType || ""}</TableCell>
          <TableCell sx={{ ...cellStyle, textAlign: "left" }}>
            {row?.email || ""}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
}

export default CompanyDetailsTableBody;
