import React from "react";
import FilterCustomAutocomplete from "../Common/FilterCustomAutocomplete";

const ActivityTypeSelector = ({ activities, activity, setActivity }) => (
  <>
    <FilterCustomAutocomplete
      label=""
      placeholder="Select Activity Type"
      options={activities?.map((activity) => activity) ?? []}
      value={activity}
      onChange={(event, newValue) => {
        setActivity(newValue ?? "");
      }}
      inputValue={activity}
      onInputChange={(event, newInputValue) => {
        setActivity(newInputValue ?? "");
      }}
      heading={"Activity Type"}
    />
  </>
);

export default ActivityTypeSelector;
