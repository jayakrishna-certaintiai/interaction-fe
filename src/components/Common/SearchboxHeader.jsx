import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SearchIcon from "@mui/icons-material/Search";
import { Box, InputAdornment, InputBase, Typography } from "@mui/material";
import React, { useState } from "react";
import { GiPin } from "react-icons/gi";
import { HiFilter } from "react-icons/hi";
import FilterPanel from "./FilterPanel";
import TableHeaderDropdown from "./TableHeaderDropdown";

function SearchboxHeader({
  type,
  onSearch,
  data,
  latestUpdateTime,
  items,
  page,
  onApplyFilters,
  searchPermission = true,
  onSelectedItem,
  onPinClicked,
  isPinnedState,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedItem, setSelectedItem] = useState(type);
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);

  const styles = {
    headerBox: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      // mb: 1,
      p: 1,
    },
    titleTypography: {
      display: "flex",
      alignItems: "center",
      fontSize: "13px",
      fontWeight: 600,
      cursor: "pointer",
    },
    subtitleTypography: {
      color: "#9F9F9F",
      fontSize: "10px",
    },
    pinIcon: {
      borderRadius: "50%",
      border: "1px solid #00A398",
      padding: "5px",
      fontSize: "28px",
      color: isPinnedState ? "white" : "#00A398",
      backgroundColor: isPinnedState ? "#00A398" : "transparent",
      transform: isPinnedState ? "rotate(-45deg)" : "none",
      transition: "transform 0.5s, color 0.5s, background-color 0.5s",
      cursor: "pointer",
      marginLeft: "8px",
    },
    arrowIcon: {
      borderRadius: "50%",
      border: "1px solid #00A398",
      padding: "2px",
      fontSize: "30px",
      backgroundColor: "#00A398",
      color: "white",
      ml: 1,
    },
    searchBox: {
      // mt: 1,
      alignItems: "center",
      display: "flex",
      p: 1,
      borderBottom: "1px solid gray",
    },
    inputBase: {
      borderRadius: "20px",
      width: "80%",
      height: "35px",
      border: "1px solid #9F9F9F",
      mr: 2,
    },
    searchIcon: {
      color: "#9F9F9F",
      ml: "3px",
      mr: "-3px",
      width: "20px",
      height: "20px",
    },
    filterIcon: {
      color: "white",
      borderRadius: "50%",
      backgroundColor: "#00A398",
      fontSize: "35px",
      padding: "5px",
      marginRight: "16px",
      cursor: "pointer",
    },
    keyDownIcon: {
      fontSize: "17px",
      ml: 0.2,
      mr: 1,
    },
  };

  const handleFilterClick = () => {
    setFilterPanelOpen(!filterPanelOpen);
  };

  const handleFilterClose = () => {
    setFilterPanelOpen(false);
  };

  const handleSearchInputChange = (event) => {
    onSearch(event.target.value);
  };

  const handleMenuItemClick = (selectedItem) => {
    setSelectedItem(selectedItem);
    handleClose();
    onSelectedItem(selectedItem);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handlePinClick = () => {
    if (onPinClicked) {
      onPinClicked(type);
    }
  };

  return (
    <>
      <Box sx={styles.headerBox}>
        <Box sx={{ flexDirection: "column" }}>
          <Typography sx={styles.titleTypography} onClick={handleClick}>
            {selectedItem}
            <KeyboardArrowDownIcon sx={styles.keyDownIcon} />
          </Typography>
          <TableHeaderDropdown
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorEl={anchorEl}
            items={items}
            handleMenuItemClick={handleMenuItemClick}
          />
          <Typography sx={styles.subtitleTypography}>
            {data?.length} items &bull; Updated {latestUpdateTime}
          </Typography>
        </Box>
        <Box>
          {/* <GiPin style={styles.pinIcon} onClick={handlePinClick} />
          <KeyboardArrowDownIcon sx={styles.arrowIcon} /> */}
        </Box>
      </Box>
      {searchPermission && (
        <Box sx={styles.searchBox}>
          <InputBase
            type="text"
            placeholder="Search..."
            onChange={handleSearchInputChange}
            startAdornment={
              <InputAdornment position="start">
                <SearchIcon sx={styles.searchIcon} />
              </InputAdornment>
            }
            sx={styles.inputBase}
          />
          {/* <HiFilter style={styles.filterIcon} onClick={handleFilterClick} /> */}
          {/* {filterPanelOpen && (
            <FilterPanel
              handleClose={handleFilterClose}
              open={filterPanelOpen}
              page={page}
              // documentClientData={documentClientData}
              // documentType={documentType}
              onApplyFilters={onApplyFilters}
            />
          )} */}
        </Box>
      )}
    </>
  );
}

export default SearchboxHeader;
