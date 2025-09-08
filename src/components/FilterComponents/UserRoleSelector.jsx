import React from "react";
import FilterCustomAutocomplete from "../Common/FilterCustomAutocomplete";

function UserRoleSelector({ userRolesList, role, setRole }) {
  return (
    <>
      <FilterCustomAutocomplete
        label=""
        placeholder="Select User Role"
        options={userRolesList?.map((user) => user?.role) ?? []}
        value={role}
        onChange={(event, newValue) => {
          setRole(newValue ?? "");
        }}
        inputValue={role}
        onInputChange={(event, newInputValue) => {
          setRole(newInputValue ?? "");
        }}
        heading={"User Role"}
      />
    </>
  );
}

export default UserRoleSelector;
