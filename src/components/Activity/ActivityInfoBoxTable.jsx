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
import { getDateWithTime } from "../../utils/helper/UpdateTimeDifference";
import CompanyTableCell from "../Common/CompanyTableCell";
import ProjectTableCell from "../Common/ProjectTableCell";

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
    width: "16%",
    whiteSpace: "nowrap",
  },
};

function ActivityInfoboxTable({ data }) {
  return (
    <>
      <Box sx={styles.boxStyle}>
        <TableContainer>
          <Table sx={styles.tableStyle} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell sx={styles.tableHeadCell}>Activity Type</TableCell>
                <TableCell sx={styles.tableHeadCell}>Related To</TableCell>
                <TableCell sx={styles.tableHeadCell}>Comapany Name</TableCell>
                <TableCell sx={styles.tableHeadCell}>Project Name</TableCell>
                <TableCell sx={styles.tableHeadCell}>Started On</TableCell>
                <TableCell sx={styles.tableHeadCell}>Started By</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow sx={styles.tableRow}>
                <TableCell
                  sx={styles.tableCell}
                  // sx={{
                  //   ...styles.tableCell,
                  //   color: "#00A398",
                  //   textDecoration: "underline",
                  // }}
                >
                  {data?.interactionActivityType}
                </TableCell>
                <TableCell
                  sx={styles.tableCell}
                  // sx={{
                  //   ...styles.tableCell,
                  //   color: "#00A398",
                  //   textDecoration: "underline",
                  //   cursor: "pointer",
                  // }}
                >
                  {data?.relatedTo || ""}
                </TableCell>
                <CompanyTableCell
                  id={data?.companyId}
                  name={data?.companyName}
                />
                <ProjectTableCell
                  id={data?.projectId}
                  name={data?.projectName}
                />
                <TableCell sx={styles.tableCell}>
                  {getDateWithTime(data?.createdTime)}
                </TableCell>
                <TableCell sx={styles.tableCell}>{data?.createdBy}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
}

export default ActivityInfoboxTable;
