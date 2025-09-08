import React from "react";
import { InputLabel, Box, Typography, Select, MenuItem, FormControl } from "@mui/material";

const DocumentFormatSelect = ({
    docType,
    selectedDocumentType,
    setSelectedDocumentType,
    disabled,
    error,
    usedfor
}) => {
    // Check if docType is an array; if not, default to an empty array
    const options = Array.isArray(docType) ? docType : [];
    const selectWidth = usedfor === "project" ? "440px" : usedfor === "case" ? "600px" : "450px";
    return (
        <Box sx={{ ml: "-50px", width: "auto" }}> {/* Ensure width of the Box is auto */}
            <InputLabel
                sx={{
                    color: "#404040",
                    fontSize: "14px",
                    fontWeight: 500,
                    mt: "10px",
                }}
            >
                Document Format
            </InputLabel>
            <FormControl fullWidth sx={{ mt: "5px" }}>
                <Select
                    sx={{
                        width: selectWidth,
                        height: "35px",
                        fontSize: "12px",
                        padding: "2px 5px",
                        borderRadius: "20px",
                        mb: 1.5
                    }}
                    value={selectedDocumentType}
                    onChange={(event) => setSelectedDocumentType(event.target.value)}
                    displayEmpty
                    disabled={disabled}
                    inputProps={{
                        "aria-label": "Select Document Type",
                    }}
                >
                    <MenuItem value="" disabled>Select Document Format...</MenuItem>
                    {options.map((option, index) => (
                        <MenuItem key={index} value={option} sx={{ fontSize: "0.9rem", paddingLeft: 2.5, borderTop: "1px solid #E4E4E4" }}>
                            {option}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            {error && <Typography color="error">{error}</Typography>}
        </Box>
    );
};

export default DocumentFormatSelect;
