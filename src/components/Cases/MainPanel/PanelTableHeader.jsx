import React from "react";
import { TableCell, TableHead, TableRow } from "@mui/material";

const headerCellStyle = {
  fontSize: "12px",
  // fontWeight: 600,
  borderRight: "1px solid #ddd",
  borderLeft: "1px solid #ddd",
  whiteSpace: "nowrap",
  px: 0.5,
  py: 0.25,
  textAlign: "center",
  backgroundColor: "#ececec",
};

const headerRowStyle = {
  backgroundColor: "rgba(64, 64, 64, 0.1)",
};

function PanelTableHeader({ tableData, page }) {
  return (
    <>
      <TableHead>
        <TableRow sx={headerRowStyle}>
          {tableData.columns.map((column, index) => (
            <TableCell
              key={index}
              sx={{
                ...headerCellStyle,
                textAlign: index === 0 ? "left" : "center",
              }}
            >
              {column}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    </>
  );
}

export default PanelTableHeader;
