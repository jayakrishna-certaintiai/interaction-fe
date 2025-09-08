import React from "react";
import { InputLabel, Box, Typography } from "@mui/material";
import CustomAutocomplete from "../../Common/CustomAutocomplete";

const ClientSelect = ({
  clients,
  company,
  setCompany,
  disabled,
  error,
  fontWeight = "600",
  marBot = "5px",
  placeholder = "Select Account",
  purpose
}) => {
  return (
    <Box>
      <InputLabel
        sx={{
          color: "#404040",
          fontSize: "14px",
          fontWeight: fontWeight,
          mb: marBot,
        }}
      >
        Account<span style={{ color: "red" }}>*</span>
      </InputLabel>
      <CustomAutocomplete
        label=""
        placeholder={placeholder}
        options={clients?.map((client) => client?.companyName) ?? []}
        value={company}
        onChange={(event, newValue) => {
          setCompany(newValue ?? "");
        }}
        inputValue={company}
        onInputChange={(event, newInputValue) => {
          setCompany(newInputValue ?? "");
        }}
        disabled={disabled}
      />
      {error && <Typography color="error">{error}</Typography>}
    </Box>
  );
};

export default ClientSelect;
