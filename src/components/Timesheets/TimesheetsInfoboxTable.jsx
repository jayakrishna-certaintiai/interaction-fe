import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import { formattedDate } from "../../utils/helper/FormatDatetime";
import CompanyTableCell from "../Common/CompanyTableCell";

const styles = {
  boxStyle: {
    p: 1,
    borderTop: "1px solid #E4E4E4",
  },
  tableStyle: {
    minWidth: 650,
  },
  tableHeadCell: {
    border: "none",
    paddingBottom: 0,
    fontWeight: 600,
    fontSize: "13px",
  },
  tableRow: {
    "&:last-child td, &:last-child th": { border: 0 },
  },
  tableCell: {
    fontSize: "13px",
    width: "25%",
  },
};

function TimesheetInfoboxTable({ info }) {
  return (
    <>
      <Box sx={styles.boxStyle}>
        <TableContainer>
          <Table sx={styles.tableStyle} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell sx={styles.tableHeadCell}>Account</TableCell>
                <TableCell sx={styles.tableHeadCell}>Fiscal Year</TableCell>
                <TableCell sx={styles.tableHeadCell}>Month</TableCell>
                <TableCell sx={styles.tableHeadCell}>Uploaded On</TableCell>
                <TableCell sx={styles.tableHeadCell}>Uploaded By</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow sx={styles.tableRow}>
                <CompanyTableCell
                  id={info?.companyId}
                  name={info?.companyName}
                />
                <TableCell sx={styles.tableCell}>
                  {info?.accountingYear ? `FY ${+(info?.accountingYear) - 1}-${info?.accountingYear.slice(-2)}` : ""}
                </TableCell>
                <TableCell sx={styles.tableCell}>
                  {info?.month?.substring(0, 3) + " " + info?.year}
                </TableCell>
                <TableCell sx={styles.tableCell}>
                  {formattedDate(info?.uploadedOn)}
                </TableCell>
                <TableCell
                  sx={{
                    ...styles.tableCell,
                    color: "#00A398",
                    textDecoration: "underline",
                    cursor: "pointer",
                  }}
                >
                  <Link to="/employees/info">{info?.uploadedBy}</Link>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
}

export default TimesheetInfoboxTable;
