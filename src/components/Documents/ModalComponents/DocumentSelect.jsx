import React from "react";
import { InputLabel, Box, Typography } from "@mui/material";
import CustomAutocomplete from "../../Common/CustomAutocomplete";

const DocumentTypeSelect = ({ docType, doc, setDoc, disabled, error }) => {
  // Check if docType is an array; if not, default to an empty array
  const options = Array.isArray(docType) ? docType : [];

  return (
    <Box>
      <InputLabel
        sx={{
          color: "#404040",
          fontSize: "14px",
          fontWeight: 600,
          mb: "5px",
        }}
      >
        Document Type
      </InputLabel>
      <CustomAutocomplete
        label=""
        placeholder="Select Document Type"
        options={options?.map((doc) => doc) ?? []}
        value={doc}
        onChange={(event, newValue) => {
          setDoc(newValue ?? "");
        }}
        inputValue={doc}
        onInputChange={(event, newInputValue) => {
          setDoc(newInputValue ?? "");
        }}
        disabled={disabled}
      />
      {error && <Typography color="error">{error}</Typography>}
    </Box>
  );
};

export default DocumentTypeSelect;
