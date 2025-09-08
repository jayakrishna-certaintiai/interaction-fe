import { TableBody, TableCell, TableRow } from '@mui/material';
import React from 'react';
import FormatDatetime from '../../utils/helper/FormatDatetime';
import CompanyTableCell from './CompanyTableCell';

const styles = {
  cellStyle: {
    whiteSpace: "nowrap",
    borderRight: "1px solid #ddd",
    borderLeft: "1px solid #ddd",
    textAlign: "left",
    fontSize: "13px",
    py: 1.5,
  }
};

const CommonTableBody = ({ data, currentPage, itemsPerPage }) => {
  // Calculate empty rows needed
  const emptyRows = itemsPerPage - (data?.length || 0);

  return (
    <TableBody>
      {data?.map((row, rowIndex) => (
        <TableRow key={rowIndex}>
          <TableCell sx={{ ...styles.cellStyle }}>{row?.sheetId || ""}</TableCell>
          <TableCell sx={{ ...styles.cellStyle, color: "#00A398" }}>
            {row?.sheetName ? (
              <a
                href={row?.sheetUrl || "#"} // URL to the file
                style={{ textDecoration: 'underline', color: "#00A398" }}
              >
                {row?.sheetName}
              </a>
            ) : ""}
          </TableCell>
          <CompanyTableCell id={row?.companyId} name={row?.companyName || ""} />
          <TableCell sx={{ ...styles.cellStyle, color: "#FD5707" }}>
            {row?.sheetType
              ? row?.sheetType
                .toLowerCase()
                .replace(/(^\w|[^a-zA-Z0-9]+(\w))/g, (match, p1, chr) => ' ' + p1.toUpperCase())
                .trim()
              : ""}
          </TableCell>
          <TableCell sx={{ ...styles.cellStyle }}>{row?.uploadedBy || ""}</TableCell>
          <TableCell sx={{ ...styles.cellStyle }}>{FormatDatetime(row?.uploadedOn) || ""}</TableCell>
          <TableCell sx={{ ...styles.cellStyle }}>
            {row?.status
              ? row?.status
                .toLowerCase()
                .replace(/(^\w|[^a-zA-Z0-9]+(\w))/g, (match, p1, chr) => ' ' + p1.toUpperCase())
                .trim()
              : ""}
          </TableCell>
          <TableCell sx={{ ...styles.cellStyle }}>{row && `${row.acceptedrecords || ""} ${row.acceptedrecords ? `of` : ""} ${row.totalrecords || ""}`}</TableCell>
        </TableRow>
      ))}


    </TableBody>
  );
};

export default CommonTableBody;
