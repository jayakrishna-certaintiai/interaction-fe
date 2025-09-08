import MoreVertIcon from "@mui/icons-material/MoreVert";
import { TableBody, TableCell, TableRow } from "@mui/material";
import React from "react";
import ProjectTableCell from "../Common/ProjectTableCell";

const cellStyle = {
  whiteSpace: "nowrap",
  borderRight: "1px solid #ddd",
  textAlign: "left",
  py: 1.5,
  fontSize: "12px",
};

const cellLinkStyle = {
  ...cellStyle,
  color: "#00A398",
  textDecoration: "underline",
  cursor: "pointer",
};

function ContactsProjectsTableBody({ filledRows }) {
  const rows =
    filledRows?.length > 10
      ? filledRows
      : Array.from({ length: 10 }, (_, index) => filledRows?.[index] || null);

  return (
    <>
      <TableBody>
        {rows?.map((row, rowIndex) => (
          <TableRow key={rowIndex}>
            {/* <ProjectTableCell id={row?.projectId} name={row?.projectCode} />
            <ProjectTableCell id={row?.projectId} name={row?.projectName} /> */}
            <TableCell sx={cellStyle}>{row?.projectCode || ""}</TableCell>
            <TableCell sx={cellStyle}>{row?.projectName || ""}</TableCell>
            {/* <TableCell sx={cellStyle}>{row?.projectCode || ""}</TableCell> */}
            <TableCell sx={cellStyle}>{row?.projectRole || ""}</TableCell>
            <TableCell sx={cellStyle}>{row?.employeeTitle || ""}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  );
}

export default ContactsProjectsTableBody;
