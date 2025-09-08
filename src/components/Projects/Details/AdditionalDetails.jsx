import React, { useState } from "react";
import { Box, TextField, Typography, InputLabel } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const styles = {
  flexBox: {
    display: "flex",
    flexDirection: "column",
    borderBottom: "1px solid #E4E4E4",
    px: 2,
  },
  textStyle: {
    fontWeight: 600,
    mt: 1,
    mb: 1,
    cursor: "pointer",
  },
  inputStyle: {
    mb: 2,
    "& .MuiInputBase-root": {
      borderRadius: "20px",
    },
  },
  label: {
    mb: 1,
    color: "#404040",
    fontSize: "14px",
  },
  expandMoreIcon: {
    borderRadius: "50%",
    fontSize: "15px",
    backgroundColor: "#404040",
    color: "white",
    mr: 1,
    transition: "transform 0.3s ease",
  },
};

function AdditionalDetails({ data, editMode, editedValues, handleEditChange }) {
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
        Additional Details
      </Typography>

      {visibility && (
        <>
          <InputLabel sx={styles.label}>Data Gathering</InputLabel>
          <TextField
            multiline
            rows={1}
            variant="outlined"
            sx={styles.inputStyle}
            value={editedValues.s_data_gathering}
            onChange={(e) =>
              handleEditChange("s_data_gathering", e.target.value)
            }
            disabled={!editMode}
          />
          <InputLabel sx={styles.label}>Pending Data</InputLabel>
          <TextField
            multiline
            rows={1}
            variant="outlined"
            sx={styles.inputStyle}
            value={editedValues.s_pending_data}
            onChange={(e) =>
              handleEditChange("s_pending_data", e.target.value)
            }
            disabled={!editMode}
          />
          <InputLabel sx={styles.label}>Notes</InputLabel>
          <TextField
            multiline
            rows={1}
            variant="outlined"
            sx={styles.inputStyle}
            value={editedValues.notes}
            onChange={(e) =>
              handleEditChange("notes", e.target.value)
            }
            disabled={!editMode}
          />
          <InputLabel sx={styles.label}>Description</InputLabel>
          <TextField
            multiline
            rows={1}
            variant="outlined"
            sx={styles.inputStyle}
            value={editedValues.description}
            onChange={(e) => handleEditChange("description", e.target.value)}
            disabled={!editMode}
          />
        </>
      )}
    </Box>
  );
}

export default AdditionalDetails;
