import React from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const styles = {
  label: {
    fontWeight: 500,
    color: "#404040",
    fontSize: "13px",
  },
  formControl: {
    my: 1,
    minWidth: 120,
    borderRadius: "20px",
  },
  select: {
    borderRadius: "20px",
    height: "30px",
    width: "240px",
    // marginLeft: "7px",
  },
};

const MonthSelector = ({ month, handleMonthChange }) => (
  <>
    <InputLabel sx={{ ...styles.label}}>Month</InputLabel>
    <FormControl variant="outlined" sx={styles.formControl}>
      <Select
        id="accYear-select-outlined"
        value={month}
        onChange={handleMonthChange}
        displayEmpty
        renderValue={
            month !== undefined
            ? undefined
            : () => (
                <span style={{ color: "#9F9F9F", fontSize: "13px" }}>
                  Select Month
                </span>
              )
        }
        sx={styles.select}
      >
        <MenuItem value={"2022"}>Oct 2023</MenuItem>
        <MenuItem value={"2022"}>Nov 2023</MenuItem>
        <MenuItem value={"2022"}>Dec 2023</MenuItem>
      </Select>
    </FormControl>
  </>
);

export default MonthSelector;
