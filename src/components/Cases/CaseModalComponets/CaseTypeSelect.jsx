import React from "react";
import { InputLabel, Box, Typography } from "@mui/material";
import CustomAutocomplete from "../../Common/CustomAutocomplete";

const CaseTypeSelect = ({
    casesTypes,
    setCaseType,
    caseType,
    disabled,
    error,
    fontWeight = "600",
    marBot = "5px",
    placeholder = "Select Case",
}) => {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <InputLabel
                sx={{
                    color: "#404040",
                    fontSize: "18px",
                    fontWeight: fontWeight,
                    mr: '16px', // Adjust margin-right as needed
                }}
            >
                Case Type :
            </InputLabel>
            <CustomAutocomplete
                label=""
                placeholder={placeholder}
                options={casesTypes}
                value={caseType}
                onChange={(event, newValue) => {
                    setCaseType(newValue ?? "");
                }}
                inputValue={caseType}
                onInputChange={(event, newInputValue) => {
                    setCaseType(newInputValue ?? "");
                }}
                disabled={disabled}
            />
            {error && <Typography color="error">{error}</Typography>}
        </Box>

    );
};

export default CaseTypeSelect;
