import { Box, InputLabel } from "@mui/material";
import React from "react";
import CustomAutocomplete from "../../Common/CustomAutocomplete";

const StateSelect = ({ states, state, setState }) => {
  return (
    <Box>
      <InputLabel sx={{ color: "#404040", fontSize: "14px" }}>State</InputLabel>
      <CustomAutocomplete
        label=""
        placeholder="Select State"
        options={states?.map((state) => state?.name) ?? []}
        value={state}
        onChange={(event, newValue) => {
          setState(newValue ?? "");
        }}
        inputValue={state}
        onInputChange={(event, newInputValue) => {
          setState(newInputValue ?? "");
        }}
      />
    </Box>
  );
};

export default StateSelect;
