import { Box, Typography } from "@mui/material";
import React from "react";
import { DateRange } from "react-date-range";

const styles = {
  container: {
    position: "absolute",
    top: "59%",
    left: "60%",
    transform: "translate(-50%, -50%)",
    width: 380,
    bgcolor: "#fff",
    border: "none",
    boxShadow: "0px 3px 25px #00000080",
    borderRadius: "5px",
    px: "20px",
    py: "5px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    zIndex: 100,
  },
  labelContainer: {
    display: "flex",
    justifyContent: "space-around",
    mb: -1,
  },
  label: {
    fontSize: "13px",
    fontWeight: "600",
    textTransform: "capitalize",
  },
};

function DateRangeFilter({ onChange }) {
  const handleSelect = (ranges) => {
    const startDate = ranges.selection.startDate;
    const endDate = ranges.selection.endDate;
    onChange(startDate, endDate);
  };

  return (
    <Box sx={styles.container}>
      <Box sx={styles.labelContainer}>
        <Typography sx={styles.label}>From:</Typography>
        <Typography sx={styles.label}>To:</Typography>
      </Box>
      <DateRange
        ranges={[
          {
            startDate: new Date(),
            endDate: new Date(),
            key: "selection",
          },
        ]}
        onChange={handleSelect}
        maxDate={new Date(new Date().getFullYear(), 11, 31)}
      />
    </Box>
  );
}

export default DateRangeFilter;
