import React from "react";
import {
  // Button,
  InputBase,
  InputLabel,
  Box,
} from "@mui/material";
import FormatDatetime from "../../utils/helper/FormatDatetime";

const styles = {
  flexBox: {
    display: "flex",
    flexDirection: "column",
  },
  flexBoxItem: {
    display: "flex",
    justifyContent: "space-between",
    mt: 1,
    gap: 2,
    px: 1,
  },
  label: {
    color: "#404040",
    fontSize: "14px",
  },
  inputBase: {
    borderRadius: "20px",
    height: "40px",
    // border: "1px solid #E4E4E4",
    // pl: 1,
    mb: 0.5,
  },
};

function Salary({ data, modifiedBy }) {
  return (
    <Box sx={{ px: 1, borderTop: "1px solid #E4E4E4" }}>
      {/* <UpdationDetails
        modifiedBy={modifiedBy}
        isAuth={useHasAccessToFeature("F037", "P000000001")}
      /> */}
      <Box sx={styles.flexBox}>
        <Box sx={styles.flexBoxItem}>
          <Box>
            <InputLabel sx={styles.label}>Annual Salary</InputLabel>
            <InputBase
              name="firstName"
              type="text"
              sx={styles.inputBase}
              value={`${Number(data?.annualRate)?.toLocaleString()} $` || ""}
              disabled
            />
          </Box>
          <Box>
            <InputLabel sx={styles.label}>Hourly Rate</InputLabel>
            <InputBase
              sx={styles.inputBase}
              name="lastName"
              type="text"
              value={
                data?.HourlyRate ? `${parseFloat(data?.HourlyRate)?.toFixed(2).toLocaleString('en-US')} $` : ""
              }
              disabled
            />
          </Box>
          <Box>
            <InputLabel sx={styles.label}>Effective Date</InputLabel>
            <InputBase
              type="email"
              sx={styles.inputBase}
              name="email"
              value={FormatDatetime(data?.startDate) || ""}
              disabled
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Salary;
