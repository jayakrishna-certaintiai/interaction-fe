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

function ContactInfoboxTable({ data }) {
  return (
    <>
      <Box sx={styles.boxStyle}>
        <TableContainer>
          <Table sx={styles.tableStyle} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell sx={styles.tableHeadCell}>Employee Title</TableCell>
                <TableCell sx={styles.tableHeadCell}>Account</TableCell>
                <TableCell sx={styles.tableHeadCell}>Employee Type</TableCell>
                <TableCell sx={styles.tableHeadCell}>Email Address</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow sx={styles.tableRow}>
                <TableCell sx={{ ...styles.tableCell, color: "#FD5707" }}>
                  {data?.employeeTitle}
                </TableCell>
                <CompanyTableCell
                  id={data?.companyId}
                  name={data?.companyName}
                />
                <TableCell
                  sx={{
                    ...styles.tableCell,
                    color: "#00A398",
                    textDecoration: "underline",
                  }}
                >
                  {data?.employementType}
                </TableCell>
                <TableCell
                  sx={{
                    ...styles.tableCell,
                    color: "#00A398",
                    textDecoration: "underline",
                    textAlign: "left",
                  }}
                >
                  {data?.email}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
}

export default ContactInfoboxTable;
