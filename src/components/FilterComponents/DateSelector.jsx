import React from "react";
import { Box, InputBase, InputLabel } from "@mui/material";

const styles = {
  inputBase: {
    borderRadius: "20px",
    height: "32px",
    border: "1px solid #c4c4c4",
    pl: 1,
    mb: 0.5,
    width: "240px",
  },
  label: {
    fontWeight: 500,
    color: "#404040",
    fontSize: "13px",
    mb: "3px",
  },
  boxStyle: { display: "flex", flexDirection: "column" },
};

function DateSelector({ name, value, onChange, label }) {
  return (
    <Box sx={styles.boxStyle}>
      <InputLabel sx={styles.label}>{label}</InputLabel>
      <InputBase
        sx={styles.inputBase}
        name={name}
        type="date"
        value={value}
        onChange={onChange}
      />
    </Box>
  );
}

export default DateSelector;
