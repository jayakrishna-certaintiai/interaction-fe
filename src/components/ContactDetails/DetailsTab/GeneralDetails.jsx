import React from "react";
import EditableInput from "../../Common/EditableInput";
import { Box, Typography } from "@mui/material";
import { titles } from "../../../constants/Titles";

const styles = {
  flexBox: {
    display: "flex",
    flexDirection: "column",
    borderBottom: "1px solid #E4E4E4",
    px: 2,
    pb: 2,
    height: 40
  },
  flexBoxItem: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 2,
    mt: 2,
    height: 80
  },
  inputField: {
    width: "220px",
  },
  textStyle: {
    fontWeight: 600,
    mt: 1,
    height: 40
  },
};

const lang = ["English"];

function GeneralDetails({ data, editMode, handleChange, errors }) {
  return (
    <Box sx={{ px: 4, pb: 1, height: "100%" }}>
      <Typography sx={styles.textStyle}>General</Typography>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Box sx={styles.flexBoxItem}>
          <EditableInput
            label="Employee Name"
            value={data?.firstName || ""}
            onChange={(e) => handleChange("firstName", e.target.value)}
            disabled={!editMode}
            errors={errors?.firstName}
            required={true}
            sx={{ width: "120%" }}
          />
          {/* <EditableInput
            label="Last Name"
            value={data?.lastName || ""}
            onChange={(e) => handleChange("lastName", e.target.value)}
            disabled={!editMode}
            errors={errors?.lastName}
            required={true}
          /> */}
          <EditableInput
            label="Email Address"
            value={data?.email || ""}
            onChange={(e) => handleChange("email", e.target.value)}
            disabled={!editMode}
            type="email"
          />
        </Box>
        <Box sx={styles.flexBoxItem}>
          <EditableInput
            label="Account Name"
            value={data?.companyName || ""}
            onChange={(e) => handleChange("companyName", e.target.value)}
            disabled={!editMode}
            errors={errors?.companyName}
            required={true}
          />
          <EditableInput
            label="Employee Role"
            value={data?.employeeTitle}
            onChange={(e) => handleChange("employeeTitle", e.target.value)}
            disabled={!editMode}
            type="select"
            selectOptions={titles?.map((item) => ({
              id: item,
              name: item,
            }))}
          />
          {/* <EditableInput
            label="Language"
            value={data?.Language}
            onChange={(e) => handleChange("Language", e.target.value)}
            disabled={!editMode}
            type="select"
            selectOptions={lang?.map((item) => ({
              id: item,
              name: item,
            }))}
          /> */}
        </Box>
      </Box>
    </Box>
  );
}

export default GeneralDetails;
