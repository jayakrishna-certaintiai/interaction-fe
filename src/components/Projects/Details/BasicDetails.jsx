import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import NonEditableInput from "../../Common/NonEditableInput";

const styles = {
  flexBox: {
    display: "flex",
    flexDirection: "column",
    borderBottom: "1px solid #E4E4E4",
    px: 2,
  },
  flexBoxItem: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 2,
    mt: 0.5,
  },
  textStyle: {
    fontWeight: 600,
    mt: 1,
    mb: 1,
    cursor: "pointer",
  },
  expandMoreIcon: {
    borderRadius: "50%",
    fontSize: "15px",
    backgroundColor: "#404040",
    color: "white",
    mr: 1,
    transition: "transform 0.3s ease",
  },
  label: {
    color: "#404040",
    fontSize: "14px",
  },
};

function BasicDetails({ data }) {
  const [visibility, setVisibility] = useState(false);

  const toggleVisibility = () => {
    setVisibility((prevVisibility) => !prevVisibility);
  };

  return (
    <Box sx={styles.flexBox}>
      <Typography sx={styles.textStyle} onClick={toggleVisibility}>
        <ExpandMoreIcon
          sx={{
            ...styles.expandMoreIcon,
            transform: visibility ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
        Details
      </Typography>
      {visibility && (
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Box sx={styles.flexBoxItem}>
            <NonEditableInput label="Project ID" value={data.projectCode} disabled />
            <NonEditableInput label="Project Name" value={data.projectName} disabled />
            <NonEditableInput label="Account" value={data.companyName} disabled />
          </Box>
          <Box sx={styles.flexBoxItem}>
            <NonEditableInput label="Fiscal Year" value={data.fiscalYear} disabled />
            <NonEditableInput label="Survey Status" value={data.surveyStatus} disabled />
            <NonEditableInput
              label="Project Identifier"
              value={data.projectIdentifier}
              disabled
            />
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default BasicDetails;