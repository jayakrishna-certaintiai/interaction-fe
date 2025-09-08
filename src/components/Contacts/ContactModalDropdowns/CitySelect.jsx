import { Box, InputLabel } from "@mui/material";
import React from "react";
import CustomAutocomplete from "../../Common/CustomAutocomplete";

const CitySelect = ({ cities, city, setCity }) => {
  return (
    <Box>
      <InputLabel sx={{ color: "#404040", fontSize: "14px" }}>City</InputLabel>
      <CustomAutocomplete
        label=""
        placeholder="Select City"
        options={cities?.map((city) => city) ?? []}
        value={city}
        onChange={(event, newValue) => {
          setCity(newValue ?? "");
        }}
        inputValue={city}
        onInputChange={(event, newInputValue) => {
          setCity(newInputValue ?? "");
        }}
      />
    </Box>
  );
};

export default CitySelect;
