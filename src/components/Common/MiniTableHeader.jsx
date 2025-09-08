// import React, { useEffect, useState } from "react";
// import { TableCell, TableHead, TableRow, Checkbox } from "@mui/material";

// const headerCellStyle = {
//   fontSize: "12px",
//   borderRight: "1px solid #ddd",
//   whiteSpace: "nowrap",
//   px: 0.5,
//   py: 1,
//   textAlign: "center",
//   backgroundColor: "#ececec",
//   position: "sticky", // Make the header sticky
//   top: 0, // Position it at the top
//   zIndex: 1, // Ensure the header is above other content
// };

// const headerCheckboxStyle = {
//   color: "#00A398",
//   "&.Mui-checked": { color: "#00A398" },
// };

// const headerRowStyle = {
//   backgroundColor: "rgba(64, 64, 64, 0.1)",
// };

// function MiniTableHeader({ tableData, fetchSortParams }) {
//   const [sortField, setSortField] = useState("")
//   const [sortOrder, setSortOrder] = useState("");

//   useEffect(() =>{
//     fetchSortParams({sortField, sortOrder})
//   }, [sortField, sortOrder])

//   return (
//     <>
//       <TableHead>
//         <TableRow sx={headerRowStyle}>
//           {tableData.columns?.map((column, index) => (
//             <TableCell key={index} sx={index !== 0 ? headerCellStyle : {...headerCellStyle, textAlign: "left", paddingLeft: "1rem",  borderLeft: "1px solid #ddd"}}>
//               {column}
//             </TableCell>
//           ))}
//         </TableRow>
//       </TableHead>
//     </>
//   );
// }

// export default MiniTableHeader;

import React, { useEffect, useState } from "react";
import { TableCell, TableHead, TableRow, IconButton } from "@mui/material";
import StraightIcon from '@mui/icons-material/Straight';

const headerCellStyle = {
  fontSize: "12px",
  borderRight: "1px solid #ddd",
  borderLeft: "1px solid #ddd",
  whiteSpace: "nowrap",
  px: 0.5,
  py: 1,
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

const activeColor = "#404040";
const inactiveColor = "#ccc";

function MiniTableHeader({ page, tableData, fetchSortParams }) {
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
    if (page === "rndhistory") {
      return null;
    }
    let upColor = activeColor;
    let downColor = activeColor;

    // Check if the current column is being sorted
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
          {tableData.columns?.map((column, index) => (
            <TableCell
              key={index}
              sx={index !== 0 ? headerCellStyle : { ...headerCellStyle, textAlign: "left", paddingLeft: "1rem", borderLeft: "1px solid #ddd" }}
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

export default MiniTableHeader;
