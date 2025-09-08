import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, InputLabel, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { formattedDateOnly } from "../../../utils/helper/FormatDatetime";
import EditableInput from "../../Common/EditableInput";
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
    mt: 2,
    mb: 4
  },
  textStyle: {
    fontWeight: 600,
    mt: 1,
    display: "flex",
    alignItems: "center",
    mb: 1
  },
  expandMoreIcon: {
    borderRadius: "50%",
    fontSize: "15px",
    backgroundColor: "#404040",
    color: "white",
    mr: 1,
    transition: "transform 0.3s ease",
  },
  inputBase: {
    borderRadius: "20px",
    height: "32px",
    border: "1px solid #E4E4E4",
    width: "200px",
    paddingLeft: "9px",
    display: "flex",
    justifyContent: "start",
    alignItems: "center",
    fontSize: "1rem",
    color: "#00A398",
  },
  label: {
    color: "#404040",
    fontSize: "14px",
  },
};

function ProjectTimeline({ data, editMode, editedValues, handleEditChange }) {
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
        Timelines
      </Typography>
      {visibility && (
        <>
          <Box sx={styles.flexBoxItem}>
            <div>
              <InputLabel sx={styles.label}>Survey - Response Date</InputLabel>
              <span style={styles.inputBase}>
                {formattedDateOnly(editedValues.surveyResponseDate)}
              </span>
            </div>
            {/* <NonEditableInput
              label="Survey - Response Date"
              value={formattedDateOnly(data?.surveyResponseDate)}
              disabled={!editMode}
            /> */}
            <NonEditableInput
              label="Survey - Sent Date"
              value={formattedDateOnly(data?.surveySentDate)}
              disabled={!editMode}
            />
            {/* <EditableInput
              label="Survey - Sent Date"
              value={editedValues.surveySentDate}
              onChange={(e) =>
                handleEditChange("surveySentDate", e.target.value)
              }
              disabled={!editMode}
              type="date"
            /> */}
            <EditableInput
              label="Survey - Reminder Sent Date"
              value={editedValues.reminderSentDate}
              onChange={(e) =>
                handleEditChange("reminderSentDate", e.target.value)
              }
              disabled={!editMode}
              type="date"
            />
            <EditableInput
              label="Survey - Response Date"
              value={editedValues.surveyResponseDate}
              onChange={(e) =>
                handleEditChange("surveyResponseDate", e.target.value)
              }
              disabled={!editMode}
              type="date"
            />
          </Box>
        </>
      )}
    </Box>
  );
}

export default ProjectTimeline;
