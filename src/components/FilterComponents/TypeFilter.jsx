import React from "react";
import FilterCustomAutocomplete from "../Common/FilterCustomAutocomplete";

function TypeFilter({ types, type, setType, disabled }) {
  return (
    <>
      <FilterCustomAutocomplete
        label=""
        placeholder="Select Type"
        options={types?.map((type) => type) ?? []}
        value={type}
        onChange={(event, newValue) => {
          setType(newValue ?? "");
        }}
        inputValue={type}
        onInputChange={(event, newInputValue) => {
          setType(newInputValue ?? "");
        }}
        heading={"Type"}
      />
    </>
  );
}

export default TypeFilter;
