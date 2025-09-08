import { Box, InputLabel } from "@mui/material";
import React from "react";
import CustomAutocomplete from "../../Common/CustomAutocomplete";

const TitleSelect = ({ titles, title, setTitle }) => {
  return (
    <Box>
      <InputLabel sx={{ color: "#404040", fontSize: "14px", fontWeight: 400 }}>
        Title
      </InputLabel>
      <CustomAutocomplete
        label=""
        placeholder="Select Title"
        options={titles?.map((title) => title) ?? []}
        value={title}
        onChange={(event, newValue) => {
          setTitle(newValue ?? "");
        }}
        inputValue={title}
        onInputChange={(event, newInputValue) => {
            setTitle(newInputValue ?? "");
        }}
      />
    </Box>
  );
};

export default TitleSelect;
