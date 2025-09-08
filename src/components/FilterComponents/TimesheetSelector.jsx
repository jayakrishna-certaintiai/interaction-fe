import React from "react";
import FilterCustomAutocomplete from "../Common/FilterCustomAutocomplete";

function TimesheetSelector({
  timesheets,
  timesheet,
  setTimesheet,
  disabled,
  error,
}) {
  return (
    <>
      <FilterCustomAutocomplete
        label=""
        placeholder="Select Timesheet"
        options={timesheets?.map((timesheet) => timesheet?.timesheetId) ?? []}
        value={timesheet}
        onChange={(event, newValue) => {
          setTimesheet(newValue ?? "");
        }}
        inputValue={timesheet}
        onInputChange={(event, newInputValue) => {
          setTimesheet(newInputValue ?? "");
        }}
        heading={"Timesheet"}
      />
    </>
  );
}

export default TimesheetSelector;
