import React from "react";
import { TableCell, TableHead, TableRow } from "@mui/material";

const headerCellStyle = {
  fontSize: "12px",
  borderRight: "1px solid #ddd",
  whiteSpace: "nowrap",
  px: 0.5,
  py: 1,
  textAlign: "center",
  backgroundColor: "#ececec",
  position: "sticky", 
  top: 0, 
  zIndex: 1,
  width: "auto", // Allow flexible column widths
};



const headerRowStyle = {
  backgroundColor: "rgba(64, 64, 64, 0.1)",
};

function MiniTableHeader2({ tableData }) {
  
  return (
    <>
      <TableHead>
        <TableRow sx={headerRowStyle}>
          {tableData.columns?.map((column, index) => (
            <TableCell key={index} sx={index !== 0 ? headerCellStyle : {...headerCellStyle, textAlign: "center", paddingLeft: "1rem",  borderLeft: "1px solid #ddd"}}>
              {column}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    </>
  );
}

export default MiniTableHeader2;