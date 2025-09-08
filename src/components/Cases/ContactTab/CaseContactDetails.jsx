import MoreVertIcon from "@mui/icons-material/MoreVert";
import { TableBody, TableCell, TableRow } from "@mui/material";
import React from "react";
import ContactTableCell from "../../Common/ContactTableCell";
import ProjectTableCell from "../../Common/ProjectTableCell";
import { color } from "highcharts";

const cellStyle = {
  whiteSpace: "nowrap",
  borderRight: "1px solid #ddd",
  textAlign: "left",
  py: 2.5,
  fontSize: "12px",
};
const cellStyle1 = {
  whiteSpace: "nowrap",
  borderRight: "1px solid #ddd",
  textAlign: "left",
  py: 2.5,
  fontSize: "12px",
  cursor: "pointer",
  color: "#00A398",
  textDecoration: "underline",
};
const cellStyle2 = {
  whiteSpace: "nowrap",
  borderRight: "1px solid #ddd",
  textAlign: "left",
  py: 2.5,
  fontSize: "12px",
  textDecoration: "underline",
};

const cellLinkStyle = {
  ...cellStyle,
  color: "#00A398",
  textDecoration: "underline",
  cursor: "pointer",
};

function CaseContactDetails({ data }) {
  const rows = data?.filter((row) => row !== null && row !== undefined);
  return (
    <>
      <TableBody>
        {rows?.map((row, rowIndex) => (
          <TableRow key={rowIndex}>
            <ContactTableCell id={row?.contactId} name={`${row?.name}`} />
            {/* <TableCell sx={cellStyle1}>{row?.name || ""}</TableCell> */}
            <TableCell sx={cellStyle2}>{row?.email || ""}</TableCell>
            <TableCell sx={cellStyle}>{row?.employeeTitle || ""}</TableCell>
            <TableCell sx={cellStyle}>{row?.role || ""}</TableCell>
            {/* <TableCell sx={cellStyle}>{row?.phone || ""}</TableCell> */}
            {/* <TableCell sx={cellStyle1}>{row?.association || ""}</TableCell> */}
            <ProjectTableCell
              id={row?.associationId}
              name={`${row?.association}`}
            />
            <TableCell sx={cellStyle}>
              {row?.sendSurvey == 1 ? "Yes" : " "}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  );
}

export default CaseContactDetails;
