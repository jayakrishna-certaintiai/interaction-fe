import React, { useState } from "react";
import { Select, MenuItem, Box, Typography } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

const styles = {
  paginationContainer: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 1,
    marginTop: "-20px",
  },
  itemsPerPageContainer: {
    fontSize: "13px",
    marginRight: "-12px",
  },
  itemsPerPageSelect: {
    border: "none",
    borderRadius: "20px",
    width: "200px",
    height: "25px",
    fontSize: "13px",
    padding: "0 15px",
    marginRight: "19px",
  },
  pageNavigationContainer: {
    display: "flex",
    alignItems: "center",
    fontSize: "13px",
  },
  chevronIcon: {
    borderRadius: "50%",
    backgroundColor: "#404040",
    // backgroundColor:"#00A398", //green
    color: "white",
    marginLeft: 1,
    marginRight: 1,
    cursor: "pointer",
    height: "20px",
    width: "20px"
  },
  currentPageBox: {
    padding: 0.2,
    border: "1px solid #E4E4E4",
    borderRadius: "20px",
    width: "40px",
    textAlign: "center",
    fontSize: "13px",
    marginRight: 1,
    height: "23px",
  },
};

function CustomPagination({
  currentPage,
  totalPages,
  changePage,
  changeItemsPerPage,
  minRows,
}) {
  const [items, setItems] = useState(minRows || 20);

  const itemsOnPage = [minRows || 20, 30, 50, 100];

  const handlePrevClick = () => {
    if (currentPage > 1) changePage(currentPage - 1);
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) changePage(currentPage + 1);
  };

  const handleItemsChange = (e) => {
    const newItemsPerPage = Number(e.target.value);
    setItems(newItemsPerPage);
    changeItemsPerPage(newItemsPerPage);
  };

  return (
    <Box sx={styles.paginationContainer}>
      <Box>
        {/* <span style={styles.itemsPerPageContainer}>Showing: </span> */}
        <Select
          value={items}
          onChange={handleItemsChange}
          sx={styles.itemsPerPageSelect}
        >
          {itemsOnPage.map((option, index) => (
            <MenuItem value={option} key={index}>
              {option} <span style={styles.itemsPerPageContainer}> Records per page</span>
            </MenuItem>
          ))}
        </Select>
        {/* <span style={styles.itemsPerPageContainer}>Items per page</span> */}
      </Box>
      <Box sx={styles.pageNavigationContainer}>
        {/* <span>Page:</span> */}
        <ChevronLeftIcon sx={styles.chevronIcon} onClick={handlePrevClick} />
        <Typography sx={styles.currentPageBox}>{currentPage}</Typography>
        <span>of {totalPages}</span>
        <ChevronRightIcon sx={styles.chevronIcon} onClick={handleNextClick} />
      </Box>
    </Box>
  );
}

export default CustomPagination;
