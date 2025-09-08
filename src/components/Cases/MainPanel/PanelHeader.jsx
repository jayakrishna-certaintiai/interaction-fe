import { Box, Typography, InputBase, InputAdornment } from "@mui/material";
import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import { HiFilter } from "react-icons/hi";
// import CaseChevron from "../MainPanel/CaseChevron";

const styles = {
  searchBox: {
    // mt: 1,
    alignItems: "center",
    display: "flex",
    p: 1,
    //   borderBottom: "1px solid gray",
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
  },
  typography: { fontWeight: 600, fontSize: "10px" },
  spanStyle: { fontWeight: 500 },
};

function PanelHeader({ data, onSearchInput, searchPermission = true }) {
  const handleSearchInputChange = (event) => {
    onSearchInput(event.target.value);
  };

  return (
    <>
      {/* <CaseChevron /> */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-evenly",
        }}
      >
        <Typography sx={styles.typography}>
          Non QRE Hours :{" "}
          <span style={styles.spanStyle}>{data?.timesheetNonRnDHours}</span>
        </Typography>
        <Typography sx={styles.typography}>
          QRE Hours :{" "}
          <span style={styles.spanStyle}>{data?.timesheetRnDHours}</span>
        </Typography>
        <Typography sx={styles.typography}>
          Uncertain Hours :{" "}
          <span style={{ ...styles.spanStyle, color: "#FD5707" }}>
            {data?.timesheetUncertainHours}
          </span>
        </Typography>
        <Typography sx={styles.typography}>
          Reconciled Hours :{" "}
          <span style={{ ...styles.spanStyle, color: "#00A398" }}>
            {data?.timesheetReconciledHours}
          </span>
        </Typography>
        {searchPermission && (
          <Box sx={styles.searchBox}>
            <InputBase
              type="text"
              placeholder="Search..."
              // value={searchInput}
              onChange={handleSearchInputChange}
              startAdornment={
                <InputAdornment position="start">
                  <SearchIcon sx={styles.searchIcon} />
                </InputAdornment>
              }
              sx={styles.inputBase}
            />
            <HiFilter style={styles.filterIcon} />
          </Box>
        )}
      </Box>
    </>
  );
}

export default PanelHeader;
