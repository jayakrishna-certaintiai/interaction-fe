import React from "react";
import MainPanelHeader from "../Common/MainPanelHeader";
import { Box, Button, InputAdornment, InputBase } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { HiFilter } from "react-icons/hi";
import SearchIcon from "@mui/icons-material/Search";
import { GoDownload } from "react-icons/go";

// const arr = ["System Activity", "Interactions", "Tasks"];
const arr = [{ name: "Interactions", isAuth: true }];

const styleConstants = {
  pinStyle: {
    borderRadius: "50%",
    border: "1px solid #00A398",
    padding: "5px",
    fontSize: "28px",
    color: "#00A398",
  },
  inputStyle: {
    borderRadius: "20px",
    width: "50%",
    height: "40px",
    border: "1px solid #9F9F9F",
    mr: 2,
  },
  searchIconStyle: {
    color: "#9F9F9F",
    ml: "3px",
    mr: "-3px",
    width: "20px",
    height: "20px",
  },
  filterDownloadStyle: {
    color: "white",
    borderRadius: "50%",
    backgroundColor: "#00A398",
    fontSize: "28px",
    padding: "5px",
    marginRight: "16px",
    cursor: "pointer",
  },
  titleStyle: {
    display: "flex",
    alignItems: "center",
    fontSize: "25px",
    color: "#404040",
    ml: 2,
    fontWeight: 600,
    mt: 1,
    cursor: "pointer",
  },
  subTitleStyle: {
    fontSize: "13px",
    color: "#9F9F9F",
    ml: 2,
  },
  newCompanyButtonStyle: {
    textTransform: "capitalize",
    borderRadius: "20px",
    backgroundColor: "#00A398",
    mr: 2,
    "&:hover": {
      backgroundColor: "#00A398",
    },
    height: "40px",
    width: "200px",
  },
  iconStyle: { fontSize: "17px", marginRight: "3px" },
};

function ActivityTableIntro({ onSelectedTab, tab, onSearch }) {
  const handleSelectedTab = (tab) => {
    onSelectedTab(tab);
  };

  const handleSearchInputChange = (event) => {
    onSearch(event.target.value);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <MainPanelHeader
          arr={arr}
          first={arr[0]?.name}
          onSelectedChange={handleSelectedTab}
          page={"activity"}
        />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <Button variant="contained" sx={styleConstants.newCompanyButtonStyle}>
            {<AddIcon style={styleConstants.iconStyle} />} New{" "}
            {tab === "System Activity" ? "Activity" : tab}
          </Button>
          <InputBase
            type="text"
            placeholder="Search..."
            onChange={handleSearchInputChange}
            startAdornment={
              <InputAdornment position="start">
                <SearchIcon sx={styleConstants.searchIconStyle} />
              </InputAdornment>
            }
            sx={styleConstants.inputStyle}
          />
          {/* <HiFilter
            style={{
              ...styleConstants.filterDownloadStyle,
              marginRight: "16px",
            }}
          /> */}
          {/* <GoDownload style={styleConstants.filterDownloadStyle} /> */}
        </Box>
      </Box>
    </>
  );
}

export default ActivityTableIntro;
