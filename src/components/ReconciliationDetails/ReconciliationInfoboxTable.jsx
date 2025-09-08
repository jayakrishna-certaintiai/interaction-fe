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
import ContactTableCell from "../Common/ContactTableCell";
import ProjectTableCell from "../Common/ProjectTableCell";
import TimesheetTableCell from "../Common/TimesheetTableCell";

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
    whiteSpace: "nowrap",
  },
  tableRow: {
    "&:last-child td, &:last-child th": { border: 0 },
  },
  tableCell: {
    fontSize: "13px",
    whiteSpace: "nowrap",
    textTransform: "capitalize",
  },
  iconStyle: {
    backgroundColor: "#FD5707",
    borderRadius: "50%",
    color: "white",
    fontSize: "13px",
    ml: 1,
  },
};

function ReconciliationInfoboxTable({ data }) {
  return (
    <>
      <Box sx={styles.boxStyle}>
        <TableContainer>
          <Table sx={styles.tableStyle} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell sx={styles.tableHeadCell}>Status</TableCell>
                <TableCell
                  sx={{
                    ...styles.tableHeadCell,
                    color: "#FD5707",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  Uncertain Hours
                </TableCell>
                <TableCell sx={styles.tableHeadCell}>Revision</TableCell>
                <TableCell sx={styles.tableHeadCell}>Timesheet</TableCell>
                <TableCell sx={styles.tableHeadCell}>Month</TableCell>
                <TableCell sx={styles.tableHeadCell}>Project</TableCell>
                <TableCell sx={styles.tableHeadCell}>Account</TableCell>
                <TableCell sx={styles.tableHeadCell}>Project Manager</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow sx={styles.tableRow}>
                <TableCell sx={styles.tableCell}>
                  {data?.reconcileStatus}
                </TableCell>
                <TableCell
                  sx={{
                    ...styles.tableCell,
                    color: "#FD5707",
                  }}
                >
                  {data?.uncertainHours}
                </TableCell>
                <TableCell sx={styles.tableCell}>
                  {data?.reconcileRevision}
                </TableCell>
                <TimesheetTableCell
                  name={data?.timesheetId}
                  id={data?.timesheetId}
                />
                <TableCell sx={styles.tableCell}>
                  {data?.timesheetMonth && data?.timesheetYear
                    ? data?.timesheetMonth?.substring(0, 3) +
                    "/" +
                    data?.timesheetYear
                    : ""}
                </TableCell>
                <ProjectTableCell id={data?.projectId} name={data?.projectId} />
                <TableCell
                  sx={{
                    ...styles.tableCell,
                    color: "#00A398",
                    textDecoration: "underline",
                    cursor: "pointer",
                  }}
                >
                  {data?.companyName || ""}
                </TableCell>
                <ContactTableCell
                  id={data?.contactId}
                  name={
                    data?.firstName && data?.lastName
                      ? data?.firstName + " " + data?.lastName
                      : ""
                  }
                />
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
}

export default ReconciliationInfoboxTable;
