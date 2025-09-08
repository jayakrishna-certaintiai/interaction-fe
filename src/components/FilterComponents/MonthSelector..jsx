import React from "react";
import FilterCustomAutocomplete from "../Common/FilterCustomAutocomplete";

function MonthSelector({ monthNames, month, setMonth, disabled, error }) {
  return (
    <>
      <FilterCustomAutocomplete
        label=""
        placeholder="Select Month"
        options={monthNames?.map((month) => month) ?? []}
        value={month}
        onChange={(event, newValue) => {
          setMonth(newValue ?? "");
        }}
        inputValue={month}
        onInputChange={(event, newInputValue) => {
          setMonth(newInputValue ?? "");
        }}
        heading={"Month"}
      />
    </>
  );
}

export default MonthSelector;
