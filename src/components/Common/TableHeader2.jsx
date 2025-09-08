import React, { useState, useEffect, useContext } from "react";
import { TableCell, TableHead, TableRow, IconButton } from "@mui/material";
import StraightIcon from '@mui/icons-material/Straight'; // Same as TableHeader
import { DocumentContext } from "../../context/DocumentContext";

// Reuse the styles from your previous TableHeader
const headerCellStyle = {
  fontSize: "13px",
  borderLeft: "1px solid #ddd",
  whiteSpace: "nowrap",
  py: 1,
  textAlign: "center",
  position: "sticky",
  top: 0,
  zIndex: 1,
  backgroundColor: "#ececec",
  cursor: "pointer",
};

const headerRowStyle = {
  backgroundColor: "rgba(64, 64, 64, 0.1)",
  position: "sticky",
  top: 0,
  zIndex: 1,
};

// Define colors
const activeColor = "#404040"; // Darker color for active arrow
const inactiveColor = "#ccc"; // Lighter color for inactive arrow

function TableHeader2({ tableData, page }) {
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const { getDocumentsSortParams } = useContext(DocumentContext);

  useEffect(() => {
    if (page === "document") {
      getDocumentsSortParams({ sortField, sortOrder });
    }
  }, [sortField, sortOrder, page]);

  const handleColumnClick = (column) => {
    if (sortField === column) {
      if (sortOrder === "asc") {
        setSortOrder("dsc");
      } else if (sortOrder === "dsc") {
        setSortOrder(null);
        setSortField(null); // Reset sorting when clicking again on descending
      } else {
        setSortOrder("asc");
      }
    } else {
      setSortField(column);
      setSortOrder("asc");
    }
  };


  const renderSortIcons = (column) => {
    let upColor = activeColor;  // Default to active color initially
    let downColor = activeColor;  // Default to active color initially
  
    // Check if the current column is being sorted
    if (sortField === column) {
      if (sortOrder === "asc") {
        // Ascending sort: highlight upward arrow with #00A398, set downward arrow to inactive
        downColor = "#FD5707";
        upColor = inactiveColor;
      } else if (sortOrder === "dsc") {
        // Descending sort: highlight downward arrow with #00A398, set upward arrow to inactive
        upColor = "#FD5707";
        downColor = inactiveColor;
      }
    }
  
    return (
      <>
        <StraightIcon
          fontSize="small"
          style={{ color: upColor, opacity: 0.6, marginRight: -5, fontSize: "17px" }}
        />
        <StraightIcon
          fontSize="small"
          style={{
            color: downColor,
            opacity: 0.6,
            marginLeft: -5,
            fontSize: "17px",
            transform: "rotate(180deg)", // Rotates the icon by 180 degrees
          }}
        />
      </>
    );
  };

  return (
    <TableHead>
      <TableRow sx={headerRowStyle}>
        {tableData.columns.map((column, index) => (
          <TableCell
            key={index}
            sx={{
              ...headerCellStyle,
              textAlign: index === 0 ? "left" : "center",
            }}
            onClick={() => handleColumnClick(column)}
          >
            {column}
            <IconButton size="small">
              {renderSortIcons(column)}
            </IconButton>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default TableHeader2;
