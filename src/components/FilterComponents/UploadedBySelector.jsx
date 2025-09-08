import React from "react";
import FilterCustomAutocomplete from "../Common/FilterCustomAutocomplete";

function UploadBySelector({ companyProjects, project, setProject, disabled }) {
  return (
    <>
      <FilterCustomAutocomplete
        label=""
        placeholder="Select Contact"
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
        heading={"Uploaded By"}
      />
    </>
  );
}

export default UploadBySelector;
