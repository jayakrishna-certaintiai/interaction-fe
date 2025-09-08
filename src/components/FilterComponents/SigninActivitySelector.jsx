import React from "react";
import FilterCustomAutocomplete from "../Common/FilterCustomAutocomplete";

function SigninActivitySelector({ signinActivities, signin, setSignin }) {
  return (
    <>
      <FilterCustomAutocomplete
        label=""
        placeholder="Select Sign In Activity"
        options={signinActivities?.map((act) => act) ?? []}
        value={signin}
        onChange={(event, newValue) => {
          setSignin(newValue ?? "");
        }}
        inputValue={signin}
        onInputChange={(event, newInputValue) => {
          setSignin(newInputValue ?? "");
        }}
        heading={"Sign In Activity"}
      />
    </>
  );
}

export default SigninActivitySelector;
