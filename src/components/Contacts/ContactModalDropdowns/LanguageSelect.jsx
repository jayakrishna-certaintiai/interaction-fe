import { Box, InputLabel } from "@mui/material";
import React from "react";
import CustomAutocomplete from "../../Common/CustomAutocomplete";

const LanguageSelect = ({ lang, language, setLanguage }) => {
  return (
    <Box>
      <InputLabel sx={{ color: "#404040", fontSize: "14px", fontWeight: 400 }}>
        Language
      </InputLabel>
      <CustomAutocomplete
        label=""
        placeholder="Select Language"
        options={lang?.map((lan) => lan) ?? []}
        value={language}
        onChange={(event, newValue) => {
          setLanguage(newValue ?? "");
        }}
        inputValue={language}
        onInputChange={(event, newInputValue) => {
            setLanguage(newInputValue ?? "");
        }}
      />
      
    </Box>
  );
};

export default LanguageSelect;
