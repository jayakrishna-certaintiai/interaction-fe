import React from 'react'
import {
  TableRow,
  TableCell,
  TableHead,
} from "@mui/material";

const headerCellStyle = {
  fontSize: "12px",
  borderRight: "1px solid rgba(64, 64, 64, 0.3)",
  whiteSpace: "nowrap",
  px: 0.5,
  py: 0,
  textAlign: "center",
  borderBottom: "1px solid rgba(64, 64, 64, 0.1)",
};

function RnDHistoryTableHead() {
  return (
    <>
      <TableHead>
        <TableRow sx={{ backgroundColor: "rgba(64, 64, 64, 0.2)" }}>
          <TableCell sx={headerCellStyle}>Timestamp</TableCell>
          <TableCell align="left" colSpan={2} sx={headerCellStyle}>
            Non QRE Hours
          </TableCell>
          <TableCell align="left" colSpan={2} sx={headerCellStyle}>
            QRE Hours
          </TableCell>
          <TableCell align="left" sx={headerCellStyle}>
            Source
          </TableCell>
          <TableCell sx={headerCellStyle}></TableCell>
        </TableRow>
        <TableRow sx={{ backgroundColor: "rgba(64, 64, 64, 0.1)" }}>
          <TableCell sx={headerCellStyle}></TableCell>
          <TableCell align="center" sx={headerCellStyle}>
            Adjustment
          </TableCell>
          <TableCell align="center" sx={headerCellStyle}>
            Cumulative
          </TableCell>
          <TableCell align="center" sx={headerCellStyle}>
            Adjustment
          </TableCell>
          <TableCell align="center" sx={headerCellStyle}>
            Cumulative
          </TableCell>
          <TableCell sx={headerCellStyle}></TableCell>
          <TableCell sx={headerCellStyle}></TableCell>
        </TableRow>
      </TableHead>
    </>
  )
}

export default RnDHistoryTableHead