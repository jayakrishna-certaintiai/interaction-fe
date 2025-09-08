import { TableBody, TableCell, TableRow } from "@mui/material";
import React from "react";
import CompanyTableCell from "../Common/CompanyTableCell";
import ProjectTableCell from "../Common/ProjectTableCell";
import ReconciliationTableCell from "../Common/ReconciliationTableCell";
import TimesheetTableCell from "../Common/TimesheetTableCell";

const cellStyle = {
  whiteSpace: "nowrap",
  borderRight: "1px solid #ddd",
  textAlign: "center",
  fontSize: "13px",
  py: 1,
};

function ReconciliationTableBody({ data, currentPage, itemsPerPage }) {
  return (
    <>
      <TableBody>
        {data?.map((row, rowIndex) => (
          <TableRow key={rowIndex}>
            {/* <TableCell sx={cellStyle}>
              {(currentPage - 1) * itemsPerPage + rowIndex + 1 || ""}
            </TableCell> */}
            <ReconciliationTableCell
              name={row?.reconciliationIdentifier || ""}
              id={row?.reconcileId}
            />
            <TableCell sx={cellStyle}>{row?.reconcileRevision || ""}</TableCell>
            <TimesheetTableCell name={row?.timesheetId} id={row?.timesheetId} />
            <TableCell sx={cellStyle}>
              {row?.timesheetMonth && row?.timesheetYear
                ? row?.timesheetMonth + "/" + row?.timesheetYear
                : ""}
            </TableCell>
            <ProjectTableCell id={row?.projectId} name={row?.projectName} />
            <CompanyTableCell id={row?.companyId} name={row?.companyName} />
            <TableCell sx={cellStyle}>{row?.routineHours || ""}</TableCell>
            <TableCell sx={cellStyle}>{row?.rndHours || ""}</TableCell>
            <TableCell sx={{ ...cellStyle, color: "#FD5707" }}>
              {row?.uncertainHours || ""}
            </TableCell>
            <TableCell sx={{ ...cellStyle, color: "#00A398" }}>
              {row?.reconcileRnDHoursOverride || ""}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  );
}

export default ReconciliationTableBody;
