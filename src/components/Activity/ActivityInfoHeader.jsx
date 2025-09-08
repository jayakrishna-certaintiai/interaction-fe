import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Box, Typography } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import React from "react";
import { GoDownload } from "react-icons/go";

const styles = {
  flexBox: {
    display: "flex",
    justifyContent: "space-between",
  },
  paddingLeftBox: {
    p: 1,
  },
  companyTypography: {
    display: "flex",
    alignItems: "center",
    fontSize: "13px",
  },
  appleSpan: {
    fontSize: "13px",
    color: "#00A398",
  },
  appleIncTypography: {
    display: "flex",
    alignItems: "center",
    fontSize: "25px",
    fontWeight: 600,
  },
  lanIcon: {
    borderRadius: "50%",
    border: "1px solid black",
    padding: "5px",
    fontSize: "30px",
    cursor: "pointer",
    ml: 2,
    "&:hover": {
      color: "#FD5707",
      border: "1px solid #FD5707",
    },
  },
  buttonGroup: {
    display: "flex",
    alignItems: "center",
    mt: -3,
    p: 1,
  },
  buttonStyle: {
    textTransform: "capitalize",
    borderRadius: "20px",
    backgroundColor: "#00A398",
    mr: 2,
    "&:hover": {
      backgroundColor: "#00A398",
    },
  },
  goDownloadIcon: {
    color: "white",
    borderRadius: "50%",
    backgroundColor: "#00A398",
    fontSize: "33px",
    padding: "5px",
    marginRight: "16px",
  },
};

function ActivityInfoHeader({ head }) {
  return (
    <>
      <Box sx={styles.flexBox}>
        <Box sx={styles.paddingLeftBox}>
          <Typography sx={styles.companyTypography}>
            Activity <ChevronRightIcon sx={{ fontSize: "17px" }} />
            <span style={styles.appleSpan}>{head}</span>
          </Typography>
          <Typography sx={styles.appleIncTypography}>{head}</Typography>
        </Box>
        <Box sx={styles.buttonGroup}>
          {/* <GoDownload style={styles.goDownloadIcon} /> */}
        </Box>
      </Box>
    </>
  );
}

export default ActivityInfoHeader;
