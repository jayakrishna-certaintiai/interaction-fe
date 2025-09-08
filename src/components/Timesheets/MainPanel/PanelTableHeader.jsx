import React, { useEffect, useState } from "react";
import { TableCell, TableHead, TableRow, IconButton } from "@mui/material";
import StraightIcon from '@mui/icons-material/Straight';


const headerCellStyle = {
  fontSize: "12px",
  borderRight: "1px solid #ddd",
  borderLeft: "1px solid #ddd",
  whiteSpace: "nowrap",
  px: 1,
  py: 0.5,
  textAlign: "center",
  backgroundColor: "#ececec",
  position: "sticky",
  top: 0,
  zIndex: 1,
  cursor: "pointer",
};

const headerRowStyle = {
  backgroundColor: "rgba(64, 64, 64, 0.1)",
};

// Define colors
const activeColor = "#404040"; 
const inactiveColor = "#ccc"; 

function PanelTableHeader({ tableData, fetchSortParams }) {
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  useEffect(() => {
    fetchSortParams({ sortField, sortOrder });
  }, [sortField, sortOrder]);

  const handleColumnClick = (column) => {
    if (sortField === column) {
      if (sortOrder === "asc") {
        setSortOrder("dsc");
      } else if (sortOrder === "dsc") {
        setSortOrder("");
        setSortField("");
      } else {
        setSortOrder("asc");
      }
    } else {
      setSortField(column);
      setSortOrder("asc");
    }
  };

  const renderSortIcons = (column) => {
    let upColor = activeColor;
    let downColor = activeColor;

    if (sortField === column) {
      if (sortOrder === "asc") {
        downColor = "#FD5707";
        upColor = inactiveColor;
      } else if (sortOrder === "dsc") {
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
            transform: "rotate(180deg)",
          }}
        />
      </>
    );
  };

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
                paddingLeft: index === 0 ? "1rem" : undefined,
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
    </>
  );
}

export default PanelTableHeader;
