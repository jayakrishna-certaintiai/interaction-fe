//////// Case Projects tab
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { formattedDate } from "../../utils/helper/FormatDatetime";
import { CaseContext } from "../../context/CaseContext";
import { BaseURL } from "../../constants/Baseurl";
import axios from "axios";
import { Authorization_header } from "../../utils/helper/Constant";

const styles = {
  boxStyle: {
    p: 0,
    borderTop: "1px solid #E4E4E4",
  },
  tableStyle: {
    minWidth: 650,
    mt: -1,
  },
  tableHeadCell: {
    border: "none",
    paddingBottom: 0,
    fontWeight: 600,
    fontSize: "13px",
  },
  tableHeadCell2: {
    border: "none",
    paddingBottom: 0,
    fontWeight: 600,
    fontSize: "13px",
    paddingLeft: "0%",
  },
  tableRow: {
    "&:last-child td, &:last-child th": { border: 0 },
  },
  tableCell: {
    fontSize: "13px",
    width: "17.5%",
    color: "#29B1A8",
    fontWeight: 400,
    pt: "2px",
    pl: "20px"
  },
  tableCell1: {
    pl: "0%",
    pt: "1.5px",
  },
  tableCell2: {
    fontSize: "13px",
    width: "17.5%",
    paddingLeft: "-10%",
    color: "#29B1A8",
    fontWeight: 400,
    pt: "2px",
  },
};

function CaseInfoboxTable({ currencySymbol, currency }) {
  const { detailedCase, setDetailedCase } = React.useContext(CaseContext);
  const [modalOpen, setModalOpen] = useState(false);

  const handleModalClose = () => {
    setModalOpen(false);
  };


  return (
    <>
      <Box sx={styles.boxStyle}>
        <TableContainer>
          <Table sx={styles.tableStyle} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell sx={styles.tableHeadCell}>Case Type</TableCell>
                <TableCell sx={styles.tableHeadCell}>Case Owner</TableCell>
                <TableCell sx={styles.tableHeadCell}>Fiscal Year </TableCell>
                <TableCell sx={styles.tableHeadCell}>Created on</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow sx={styles.tableRow}>
                <TableCell sx={styles.tableCell}>
                  {detailedCase?.caseType}
                </TableCell>
                <TableCell sx={styles.tableCell}>
                  {detailedCase?.caseOwnerName}
                </TableCell>
                <TableCell sx={{ ...styles.tableCell, color: "#FD5707" }}>
                  {detailedCase?.accountingYear ? `FY ${+(detailedCase?.accountingYear) - 1}-${detailedCase?.accountingYear.slice(-2)}` : ""}
                </TableCell>
                <TableCell sx={styles.tableCell}>
                  {formattedDate(detailedCase?.createdOn).split(" ")[0]}
                </TableCell>

              </TableRow>
            </TableBody>
          </Table>
          <Table sx={styles.tableStyle} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell sx={styles.tableHeadCell}>Total Project</TableCell>
                <TableCell sx={styles.tableHeadCell}>{`Total Cost (${currencySymbol} ${currency?.toLocaleString('en-US')})`}</TableCell>
                <TableCell sx={styles.tableHeadCell}>{`Total QRE Cost (${currencySymbol} ${currency?.toLocaleString('en-US')})`}</TableCell>
                <TableCell sx={styles.tableHeadCell}>{`Average QRE Potential (${(("%")[0]).toUpperCase() + ("%").slice(1)})`}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow sx={styles.tableRow}>
                {/* <TableCell sx={styles.tableCell}>
                  {detailedCase?.totalEfforts != null ?
                    new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(detailedCase.totalEfforts) : ""}
                </TableCell> */}
                <TableCell sx={styles.tableCell}>
                  {detailedCase?.totalProjects != null ? (detailedCase.totalProjects) : ""}
                </TableCell>
                <TableCell sx={styles.tableCell}>{detailedCase?.totalCosts != null && `${currencySymbol} `}
                  {detailedCase?.totalCosts != null ?
                    new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(detailedCase.totalCosts) : ""}
                </TableCell>
                {/* <TableCell sx={styles.tableCell}>
                  {detailedCase?.totalRnDEfforts != null ?
                    new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(detailedCase.totalRnDEfforts) : ""}
                </TableCell> */}
                <TableCell sx={styles.tableCell}>
                  {detailedCase?.totalRnDCosts != null && `${currencySymbol} `}
                  {detailedCase?.totalRnDCosts != null ?
                    new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(detailedCase.totalRnDCosts) : ""}
                </TableCell>
                <TableCell sx={styles.tableCell}>
                  {detailedCase?.averageRandDPotential != null ?
                    new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(detailedCase.averageRandDPotential) : ""}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
}

export default CaseInfoboxTable;
