import React from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

const styles = {
  boxStyle: {
    p: 0,
    borderTop: "1px solid #E4E4E4",
  },
  tableStyle: {
    minWidth: 650,
    p: 0,
    mt: -1,
  },
  tableStyle1: {
    minWidth: 650,
    p: 0,
  },
  tableHeadCell: {
    border: "none",
    paddingBottom: 0,
    fontWeight: 600,
    fontSize: "13px",
    textAlign: "left",
    padding: "12px 16px",
    whiteSpace: "nowrap",
  },
  tableHeadCell2: {
    border: "none",
    paddingBottom: 0,
    fontWeight: 600,
    fontSize: "13px",
    textAlign: "left",
    padding: "10px 5px",
  },
  tableRow: {
    "&:last-child td, &:last-child th": { border: 0 },
  },
  tableCell: {
    fontSize: "13px",
    paddingTop: "1px",
    paddingLeft: "7px"
  },
  tableCell1: {
    fontSize: "13px",
    color: "#00A398",
    paddingTop: "1px",
    paddingBottom: "-10px",
  },
  tableCell2: {
    fontSize: "13px",
    color: "#FD5707",
    paddingTop: "1px",
  },
};

function CompanyInfoboxTable({ info }) {

  const formatCurrency = (amount, locale = 'en-US', currencySymbol = 'USD') => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencySymbol,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };
  return (
    <>
      <Box sx={styles.boxStyle}>
        <TableContainer>
          <Table sx={{ ...styles.tableStyle, paddingLeft: -10 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell sx={styles.tableHeadCell}>Accounts ID</TableCell>
                <TableCell sx={styles.tableHeadCell}>Primary Contact</TableCell>
                <TableCell sx={styles.tableHeadCell}>No. of Projects</TableCell>
                <TableCell sx={styles.tableHeadCell}>Fiscal Year</TableCell>
                {/* <TableCell sx={styles.tableHeadCell}>Total QRE (%)</TableCell>
                <TableCell sx={styles.tableHeadCell}>FTE Expense</TableCell>
                <TableCell sx={styles.tableHeadCell}>Subcon Expense</TableCell>
                <TableCell sx={styles.tableHeadCell}>FTE QRE Expense</TableCell>
                <TableCell sx={styles.tableHeadCell}>Subcon QRE Expense</TableCell>
                <TableCell sx={styles.tableHeadCell}>Total QRE Expense</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow sx={styles.tableRow}>
                <TableCell sx={styles.tableCell1}>{info?.companyIdentifier}</TableCell>
                <TableCell sx={styles.tableCell}>
                  {info?.primaryContact}
                </TableCell>
                <TableCell sx={styles.tableCell2}>
                  {info?.totalProjects}
                </TableCell>
                <TableCell sx={styles.tableCell2}>
                  {info?.fiscalYear ? `FY ${+(info?.fiscalYear) - 1}-${info?.fiscalYear.slice(-2)}` : ""}
                </TableCell>
                {/* <TableCell sx={{ ...styles.tableCell, color: "#FD5707" }}>
                  {info?.qrePercentage?.toFixed(2).toLocaleString('en-US') || ""}
                </TableCell>
                <TableCell sx={{ ...styles.tableCell, color: "#00A398", textAlign: "left" }}>
                  {info?.fteCost ? formatCurrency(info?.fteCost, "en-US", info?.currency || "USD") : ""}
                </TableCell>
                <TableCell sx={{ ...styles.tableCell, color: "#00A398", textAlign: "left" }}>
                  {info?.subconCost ? formatCurrency(info?.subconCost, "en-US", info?.currency || "USD") : ""}
                </TableCell>
                <TableCell sx={{ ...styles.tableCell, color: "#00A398", textAlign: "left" }}>
                  {info?.fteQRE ? formatCurrency(info?.fteQRE, "en-US", info?.currency || "USD") : ""}
                </TableCell>
                <TableCell sx={{ ...styles.tableCell, color: "#00A398", textAlign: "left" }}>
                  {info?.subconQRE ? formatCurrency(info?.subconQRE, "en-US", info?.currency || "USD") : ""}
                </TableCell>
                <TableCell sx={styles.tableCell}>
                  {info?.totalQRE ? formatCurrency(info?.totalQRE, "en-US", info?.currency || "USD") : ""}
                </TableCell> */}
              </TableRow>
            </TableBody>
            {/* <TableHead>
              <TableRow>
                <TableCell sx={styles.tableHeadCell}>R&D Credits</TableCell>
                <TableCell sx={styles.tableHeadCell}>Project Status</TableCell>
                <TableCell sx={styles.tableHeadCell}>Survey Status</TableCell>
                <TableCell sx={styles.tableHeadCell}>Timesheet Status</TableCell>
                <TableCell sx={styles.tableHeadCell}>FTE Expense Status</TableCell>
                <TableCell sx={styles.tableHeadCell}>Subcon Expense Status</TableCell>
                <TableCell sx={styles.tableHeadCell}>Last Updated By</TableCell>
                <TableCell sx={styles.tableHeadCell}>Last Updated Date</TableCell>
                <TableCell sx={styles.tableHeadCell}>Data Gathering</TableCell>
                <TableCell sx={styles.tableHeadCell}>Pending Data</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow sx={styles.tableRow}>
                <TableCell sx={styles.tableCell}>
                  {info?.rndCredits ? formatCurrency(info?.totalQRE, "en-US", info?.currency || "USD") : ""}
                </TableCell>
                <TableCell sx={styles.tableCell}>
                  {info?.projectStatus}
                </TableCell>
                <TableCell sx={styles.tableCell}>
                  {info?.surveyStatus}
                </TableCell>
                <TableCell sx={styles.tableCell}>
                  {info?.timesheetStatus}
                </TableCell>
                <TableCell sx={styles.tableCell}>
                  {info?.FTEExpenseStatus}
                </TableCell>
                <TableCell sx={styles.tableCell}>
                  {info?.subconExpenseStatus}
                </TableCell>
                <TableCell sx={styles.tableCell}>
                  {info?.lastUpdatedBy}
                </TableCell>
                <TableCell sx={styles.tableCell}>
                  {info?.lastUpdatedDate}
                </TableCell>
                <TableCell sx={styles.tableCell}>
                  {info?.dataGathering}
                </TableCell>
                <TableCell sx={styles.tableCell}>
                  {info?.pendingData}
                </TableCell>
              </TableRow>
            </TableBody> */}
          </Table>
        </TableContainer>
      </Box>
    </>
  );
}

export default CompanyInfoboxTable;
