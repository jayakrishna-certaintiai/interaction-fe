import React from "react";
import FilterCustomAutocomplete from "../Common/FilterCustomAutocomplete";

function PortfolioSelector({ clients, project, setProject, disabled, error }) {
  return (
    <>
      <FilterCustomAutocomplete
        label=""
        placeholder="Select Portfolio"
        options={
          clients?.map((client) => client?.name) ?? ["portfolio1"]
        }
        value={project}
        onChange={(event, newValue) => {
          setProject(newValue ?? "");
        }}
        inputValue={project}
        onInputChange={(event, newInputValue) => {
          setProject(newInputValue ?? "");
        }}
        heading={"Portfolio"}
      />
    </>
  );
}

export default PortfolioSelector;
