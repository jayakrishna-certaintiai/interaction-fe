import React from "react";
import FilterCustomAutocomplete from "../Common/FilterCustomAutocomplete";

const StatusSelector = ({
  statuses,
  status,
  setStatus,
  placeholder = "Select Activity Status",
  heading = "Activity Status",
}) => (
  <>
    <FilterCustomAutocomplete
      label=""
      placeholder={placeholder}
      options={statuses?.map((status) => status) ?? []}
      value={status}
      onChange={(event, newValue) => {
        setStatus(newValue ?? "");
      }}
      inputValue={status}
      onInputChange={(event, newInputValue) => {
        setStatus(newInputValue ?? "");
      }}
      heading={heading}
    />
  </>
);

export default StatusSelector;
