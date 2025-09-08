import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useEffect } from "react";

const options = [
  {
    companyId: "CM0002",
    companyName: "Infinity Solutions - United Kingdom",
  },
  {
    companyId: "CM0003",
    companyName: "Infinity Solutions - United States of America",
  },
];

export default function SearchAndSelect() {
  const [value, setValue] = React.useState(options[0].companyId);
  const [inputValue, setInputValue] = React.useState("");



  return (
    <div>
      <div>{`value: ${value !== null ? `'${value}'` : "null"}`}</div>
      <div>{`inputValue: '${inputValue}'`}</div>
      <br />
      <Autocomplete
        value={value}
        onChange={(event, newValue) => {

        }}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {

        }}
        id="controllable-states-demo"
        options={options}
        getOptionLabel= {(option) => option.companyName}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField  {...params} label="Controllable" />}
      />
    </div>
  );
}
