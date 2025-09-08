// ProjectSelect.js
import { Box, Checkbox, InputLabel } from "@mui/material";
import React from "react";
import CustomAutocomplete from "../../Common/CustomAutocomplete";

const styles = {
  label: {
    color: "#404040",
    fontSize: "14px",
    fontWeight: 600,
    mb: "5px",
  },
};

const ProjectSelect = ({
  isProjectEnabled,
  handleCheckboxChange,
  companyProjects,
  project,
  setProject,
  disabled,
  page,
  purpose
}) => {
  return (
    <Box>
      <InputLabel sx={{ ...styles.label }}>
        <Checkbox
          size="small"
          sx={{
            color: "#00A398",
            "&.Mui-checked": { color: "#00A398" },
            p: 0,
            pr: 1,
          }}
          checked={page === "project" ? true : isProjectEnabled}
          onChange={handleCheckboxChange}
          disabled={page === "project" ? true : false}
        />
        Project
      </InputLabel>
    <CustomAutocomplete
        label=""
        placeholder="Select Project"
        options={companyProjects?.map((project) => project?.projectName) ?? []}
        value={project}
        onChange={(event, newValue) => {
          setProject(newValue ?? "");
        }}
        inputValue={project}
        onInputChange={(event, newInputValue, reason) => {
          if (reason === "input") setProject(newInputValue ?? "");
          if (reason === "clear") setProject("");
        }}
        disabled={!isProjectEnabled || disabled}
      />
    </Box>
  );
};

export default ProjectSelect;
