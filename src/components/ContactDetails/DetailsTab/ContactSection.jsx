import React from "react";
import EditableInput from "../../Common/EditableInput";
import { Box, Typography } from "@mui/material";

const styles = {
  flexBox: {
    display: "flex",
    flexDirection: "column",
    borderBottom: "1px solid #E4E4E4",
    px: 2,
    pb: 2,
  },
  flexBoxItem: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 2,
    mt: 2,
  },
  textStyle: {
    fontWeight: 600,
    mt: 1,
  },
};

function ContactSection({ data, editMode, handleChange }) {
  return (
    <Box sx={{px:2, pb:1}}>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Box sx={styles.flexBoxItem}>
          <EditableInput
            label="Phone"
            value={data?.phone || ""}
            onChange={(e) => handleChange("phone", e.target.value)}
            disabled={!editMode}
            type="tel"
          />
          <EditableInput
            label="Address Line"
            value={data?.address || ""}
            onChange={(e) => handleChange("address", e.target.value)}
            disabled={!editMode}
          />
          <EditableInput
            label="City"
            value={data?.city || ""}
            onChange={(e) => handleChange("city", e.target.value)}
            disabled={!editMode}
          />
        </Box>
        <Box sx={styles.flexBoxItem}>
          <EditableInput
            label="State"
            value={data?.state || ""}
            onChange={(e) => handleChange("state", e.target.value)}
            disabled={!editMode}
          />
          <EditableInput
            label="Country"
            value={data?.country || ""}
            onChange={(e) => handleChange("country", e.target.value)}
            disabled={!editMode}
          />
          <EditableInput
            label="Zip Code"
            value={data?.zipcode || ""}
            onChange={(e) => handleChange("zipcode", e.target.value)}
            disabled={!editMode}
            type="number"
          />
        </Box>
      </Box>
    </Box>
  );
}

export default ContactSection;
